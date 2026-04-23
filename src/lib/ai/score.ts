import OpenAI from "openai"
import { z } from "zod"

let _openai: OpenAI
function getOpenAI() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured")
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

interface ChangeToAnalyze {
  productName: string
  competitor: string | null
  changeType: string
  previousPrice: string | null
  newPrice: string | null
  previousStatus: string | null
  newStatus: string | null
}

export interface AnalyzedChange {
  importanceScore: number
  reasoning: string
}

const scoreItemSchema = z.object({
  score: z.number().min(0).max(100),
  reason: z.string(),
})

const scoresArraySchema = z.array(scoreItemSchema)

export async function analyzeStockChanges(
  changes: ChangeToAnalyze[]
): Promise<AnalyzedChange[]> {
  if (changes.length === 0) return []

  if (!process.env.OPENAI_API_KEY) {
    console.warn("[AI Score] OPENAI_API_KEY not set, skipping analysis")
    return changes.map(() => ({
      importanceScore: 0,
      reasoning: "AI analysis not configured",
    }))
  }

  const changesList = changes
    .map(
      (c, i) =>
        `[${i}] Product: ${c.productName}${c.competitor ? ` (competitor: ${c.competitor})` : ""}
Change: ${c.changeType}
Price: ${c.previousPrice ?? "?"} → ${c.newPrice ?? "?"}
Stock: ${c.previousStatus ?? "?"} → ${c.newStatus ?? "?"}`
    )
    .join("\n\n")

  const prompt = `You are a competitive intelligence engine for e-commerce sellers.

Analyze each stock/price change below and score its importance from 0 to 100:
- 90-100: Critical opportunity — competitor out of stock or major price increase (chance to capture their customers)
- 70-89: Important — significant price drop by competitor or product back in stock
- 40-69: Moderate — minor price change, worth noting
- 0-39: Low importance — negligible change

For each change, respond with a JSON array of objects with "score" (number) and "reason" (one actionable sentence for the seller).

Changes:
${changesList}

Respond ONLY with a JSON array, no markdown, no extra text:
[{"score": 95, "reason": "Competitor out of stock — run ads targeting their product keywords now"}, ...]`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await getOpenAI().chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: Math.max(1000, changes.length * 80),
      },
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    const text = response.choices[0]?.message?.content?.trim() ?? "[]"
    const cleaned = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "")

    let rawScores: unknown
    try {
      rawScores = JSON.parse(cleaned)
    } catch {
      console.error("[AI Score] Failed to parse JSON response:", text.slice(0, 200))
      return changes.map(() => ({
        importanceScore: 0,
        reasoning: "Analysis failed: invalid AI response",
      }))
    }

    const parsed = scoresArraySchema.safeParse(rawScores)

    if (!parsed.success) {
      console.error("[AI Score] Response validation failed:", parsed.error.message)
      return changes.map(() => ({
        importanceScore: 0,
        reasoning: "Analysis failed: unexpected format",
      }))
    }

    return changes.map((_, i) => {
      const s = parsed.data[i]
      if (!s) {
        return { importanceScore: 0, reasoning: "Score missing from AI response" }
      }
      return {
        importanceScore: Math.min(100, Math.max(0, s.score)),
        reasoning: s.reason,
      }
    })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[AI Score] Request timed out after 15s")
    } else {
      console.error("[AI Score] Error:", error)
    }
    return changes.map(() => ({
      importanceScore: 0,
      reasoning: "Analysis unavailable",
    }))
  }
}

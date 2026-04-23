import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import type { AdapterAccountType } from "next-auth/adapters"

// Enums
export const planEnum = pgEnum("plan", ["free", "pro"])
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
])

// ============================================
// NextAuth required tables
// ============================================

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  plan: planEnum("plan").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// ============================================
// Subscriptions
// ============================================

export const subscriptions = pgTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  status: subscriptionStatusEnum("status").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ============================================
// Juristea — Law Firm Management
// ============================================

export const caseStatusEnum = pgEnum("case_status", [
  "active",
  "archived",
  "closed",
])

export const deadlineStatusEnum = pgEnum("deadline_status", [
  "pending",
  "upcoming",
  "expired",
  "completed",
])

export const notificationTypeEnum = pgEnum("notification_type", [
  "sentencia",
  "providencia",
  "auto",
  "diligencia",
  "emplazamiento",
  "requerimiento",
  "other",
])

export const clients = pgTable("clients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  nif: text("nif"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const cases = pgTable("cases", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  caseNumber: text("case_number"),
  nig: text("nig"),
  court: text("court"),
  jurisdiction: text("jurisdiction"),
  status: caseStatusEnum("status").default("active").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const lexnetNotifications = pgTable("lexnet_notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
  lexnetId: text("lexnet_id"),
  type: notificationTypeEnum("type").default("other").notNull(),
  subject: text("subject").notNull(),
  sender: text("sender"),
  receivedAt: timestamp("received_at").notNull(),
  readAt: timestamp("read_at"),
  fileUrl: text("file_url"),
  metadata: text("metadata"),
  aiSummary: text("ai_summary"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const deadlines = pgTable("deadlines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "cascade" }),
  notificationId: text("notification_id").references(
    () => lexnetNotifications.id,
    { onDelete: "set null" }
  ),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: deadlineStatusEnum("status").default("pending").notNull(),
  alertDays: integer("alert_days").default(3).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
})

export const timeEntries = pgTable("time_entries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  minutes: integer("minutes").notNull(),
  date: timestamp("date").notNull(),
  billable: boolean("billable").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================
// Agenda & Contacts
// ============================================

export const eventTypeEnum = pgEnum("event_type", [
  "vista",
  "juicio",
  "reunion",
  "llamada",
  "plazo",
  "declaracion",
  "mediacion",
  "otro",
])

export const contactRoleEnum = pgEnum("contact_role", [
  "cliente",
  "contrario",
  "procurador",
  "perito",
  "testigo",
  "notario",
  "mediador",
  "otro",
])

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  type: eventTypeEnum("type").default("otro").notNull(),
  location: text("location"),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
  allDay: boolean("all_day").default(false).notNull(),
  color: text("color"),
  remindMinutesBefore: integer("remind_minutes_before").default(60),
  whatsappReminder: boolean("whatsapp_reminder").default(false).notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const contacts = pgTable("contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  role: contactRoleEnum("role").default("otro").notNull(),
  email: text("email"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  company: text("company"),
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const eventContacts = pgTable(
  "event_contacts",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    contactId: text("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
  },
  (ec) => [primaryKey({ columns: [ec.eventId, ec.contactId] })]
)

export const whatsappMessages = pgTable("whatsapp_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contactId: text("contact_id").references(() => contacts.id, {
    onDelete: "set null",
  }),
  eventId: text("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  direction: text("direction").notNull(), // "outgoing" | "incoming"
  status: text("status").default("pending").notNull(), // "pending" | "sent" | "delivered" | "read" | "failed"
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const notificationSettings = pgTable("notification_settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  emailEnabled: boolean("email_enabled").default(true).notNull(),
  slackWebhookUrl: text("slack_webhook_url"),
  telegramChatId: text("telegram_chat_id"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const activityLogs = pgTable("activity_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  subscriptions: many(subscriptions),
  clients: many(clients),
  cases: many(cases),
  lexnetNotifications: many(lexnetNotifications),
  deadlines: many(deadlines),
  documents: many(documents),
  timeEntries: many(timeEntries),
  events: many(events),
  contacts: many(contacts),
  whatsappMessages: many(whatsappMessages),
  notificationSettings: one(notificationSettings),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  cases: many(cases),
}))

export const casesRelations = relations(cases, ({ one, many }) => ({
  user: one(users, { fields: [cases.userId], references: [users.id] }),
  client: one(clients, { fields: [cases.clientId], references: [clients.id] }),
  lexnetNotifications: many(lexnetNotifications),
  deadlines: many(deadlines),
  documents: many(documents),
  timeEntries: many(timeEntries),
}))

export const lexnetNotificationsRelations = relations(
  lexnetNotifications,
  ({ one, many }) => ({
    user: one(users, {
      fields: [lexnetNotifications.userId],
      references: [users.id],
    }),
    case: one(cases, {
      fields: [lexnetNotifications.caseId],
      references: [cases.id],
    }),
    deadlines: many(deadlines),
  })
)

export const deadlinesRelations = relations(deadlines, ({ one }) => ({
  user: one(users, { fields: [deadlines.userId], references: [users.id] }),
  case: one(cases, { fields: [deadlines.caseId], references: [cases.id] }),
  notification: one(lexnetNotifications, {
    fields: [deadlines.notificationId],
    references: [lexnetNotifications.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
  case: one(cases, { fields: [documents.caseId], references: [cases.id] }),
}))

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, { fields: [timeEntries.userId], references: [users.id] }),
  case: one(cases, { fields: [timeEntries.caseId], references: [cases.id] }),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
  case: one(cases, { fields: [events.caseId], references: [cases.id] }),
  eventContacts: many(eventContacts),
  whatsappMessages: many(whatsappMessages),
}))

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, { fields: [contacts.userId], references: [users.id] }),
  client: one(clients, { fields: [contacts.clientId], references: [clients.id] }),
  case: one(cases, { fields: [contacts.caseId], references: [cases.id] }),
  eventContacts: many(eventContacts),
  whatsappMessages: many(whatsappMessages),
}))

export const eventContactsRelations = relations(eventContacts, ({ one }) => ({
  event: one(events, { fields: [eventContacts.eventId], references: [events.id] }),
  contact: one(contacts, { fields: [eventContacts.contactId], references: [contacts.id] }),
}))

export const whatsappMessagesRelations = relations(whatsappMessages, ({ one }) => ({
  user: one(users, { fields: [whatsappMessages.userId], references: [users.id] }),
  contact: one(contacts, { fields: [whatsappMessages.contactId], references: [contacts.id] }),
  event: one(events, { fields: [whatsappMessages.eventId], references: [events.id] }),
}))

export const notificationSettingsRelations = relations(
  notificationSettings,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationSettings.userId],
      references: [users.id],
    }),
  })
)

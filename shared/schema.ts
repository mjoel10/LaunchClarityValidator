import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - handles both consultants and clients
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isClient: boolean("is_client").notNull().default(true),
  isConsultant: boolean("is_consultant").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sprint tiers enum
export const sprintTiers = ["discovery", "feasibility", "validation"] as const;
export const sprintStatuses = ["draft", "payment_pending", "active", "completed", "cancelled"] as const;

// Sprints table
export const sprints = pgTable("sprints", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => users.id).notNull(),
  consultantId: integer("consultant_id").references(() => users.id),
  tier: text("tier").$type<typeof sprintTiers[number]>().notNull(),
  status: text("status").$type<typeof sprintStatuses[number]>().notNull().default("draft"),
  companyName: text("company_name").notNull(),
  isPartnershipEvaluation: boolean("is_partnership_evaluation").notNull().default(false),
  progress: integer("progress").notNull().default(0), // 0-100
  price: integer("price").notNull(), // in cents
  paidAt: timestamp("paid_at"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Intake form data
export const intakeData = pgTable("intake_data", {
  id: serial("id").primaryKey(),
  sprintId: integer("sprint_id").references(() => sprints.id).notNull(),
  
  // Business Overview
  businessModel: text("business_model"), // B2B, B2C, B2B2C, B2G, Marketplace
  productType: text("product_type"), // SaaS, Service, Physical, Marketplace, App
  currentStage: text("current_stage"), // Idea, Pre-launch, MVP, Revenue < $100K, Revenue > $100K
  industry: text("industry"),
  geographicMarkets: text("geographic_markets").array(),
  
  // Operational Complexity
  salesComplexity: text("sales_complexity"), // Low/Med/High
  salesMotion: text("sales_motion"), // Self-serve, Inside, Field, Hybrid
  deliveryComplexity: text("delivery_complexity"), // Low/Med/High
  primaryDeliveryModel: text("primary_delivery_model"), // Digital, Physical, Service-heavy, Hybrid
  
  // Customer & Value Prop
  targetCustomerDescription: text("target_customer_description"),
  coreProblem: text("core_problem"),
  valueProposition: text("value_proposition"),
  estimatedPricePoint: decimal("estimated_price_point"),
  currency: text("currency").default("USD"),
  
  // Competitive Landscape
  competitors: jsonb("competitors").$type<Array<{name: string, differentiator: string}>>(),
  uniqueAdvantage: text("unique_advantage"),
  
  // Validation Intent
  assumptionsToValidate: text("assumptions_to_validate").array(),
  primaryValidationGoals: text("primary_validation_goals").array(),
  criticalQuestion: text("critical_question"),
  previouslyTested: boolean("previously_tested"),
  previousTestingDescription: text("previous_testing_description"),
  hasTestingAudience: boolean("has_testing_audience"),
  
  // Partnership Evaluation (optional)
  evaluatedPartner: text("evaluated_partner"),
  partnerType: text("partner_type"), // Platform, Reseller, Tech Integration, Co-Marketing, Other
  relationshipStatus: text("relationship_status"), // None, Early convo, Signed LOI, Beta
  integrationType: text("integration_type"), // API, White-label, Co-built, Bundled Offer
  primaryPartnershipGoal: text("primary_partnership_goal"), // New Revenue, Churn Reduction, Market Entry, Strategic Leverage
  keyRisks: text("key_risks"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sprint modules - tracks completion and data for each module
export const sprintModules = pgTable("sprint_modules", {
  id: serial("id").primaryKey(),
  sprintId: integer("sprint_id").references(() => sprints.id).notNull(),
  moduleType: text("module_type").notNull(), // market_simulation, assumptions, competitive_intel, etc.
  isCompleted: boolean("is_completed").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  data: jsonb("data"), // Module-specific data storage
  aiAnalysis: jsonb("ai_analysis"), // AI-generated insights
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments system
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  sprintId: integer("sprint_id").references(() => sprints.id).notNull(),
  moduleId: integer("module_id").references(() => sprintModules.id),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  clientSprints: many(sprints, { relationName: "client" }),
  consultantSprints: many(sprints, { relationName: "consultant" }),
  comments: many(comments),
}));

export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  client: one(users, {
    fields: [sprints.clientId],
    references: [users.id],
    relationName: "client",
  }),
  consultant: one(users, {
    fields: [sprints.consultantId],
    references: [users.id],
    relationName: "consultant",
  }),
  intakeData: one(intakeData),
  modules: many(sprintModules),
  comments: many(comments),
}));

export const intakeDataRelations = relations(intakeData, ({ one }) => ({
  sprint: one(sprints, {
    fields: [intakeData.sprintId],
    references: [sprints.id],
  }),
}));

export const sprintModulesRelations = relations(sprintModules, ({ one, many }) => ({
  sprint: one(sprints, {
    fields: [sprintModules.sprintId],
    references: [sprints.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  sprint: one(sprints, {
    fields: [comments.sprintId],
    references: [sprints.id],
  }),
  module: one(sprintModules, {
    fields: [comments.moduleId],
    references: [sprintModules.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSprintSchema = createInsertSchema(sprints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntakeDataSchema = createInsertSchema(intakeData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSprintModuleSchema = createInsertSchema(sprintModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Sprint = typeof sprints.$inferSelect;
export type InsertSprint = z.infer<typeof insertSprintSchema>;
export type IntakeData = typeof intakeData.$inferSelect;
export type InsertIntakeData = z.infer<typeof insertIntakeDataSchema>;
export type SprintModule = typeof sprintModules.$inferSelect;
export type InsertSprintModule = z.infer<typeof insertSprintModuleSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// Sprint with relations type
export type SprintWithRelations = Sprint & {
  client: User;
  consultant?: User;
  intakeData?: IntakeData;
  modules: SprintModule[];
  comments: Comment[];
};

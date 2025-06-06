import { 
  users, sprints, intakeData, sprintModules, comments,
  type User, type InsertUser, type Sprint, type InsertSprint,
  type IntakeData, type InsertIntakeData, type SprintModule, type InsertSprintModule,
  type Comment, type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Sprint methods
  getSprintsByUser(userId: number): Promise<Sprint[]>;
  getSprintById(id: number): Promise<Sprint | undefined>;
  createSprint(insertSprint: InsertSprint): Promise<Sprint>;
  updateSprint(id: number, updates: Partial<Sprint>): Promise<Sprint>;
  initializeSprintModules(sprintId: number, tier: string): Promise<void>;

  // Intake data methods
  createIntakeData(insertIntakeData: InsertIntakeData): Promise<IntakeData>;
  updateIntakeData(sprintId: number, updates: Partial<IntakeData>): Promise<IntakeData>;
  upsertIntakeData(insertIntakeData: InsertIntakeData): Promise<IntakeData>;
  getIntakeDataBySprintId(sprintId: number): Promise<IntakeData | undefined>;

  // Sprint module methods
  getSprintModules(sprintId: number): Promise<SprintModule[]>;
  getSprintModuleById(id: number): Promise<SprintModule | undefined>;
  updateSprintModule(id: number, updates: Partial<SprintModule>): Promise<SprintModule>;
  updateSprintModuleByType(sprintId: number, moduleType: string, updates: Partial<SprintModule>): Promise<SprintModule>;

  // Comment methods
  getCommentsBySprintId(sprintId: number): Promise<Comment[]>;
  createComment(insertComment: InsertComment): Promise<Comment>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSprintsByUser(userId: number, isConsultant: boolean = false): Promise<Sprint[]> {
    if (isConsultant) {
      return await db.select().from(sprints).where(eq(sprints.consultantId, userId));
    }
    return await db.select().from(sprints).where(eq(sprints.clientId, userId));
  }

  async getSprintById(id: number): Promise<Sprint | undefined> {
    const [sprint] = await db.select().from(sprints).where(eq(sprints.id, id));
    return sprint || undefined;
  }

  async createSprint(insertSprint: InsertSprint): Promise<Sprint> {
    const [sprint] = await db
      .insert(sprints)
      .values(insertSprint as any)
      .returning();
    return sprint;
  }

  async updateSprint(id: number, updates: Partial<Sprint>): Promise<Sprint> {
    const [sprint] = await db
      .update(sprints)
      .set(updates)
      .where(eq(sprints.id, id))
      .returning();
    return sprint;
  }

  async initializeSprintModules(sprintId: number, tier: string): Promise<void> {
    const allModules = this.getAllModulesWithTierInfo(tier);
    
    const modulesToInsert = allModules.map((module: {type: string, isLocked: boolean, requiredTier: string}) => ({
      sprintId,
      moduleType: module.type,
      isLocked: module.isLocked,
      isCompleted: false,
      data: null,
    }));

    await db.insert(sprintModules).values(modulesToInsert);
  }

  private getAllModulesWithTierInfo(tier: string): Array<{type: string, isLocked: boolean, requiredTier: string}> {
    const discoveryModules = [
      { type: 'intake', isLocked: false, requiredTier: 'discovery' },
      { type: 'assumptions', isLocked: false, requiredTier: 'discovery' },
      { type: 'market_sizing', isLocked: false, requiredTier: 'discovery' },
      { type: 'competitive_intel', isLocked: false, requiredTier: 'discovery' },
      { type: 'risk_assessment', isLocked: false, requiredTier: 'discovery' },
      { type: 'market_simulation', isLocked: false, requiredTier: 'discovery' },
      { type: 'swot_analysis', isLocked: false, requiredTier: 'discovery' },
      { type: 'go_defer_decision', isLocked: false, requiredTier: 'discovery' }
    ];

    const feasibilityModules = [
      { type: 'business_model_simulator', isLocked: tier === 'discovery', requiredTier: 'feasibility' },
      { type: 'channel_recommender', isLocked: tier === 'discovery', requiredTier: 'feasibility' },
      { type: 'async_interviews', isLocked: tier === 'discovery', requiredTier: 'feasibility' },
      { type: 'demand_test', isLocked: tier === 'discovery', requiredTier: 'feasibility' },
      { type: 'go_pivot_defer', isLocked: tier === 'discovery', requiredTier: 'feasibility' }
    ];

    const validationModules = [
      { type: 'full_interviews', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'multi_channel_tests', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'enhanced_market_intel', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'strategic_analysis', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'blue_ocean_strategy', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'implementation_roadmap', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'action_plans', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'battlecards', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'partnership_evaluation', isLocked: tier !== 'validation', requiredTier: 'validation' },
      { type: 'go_pivot_kill', isLocked: tier !== 'validation', requiredTier: 'validation' }
    ];

    return [...discoveryModules, ...feasibilityModules, ...validationModules];
  }

  async createIntakeData(insertIntakeData: InsertIntakeData): Promise<IntakeData> {
    const [data] = await db
      .insert(intakeData)
      .values(insertIntakeData as any)
      .returning();
    return data;
  }

  async updateIntakeData(sprintId: number, updates: Partial<IntakeData>): Promise<IntakeData> {
    const [data] = await db
      .update(intakeData)
      .set(updates as any)
      .where(eq(intakeData.sprintId, sprintId))
      .returning();
    return data;
  }

  async upsertIntakeData(insertIntakeData: InsertIntakeData): Promise<IntakeData> {
    // Check if intake data already exists for this sprint
    const existing = await this.getIntakeDataBySprintId(insertIntakeData.sprintId);
    
    if (existing) {
      // Update existing record
      const updateData = { ...insertIntakeData };
      delete (updateData as any).sprintId; // Remove sprintId from update data
      return await this.updateIntakeData(insertIntakeData.sprintId, updateData);
    } else {
      // Create new record
      return await this.createIntakeData(insertIntakeData);
    }
  }

  async getIntakeDataBySprintId(sprintId: number): Promise<IntakeData | undefined> {
    const [data] = await db.select().from(intakeData).where(eq(intakeData.sprintId, sprintId));
    return data || undefined;
  }

  async getSprintModules(sprintId: number): Promise<SprintModule[]> {
    return await db.select().from(sprintModules).where(eq(sprintModules.sprintId, sprintId));
  }

  async getSprintModuleById(id: number): Promise<SprintModule | undefined> {
    const [module] = await db.select().from(sprintModules).where(eq(sprintModules.id, id));
    return module || undefined;
  }

  async updateSprintModule(id: number, updates: Partial<SprintModule>): Promise<SprintModule> {
    const [module] = await db
      .update(sprintModules)
      .set(updates)
      .where(eq(sprintModules.id, id))
      .returning();
    return module;
  }

  async updateSprintModuleByType(sprintId: number, moduleType: string, updates: Partial<SprintModule>): Promise<SprintModule> {
    const [module] = await db
      .update(sprintModules)
      .set(updates)
      .where(and(eq(sprintModules.sprintId, sprintId), eq(sprintModules.moduleType, moduleType)))
      .returning();
    return module;
  }

  async getCommentsBySprintId(sprintId: number): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.sprintId, sprintId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }
}

export const storage = new DatabaseStorage();
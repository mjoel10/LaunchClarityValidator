import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema, insertSprintSchema, insertIntakeDataSchema, insertCommentSchema, sprintModules } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateMarketSimulation, generateAssumptionAnalysis, generateCompetitiveIntelligence, generateMarketSizing, generateRiskAssessment, generateGoDecision, generateAssumptions, generateAssumptionReport, generateAssumptionValidationPlaybook, generateMarketSizingReport, generateCustomerVoiceSimulation, generatePartnershipViability } from "./openai";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

// Sprint tier pricing in cents
const SPRINT_PRICING = {
  discovery: 500000, // $5,000
  feasibility: 1500000, // $15,000
  validation: 3500000, // $35,000
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Sprint routes
  app.get("/api/sprints", async (req, res) => {
    try {
      // For unified dashboard, return all sprints for consultant ID 1
      const consultantId = 1;
      const sprints = await storage.getSprintsByUser(consultantId, true);
      res.json(sprints);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sprints/:id", async (req, res) => {
    try {
      const sprint = await storage.getSprintById(Number(req.params.id));
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
      res.json(sprint);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Save sprint progress
  app.post("/api/sprints/:id/save", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const sprint = await storage.getSprintById(sprintId);
      
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      // Update the sprint's updatedAt timestamp to indicate save
      const updatedSprint = await storage.updateSprint(sprintId, {
        updatedAt: new Date(),
      });

      res.json({ 
        message: "Sprint saved successfully",
        savedAt: updatedSprint.updatedAt 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error saving sprint: " + error.message });
    }
  });

  app.post("/api/sprints", async (req, res) => {
    try {
      // Create a user for the client first
      const client = await storage.createUser({
        email: req.body.clientEmail,
        username: req.body.clientEmail,
        password: 'temp_password',
        name: req.body.clientName,
        isClient: true,
        isConsultant: false,
      });

      const sprintData = {
        clientId: client.id,
        consultantId: 1, // Mock consultant ID
        tier: req.body.tier,
        status: "draft" as const,
        companyName: req.body.companyName,
        isPartnershipEvaluation: req.body.isPartnershipEvaluation || false,
        progress: 0,
        price: SPRINT_PRICING[req.body.tier as keyof typeof SPRINT_PRICING],
      };
      
      const sprint = await storage.createSprint(sprintData);
      res.json(sprint);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate Stripe payment link for sprint
  app.post("/api/sprints/:id/payment-link", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const sprint = await storage.getSprintById(sprintId);
      
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
      
      // For now, create a simple payment URL (will implement full Stripe integration later)
      const mockPaymentUrl = `https://buy.stripe.com/test_mock_payment_${sprint.id}?price=${sprint.price}`;
      
      // Update sprint with payment link
      await storage.updateSprint(sprint.id, {
        stripePaymentUrl: mockPaymentUrl,
        status: 'payment_pending',
      });
      
      res.json({ 
        paymentUrl: mockPaymentUrl,
        paymentLinkId: `mock_${sprint.id}`,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment link: " + error.message });
    }
  });

  // Bypass payment for testing (mark sprint as paid)
  app.post("/api/sprints/:id/mark-paid", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const sprint = await storage.getSprintById(sprintId);
      
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
      
      // Mark sprint as paid and active
      await storage.updateSprint(sprint.id, {
        status: 'active',
        paidAt: new Date(),
      });
      
      // Initialize sprint modules based on tier
      await storage.initializeSprintModules(sprint.id, sprint.tier);
      
      res.json({ 
        message: "Sprint marked as paid and activated",
        sprint: await storage.getSprintById(sprint.id)
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error marking sprint as paid: " + error.message });
    }
  });

  // Stripe webhook for payment confirmation
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const event = req.body;
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const sprintId = paymentIntent.metadata.sprintId;
        
        if (sprintId) {
          await storage.updateSprint(Number(sprintId), {
            status: 'active',
            paidAt: new Date(),
          });
          
          // Initialize sprint modules based on tier
          const sprint = await storage.getSprintById(Number(sprintId));
          if (sprint) {
            await storage.initializeSprintModules(Number(sprintId), sprint.tier);
          }
        }
      }
      
      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Regenerate sprint modules with correct tier access (preserves completed modules)
  app.post("/api/sprints/:id/regenerate-modules", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const sprint = await storage.getSprintById(sprintId);
      
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      // Get existing modules to preserve completed ones with data
      const existingModules = await storage.getSprintModules(sprintId);
      const completedModules = existingModules.filter((m: any) => m.isCompleted && m.aiAnalysis);
      
      // Only delete incomplete modules without saved data
      for (const module of existingModules) {
        if (!module.isCompleted || !module.aiAnalysis) {
          await db.delete(sprintModules).where(eq(sprintModules.id, module.id));
        }
      }
      
      // Reinitialize missing modules with correct tier access
      await storage.initializeSprintModules(sprintId, sprint.tier);
      
      // Get updated modules
      const updatedModules = await storage.getSprintModules(sprintId);
      
      res.json(updatedModules);
    } catch (error: any) {
      res.status(500).json({ message: "Error regenerating modules: " + error.message });
    }
  });

  // Intake form routes
  app.post("/api/sprints/:id/intake", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      
      // Transform the request data to match the schema
      const transformedData = {
        ...req.body,
        sprintId,
        // Handle competitors array transformation if individual fields are sent
        competitors: req.body.competitors || [
          { name: req.body.competitor1Name || '', differentiator: req.body.competitor1Differentiator || '' },
          { name: req.body.competitor2Name || '', differentiator: req.body.competitor2Differentiator || '' },
          { name: req.body.competitor3Name || '', differentiator: req.body.competitor3Differentiator || '' }
        ].filter(comp => comp.name.trim() !== ''),
      };
      
      // Remove individual competitor fields from the data to avoid schema conflicts
      delete transformedData.competitor1Name;
      delete transformedData.competitor1Differentiator;
      delete transformedData.competitor2Name;
      delete transformedData.competitor2Differentiator;
      delete transformedData.competitor3Name;
      delete transformedData.competitor3Differentiator;
      
      const intakeDataPayload = insertIntakeDataSchema.parse(transformedData);
      
      const intake = await storage.upsertIntakeData(intakeDataPayload);
      
      // Generate initial AI analysis based on intake data
      const sprint = await storage.getSprintById(sprintId);
      if (sprint && sprint.tier) {
        await generateInitialAnalysis(sprintId, intake, sprint.tier);
      }
      
      res.json(intake);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get consultant intake forms
  app.get("/api/consultant/intake-forms", async (req, res) => {
    try {
      const consultantId = 1; // Mock consultant ID
      const sprints = await storage.getSprintsByUser(consultantId, true);
      
      // Get intake data for each sprint
      const sprintsWithIntake = await Promise.all(
        sprints.map(async (sprint) => {
          const intake = await storage.getIntakeDataBySprintId(sprint.id);
          return {
            ...sprint,
            intakeData: intake,
            hasIntake: !!intake,
            intakeStatus: intake ? 'completed' : 'pending'
          };
        })
      );
      
      res.json(sprintsWithIntake.filter(s => s.hasIntake));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sprints/:id/intake", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      res.json(intake);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Sprint modules routes
  app.get("/api/sprints/:id/modules", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      
      // Add cache-busting headers
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      const modules = await storage.getSprintModules(sprintId);
      res.json(modules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const moduleId = Number(req.params.id);
      const module = await storage.getSprintModuleById(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/modules/:id", async (req, res) => {
    try {
      const moduleId = Number(req.params.id);
      const { data, isCompleted } = req.body;
      
      const module = await storage.updateSprintModule(moduleId, {
        data,
        isCompleted,
        updatedAt: new Date(),
      });
      
      res.json(module);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Comments routes
  app.get("/api/sprints/:id/comments", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const comments = await storage.getCommentsBySprintId(sprintId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate AI assumptions for assumption tracker
  app.post("/api/sprints/:id/generate-assumptions", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      const assumptions = await generateAssumptions(intake);
      
      // Save to sprint module data
      await storage.updateSprintModuleByType(sprintId, 'assumptions', {
        aiAnalysis: assumptions,
        updatedAt: new Date(),
      });
      
      res.json(assumptions);
    } catch (error: any) {
      console.error('Error generating assumptions:', error);
      res.status(500).json({ message: "Failed to generate assumptions: " + error.message });
    }
  });

  // Generate competitive intelligence analysis
  app.post("/api/sprints/:id/modules/competitive_intelligence/generate", async (req, res) => {
    try {
      console.log('Starting competitive intelligence generation...');
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        console.log('No intake data found for sprint:', sprintId);
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      console.log('Intake data found, calling OpenAI function...');
      const analysis = await generateCompetitiveIntelligence(intake);
      console.log('OpenAI function completed, saving to database...');
      
      // Save to sprint module and mark as completed
      await storage.updateSprintModuleByType(sprintId, 'competitive_intelligence', {
        aiAnalysis: analysis,
        isCompleted: true,
        updatedAt: new Date(),
      });
      
      console.log('Analysis saved successfully');
      res.json(analysis);
    } catch (error: any) {
      console.error('Error generating competitive intelligence:', error);
      res.status(500).json({ message: "Failed to generate competitive intelligence: " + error.message });
    }
  });

  // Generate risk assessment analysis
  app.post("/api/sprints/:id/modules/risk_assessment/generate", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      const analysis = await generateRiskAssessment(intake);
      
      // Save to sprint module and mark as completed
      await storage.updateSprintModuleByType(sprintId, 'risk_assessment', {
        aiAnalysis: analysis,
        isCompleted: true,
        updatedAt: new Date(),
      });
      
      res.json(analysis);
    } catch (error: any) {
      console.error('Error generating risk assessment:', error);
      res.status(500).json({ message: "Failed to generate risk assessment: " + error.message });
    }
  });

  // Generate customer voice simulation analysis
  app.post("/api/sprints/:id/modules/customer_voice_simulation/generate", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      const analysis = await generateCustomerVoiceSimulation(intake);
      
      // Save to sprint module and mark as completed
      await storage.updateSprintModuleByType(sprintId, 'customer_voice_simulation', {
        aiAnalysis: analysis,
        isCompleted: true,
        updatedAt: new Date(),
      });
      
      res.json(analysis);
    } catch (error: any) {
      console.error('Error generating customer voice simulation:', error);
      res.status(500).json({ message: "Failed to generate customer voice simulation: " + error.message });
    }
  });


  // Generate assumption validation report
  app.post("/api/sprints/:id/generate-assumption-report", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      const report = await generateAssumptionReport(intake);
      
      // Save to sprint module data
      await storage.updateSprintModuleByType(sprintId, 'assumption_tracker', {
        aiAnalysis: report,
        updatedAt: new Date(),
      });
      
      res.json(report);
    } catch (error: any) {
      console.error('Error generating assumption report:', error);
      res.status(500).json({ message: "Failed to generate assumption report: " + error.message });
    }
  });

  // Generate assumption validation playbook
  app.post("/api/sprints/:id/generate-assumption-playbook", async (req, res) => {
    console.log('=== STARTING ASSUMPTION PLAYBOOK ROUTE ===');
    try {
      const sprintId = Number(req.params.id);
      console.log(`1. Route handler started for sprint ID: ${sprintId}`);
      
      console.log('2. Fetching intake data...');
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        console.log('3. ERROR: No intake data found');
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      console.log('3. Intake data found, structure:', {
        companyName: intake.companyName,
        hasAssumption1: !!intake.assumption1,
        hasAssumption2: !!intake.assumption2,
        hasAssumption3: !!intake.assumption3,
        hasRisk1: !!intake.partnershipRisk1,
        hasRisk2: !!intake.partnershipRisk2,
        hasRisk3: !!intake.partnershipRisk3,
        hasRisk4: !!intake.partnershipRisk4,
        hasRisk5: !!intake.partnershipRisk5
      });
      
      console.log('4. CALLING generateAssumptionValidationPlaybook...');
      const { playbook } = await generateAssumptionValidationPlaybook(intake);
      console.log('5. Playbook generation completed successfully');
      
      console.log('6. Saving to database...');
      // Save to sprint module data
      await storage.updateSprintModuleByType(sprintId, 'assumption_tracker', {
        aiAnalysis: { playbook },
        isCompleted: true,
        updatedAt: new Date(),
      });
      console.log('7. Database save completed');
      
      console.log('8. Sending response...');
      res.json({ playbook });
    } catch (error: any) {
      console.error('=== ASSUMPTION PLAYBOOK ERROR ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: "Failed to generate assumption validation playbook: " + error.message });
    }
  });

  // Generate market sizing report
  app.post("/api/sprints/:id/generate-market-sizing-report", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      const reportData = await generateMarketSizingReport(intake);
      
      // Save to sprint module data with proper structure
      await storage.updateSprintModuleByType(sprintId, 'market_simulation', {
        aiAnalysis: reportData,
        isCompleted: true,
        updatedAt: new Date(),
      });
      
      res.json(reportData);
    } catch (error: any) {
      console.error('Error generating market sizing report:', error);
      res.status(500).json({ message: "Failed to generate market sizing report: " + error.message });
    }
  });

  // Generate partnership viability analysis
  app.post("/api/sprints/:id/modules/partnership_viability/generate", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      const intake = await storage.getIntakeDataBySprintId(sprintId);
      
      if (!intake) {
        return res.status(400).json({ message: "No intake data found for this sprint" });
      }
      
      if (!intake.isPartnershipEvaluation) {
        return res.status(400).json({ message: "Partnership viability analysis is only available for partnership evaluations" });
      }
      
      const analysis = await generatePartnershipViability(intake);
      
      // Save to sprint module and mark as completed
      await storage.updateSprintModuleByType(sprintId, 'partnership_viability', {
        aiAnalysis: analysis,
        isCompleted: true,
        updatedAt: new Date(),
      });
      
      res.json(analysis);
    } catch (error: any) {
      console.error('Error generating partnership viability analysis:', error);
      res.status(500).json({ message: "Failed to generate partnership viability analysis: " + error.message });
    }
  });

  // Generate comprehensive decision analysis
  app.post("/api/sprints/:id/generate-decision", async (req, res) => {
    try {
      const sprintId = Number(req.params.id);
      
      // Get sprint data and intake information
      const sprint = await storage.getSprintById(sprintId);
      const intakeData = await storage.getIntakeDataBySprintId(sprintId);
      const modules = await storage.getSprintModules(sprintId);
      
      if (!sprint || !intakeData) {
        return res.status(400).json({ message: "Missing sprint or intake data" });
      }
      
      // Filter completed modules (don't filter by report presence - let OpenAI function handle data extraction)
      const completedModules = modules.filter(module => module.isCompleted);
      
      console.log('=== API ROUTE DEBUG ===');
      console.log('Total modules:', modules.length);
      console.log('Completed modules:', completedModules.length);
      console.log('All module types:', modules.map(m => ({ type: m.moduleType, completed: m.isCompleted })));
      
      if (completedModules.length < 3) {
        return res.status(400).json({ 
          message: `Insufficient data: At least 3 completed modules required for decision analysis. Currently have ${completedModules.length} completed modules.` 
        });
      }
      
      // Generate comprehensive decision analysis
      const sprintData = {
        ...sprint,
        intakeData
      };
      
      const decisionAnalysis = await generateGoDecision(sprintData, completedModules);
      
      res.json(decisionAnalysis);
    } catch (error: any) {
      console.error('Error generating decision analysis:', error);
      res.status(500).json({ message: "Failed to generate decision analysis: " + error.message });
    }
  });

  // AI Analysis routes
  app.post("/api/modules/:id/regenerate-analysis", async (req, res) => {
    try {
      const moduleId = Number(req.params.id);
      const module = await storage.getSprintModuleById(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      const sprint = await storage.getSprintById(module.sprintId);
      const intake = await storage.getIntakeDataBySprintId(module.sprintId);
      
      if (!sprint || !intake) {
        return res.status(400).json({ message: "Missing sprint or intake data" });
      }
      
      let aiAnalysis;
      switch (module.moduleType) {
        case 'market_simulation':
          aiAnalysis = await generateMarketSimulation(intake);
          break;
        case 'assumptions':
          aiAnalysis = await generateAssumptionAnalysis(intake);
          break;
        case 'competitive_intel':
          aiAnalysis = await generateCompetitiveIntelligence(intake);
          break;
        case 'market_sizing':
          aiAnalysis = await generateMarketSizing(intake);
          break;
        case 'risk_assessment':
          aiAnalysis = await generateRiskAssessment(intake);
          break;
        default:
          return res.status(400).json({ message: "Unknown module type" });
      }
      
      const updatedModule = await storage.updateSprintModule(moduleId, {
        aiAnalysis,
        updatedAt: new Date(),
      });
      
      res.json(updatedModule);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateInitialAnalysis(sprintId: number, intake: any, tier: string) {
  try {
    // Generate market simulation for all tiers
    const marketSimulation = await generateMarketSimulation(intake);
    await storage.updateSprintModuleByType(sprintId, 'market_simulation', {
      aiAnalysis: marketSimulation,
      isCompleted: true,
    });

    // Generate assumption analysis for all tiers
    const assumptionAnalysis = await generateAssumptionAnalysis(intake);
    await storage.updateSprintModuleByType(sprintId, 'assumptions', {
      aiAnalysis: assumptionAnalysis,
      isCompleted: true,
    });

    // Generate competitive intelligence for all tiers
    const competitiveIntel = await generateCompetitiveIntelligence(intake);
    await storage.updateSprintModuleByType(sprintId, 'competitive_intel', {
      aiAnalysis: competitiveIntel,
      isCompleted: true,
    });

    // Generate market sizing for all tiers
    const marketSizing = await generateMarketSizing(intake);
    await storage.updateSprintModuleByType(sprintId, 'market_sizing', {
      aiAnalysis: marketSizing,
      isCompleted: true,
    });

    // Generate risk assessment for all tiers
    const riskAssessment = await generateRiskAssessment(intake);
    await storage.updateSprintModuleByType(sprintId, 'risk_assessment', {
      aiAnalysis: riskAssessment,
      isCompleted: true,
    });

    // Update sprint progress
    await storage.updateSprint(sprintId, {
      progress: 65, // Reflects completion of 5 out of 7 discovery modules
    });

  } catch (error) {
    console.error('Error generating initial analysis:', error);
  }
}

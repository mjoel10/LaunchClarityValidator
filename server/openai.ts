import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateMarketSimulation(intakeData: any) {
  try {
    const prompt = `
You are the LaunchClarity Analysis Engine. Generate a realistic market simulation based on this business information:

Business Model: ${intakeData.businessModel}
Product Type: ${intakeData.productType}
Current Stage: ${intakeData.currentStage}
Industry: ${intakeData.industry}
Target Customer: ${intakeData.targetCustomerDescription}
Core Problem: ${intakeData.coreProblem}
Value Proposition: ${intakeData.valueProposition}
Price Point: ${intakeData.estimatedPricePoint} ${intakeData.currency}

Generate a realistic market simulation with 100+ synthetic responses distributed as:
- 30% negative responses
- 40% skeptical responses  
- 20% interested responses
- 10% enthusiastic responses

Provide specific objections, positive signals, and persona analysis. Focus on realistic concerns like pricing, competition, usability, and value perception.

Respond with JSON in this exact format:
{
  "responseDistribution": {
    "negative": 30,
    "skeptical": 40,
    "interested": 20,
    "enthusiastic": 10,
    "totalResponses": 127
  },
  "keyInsights": [
    {
      "type": "positive",
      "title": "Strong Problem Fit",
      "description": "68% confirmed pain points"
    },
    {
      "type": "warning", 
      "title": "Price Sensitivity",
      "description": "45% cited cost concerns"
    },
    {
      "type": "insight",
      "title": "Feature Priority", 
      "description": "Integration #1 request"
    }
  ],
  "topObjections": [
    {
      "text": "Too expensive for our current budget constraints",
      "persona": "Enterprise IT Director",
      "category": "Price"
    },
    {
      "text": "We already have similar tools in place", 
      "persona": "Operations Manager",
      "category": "Competition"
    },
    {
      "text": "Not sure about the learning curve for our team",
      "persona": "Team Lead",
      "category": "Usability"
    }
  ],
  "positiveSignals": [
    {
      "text": "This could solve our biggest workflow bottleneck",
      "persona": "Product Manager", 
      "category": "Pain Point"
    },
    {
      "text": "The ROI calculation looks compelling",
      "persona": "Finance Director",
      "category": "Value"
    },
    {
      "text": "Would need to see integration capabilities first",
      "persona": "Technical Lead",
      "category": "Technical"
    }
  ],
  "personaAnalysis": [
    {
      "name": "Enterprise Buyer",
      "description": "IT Directors, CIOs",
      "interestLevel": 60,
      "priceSensitivity": "High",
      "quote": "Need to see clear ROI and integration path before considering",
      "color": "bg-primary"
    },
    {
      "name": "Team Leads", 
      "description": "Managers, Supervisors",
      "interestLevel": 75,
      "priceSensitivity": "Medium",
      "quote": "Could really help with team productivity if implementation goes smoothly",
      "color": "bg-secondary"
    },
    {
      "name": "End Users",
      "description": "Individual Contributors", 
      "interestLevel": 45,
      "priceSensitivity": "N/A",
      "quote": "Hope it doesn't complicate our current workflow too much",
      "color": "bg-accent"
    }
  ],
  "recommendations": {
    "immediateActions": [
      "Address pricing concerns with value-based messaging",
      "Develop integration capability showcase", 
      "Create competitive differentiation materials"
    ],
    "strategicPivots": [
      "Consider freemium model for price-sensitive segments",
      "Focus on Team Lead persona for initial traction",
      "Emphasize workflow improvement over cost savings"
    ]
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating market simulation:', error);
    throw new Error("Failed to generate market simulation analysis");
  }
}

export async function generateAssumptionAnalysis(intakeData: any) {
  try {
    const prompt = `
You are the LaunchClarity Analysis Engine. Analyze the business assumptions for this venture:

Assumptions to Validate: ${intakeData.assumptionsToValidate?.join(', ')}
Validation Goals: ${intakeData.primaryValidationGoals?.join(', ')}
Critical Question: ${intakeData.criticalQuestion}
Business Model: ${intakeData.businessModel}
Industry: ${intakeData.industry}
Target Customer: ${intakeData.targetCustomerDescription}

Generate a comprehensive assumption analysis with risk scores and validation approaches.

Respond with JSON in this exact format:
{
  "assumptions": [
    {
      "assumption": "Customers will pay premium pricing for our solution",
      "riskLevel": "High",
      "riskScore": 85,
      "category": "Market",
      "validationApproach": "Price sensitivity testing through surveys and landing page experiments",
      "mitigationStrategy": "Develop tiered pricing model with entry-level option"
    }
  ],
  "criticalAssumption": {
    "assumption": "Market demand exists for this solution",
    "reasoning": "Core to business viability",
    "recommendedTests": [
      "Customer discovery interviews",
      "Landing page conversion testing",
      "Competitive analysis"
    ]
  },
  "riskMatrix": {
    "technical": 25,
    "market": 70,
    "competitive": 45,
    "execution": 55,
    "financial": 60
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating assumption analysis:', error);
    throw new Error("Failed to generate assumption analysis");
  }
}

export async function generateCompetitiveIntelligence(intakeData: any) {
  try {
    const prompt = `
You are the LaunchClarity Analysis Engine. Generate competitive intelligence for this business:

Competitors: ${intakeData.competitors?.map((c: any) => `${c.name} - ${c.differentiator}`).join('; ')}
Unique Advantage: ${intakeData.uniqueAdvantage}
Business Model: ${intakeData.businessModel}
Product Type: ${intakeData.productType}
Industry: ${intakeData.industry}
Value Proposition: ${intakeData.valueProposition}

Analyze the competitive landscape and provide strategic positioning recommendations.

Respond with JSON in this exact format:
{
  "competitiveAnalysis": {
    "directCompetitors": [
      {
        "name": "Competitor A",
        "strengths": ["Market leader", "Strong brand"],
        "weaknesses": ["High pricing", "Poor UX"],
        "marketShare": "35%",
        "threatLevel": "High"
      }
    ],
    "indirectCompetitors": [
      {
        "name": "Alternative Solution B", 
        "description": "Manual processes",
        "threatLevel": "Medium"
      }
    ]
  },
  "positioningGaps": [
    {
      "gap": "Affordable enterprise solution",
      "opportunity": "Target mid-market with competitive pricing",
      "difficulty": "Medium"
    }
  ],
  "battlecards": [
    {
      "competitor": "Main Competitor",
      "ourAdvantage": "50% lower cost with same features",
      "theirWeakness": "Complex setup process",
      "winningMessage": "Get started in 5 minutes vs 5 weeks"
    }
  ],
  "strategicRecommendations": [
    "Focus on ease of implementation as key differentiator",
    "Target mid-market segment underserved by enterprise solutions",
    "Emphasize customer support quality in messaging"
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating competitive intelligence:', error);
    throw new Error("Failed to generate competitive intelligence");
  }
}

export async function generateMarketSizing(intakeData: any) {
  try {
    const prompt = `
You are the LaunchClarity Analysis Engine. Generate market sizing analysis for:

Industry: ${intakeData.industry}
Geographic Markets: ${intakeData.geographicMarkets?.join(', ')}
Business Model: ${intakeData.businessModel}
Target Customer: ${intakeData.targetCustomerDescription}
Price Point: ${intakeData.estimatedPricePoint} ${intakeData.currency}

Provide TAM/SAM/SOM analysis with growth projections.

Respond with JSON in this exact format:
{
  "marketSizing": {
    "tam": {
      "value": 50000000000,
      "description": "Total Addressable Market",
      "growthRate": 15
    },
    "sam": {
      "value": 5000000000,
      "description": "Serviceable Addressable Market", 
      "growthRate": 12
    },
    "som": {
      "value": 50000000,
      "description": "Serviceable Obtainable Market",
      "growthRate": 25
    }
  },
  "penetrationScenarios": [
    {
      "scenario": "Conservative",
      "marketShare": 0.1,
      "revenue": 5000000,
      "timeline": "3 years"
    },
    {
      "scenario": "Realistic", 
      "marketShare": 0.5,
      "revenue": 25000000,
      "timeline": "5 years"
    },
    {
      "scenario": "Optimistic",
      "marketShare": 2.0,
      "revenue": 100000000,
      "timeline": "7 years"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating market sizing:', error);
    throw new Error("Failed to generate market sizing analysis");
  }
}

export async function generateRiskAssessment(intakeData: any) {
  try {
    const prompt = `
You are the LaunchClarity Analysis Engine. Generate risk assessment for:

Business Model: ${intakeData.businessModel}
Current Stage: ${intakeData.currentStage}
Industry: ${intakeData.industry}
Sales Complexity: ${intakeData.salesComplexity}
Delivery Complexity: ${intakeData.deliveryComplexity}
Previously Tested: ${intakeData.previouslyTested}

Analyze risks across 5 dimensions with mitigation strategies.

Respond with JSON in this exact format:
{
  "riskAssessment": {
    "technical": {
      "score": 35,
      "level": "Medium",
      "factors": ["Integration complexity", "Scalability concerns"],
      "mitigation": "Phased technical development with MVP approach"
    },
    "market": {
      "score": 65,
      "level": "High", 
      "factors": ["Unproven demand", "Competitive pressure"],
      "mitigation": "Extensive customer validation before full launch"
    },
    "competitive": {
      "score": 45,
      "level": "Medium",
      "factors": ["Established players", "Low barriers to entry"],
      "mitigation": "Focus on unique value proposition and customer experience"
    },
    "execution": {
      "score": 50,
      "level": "Medium",
      "factors": ["Resource constraints", "Team experience"],
      "mitigation": "Hire experienced advisors and prioritize key hires"
    },
    "financial": {
      "score": 40,
      "level": "Medium",
      "factors": ["Funding requirements", "Revenue timeline"],
      "mitigation": "Secure 18-month runway and focus on early revenue"
    }
  },
  "overallRisk": "Medium-High",
  "keyMitigationPriorities": [
    "Validate market demand through customer interviews",
    "Secure experienced technical leadership",
    "Develop clear competitive differentiation"
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating risk assessment:', error);
    throw new Error("Failed to generate risk assessment");
  }
}

export async function generateAssumptions(intakeData: any) {
  try {
    const prompt = `
Analyze this business context and generate 10-15 critical assumptions that could make or break this venture:

Business Model: ${intakeData.businessModel}
Product Type: ${intakeData.productType}
Current Stage: ${intakeData.currentStage}
Industry: ${intakeData.industry}
Target Customer: ${intakeData.targetCustomerDescription}
Core Problem: ${intakeData.coreProblem}
Value Proposition: ${intakeData.valueProposition}
Price Point: ${intakeData.estimatedPricePoint} ${intakeData.currency}
Geographic Markets: ${intakeData.geographicMarkets}
Primary Goals: ${intakeData.primaryValidationGoals}
Pricing Model: ${intakeData.pricingModel}
Partnership Evaluation: ${intakeData.isPartnershipEvaluation ? 'Yes' : 'No'}
Previous Testing: ${intakeData.hasPreviousTesting ? 'Yes' : 'No'}
${intakeData.testingDescription ? `Testing Description: ${intakeData.testingDescription}` : ''}

Key Assumptions to Validate:
1. ${intakeData.assumption1}
2. ${intakeData.assumption2}
3. ${intakeData.assumption3}

Partnership Risks:
${intakeData.partnership_risk1 ? `1. ${intakeData.partnership_risk1}` : ''}
${intakeData.partnership_risk2 ? `2. ${intakeData.partnership_risk2}` : ''}
${intakeData.partnership_risk3 ? `3. ${intakeData.partnership_risk3}` : ''}
${intakeData.partnership_risk4 ? `4. ${intakeData.partnership_risk4}` : ''}
${intakeData.partnership_risk5 ? `5. ${intakeData.partnership_risk5}` : ''}

Competitors:
${intakeData.competitors?.map((c: any, i: number) => `${i + 1}. ${c.name}: ${c.differentiator}`).join('\n') || 'None specified'}

For each assumption, provide:
- assumption_text (specific, testable hypothesis with metrics)
- category (Market/Technical/Operational/Financial/Customer)
- risk_level (High/Medium/Low based on impact if wrong)
- confidence_level (Low/Medium/High based on current evidence)
- validation_approach_discovery (desk research method)
- validation_approach_feasibility (interview/test method)
- validation_approach_validation (full market test method)
- success_criteria (specific metric to prove/disprove)

Generate assumptions covering:
- Explicit statements (pricing, target market, value prop)
- Implicit assumptions (B2B = longer sales cycles, SaaS = monthly churn rates)
- Industry-specific risks (healthcare = HIPAA compliance, marketplace = network effects)
- Partnership-specific assumptions (integration complexity, adoption rates)
- Customer behavior assumptions
- Market dynamics assumptions
- Technical feasibility assumptions
- Financial model assumptions

Format as JSON array:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are the LaunchClarity Analysis Engine. Generate comprehensive business assumptions for validation sprints. Focus on realistic, testable hypotheses that could make or break the venture. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || '{"assumptions": []}');
  } catch (error) {
    console.error('Error generating assumptions:', error);
    throw new Error('Failed to generate assumptions');
  }
}

export async function generateGoDecision(sprintData: any, allModuleData: any) {
  try {
    const prompt = `
You are the LaunchClarity Analysis Engine. Make a Go/Defer/Kill recommendation based on all sprint data:

Sprint Tier: ${sprintData.tier}
Market Simulation Results: ${JSON.stringify(allModuleData.marketSimulation)}
Risk Assessment: ${JSON.stringify(allModuleData.riskAssessment)}
Competitive Analysis: ${JSON.stringify(allModuleData.competitiveIntel)}

Provide a comprehensive decision recommendation with rationale.

Respond with JSON in this exact format:
{
  "recommendation": "Go",
  "confidence": 75,
  "rationale": "Strong market validation with manageable risks",
  "keyFactors": [
    "68% positive market response",
    "Clear competitive advantage",
    "Manageable technical risks"
  ],
  "conditions": [
    "Secure experienced technical co-founder",
    "Validate pricing with 50+ prospects",
    "Build MVP within 6 months"
  ],
  "nextSteps": [
    "Conduct 25 customer discovery interviews",
    "Build technical prototype", 
    "Develop go-to-market strategy"
  ],
  "resourceRequirements": {
    "funding": "$500,000",
    "timeline": "6 months",
    "team": "3-4 people"
  },
  "alternativeScenarios": [
    {
      "scenario": "Pivot to B2B2C model",
      "rationale": "Reduce customer acquisition costs",
      "probability": 30
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating go decision:', error);
    throw new Error("Failed to generate go/defer/kill decision");
  }
}

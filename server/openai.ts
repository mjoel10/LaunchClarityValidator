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
    // Extract actual company and partner names from intake data
    const isPartnership = intakeData.isPartnershipEvaluation;
    const companyName = intakeData.companyName;
    const partnerName = intakeData.potentialPartnerName || intakeData.evaluatedPartner;
    const partnershipType = intakeData.partnershipType;
    const industry = intakeData.industry;
    const targetCustomer = intakeData.targetCustomer;
    
    if (!companyName || !partnerName) {
      throw new Error('Company name and partner name are required for generating assumptions');
    }
    
    const prompt = isPartnership ? `
Generate specific, testable assumptions for a partnership between ${companyName} and ${partnerName}.

PARTNERSHIP CONTEXT:
- Company: ${companyName}
- Partner: ${partnerName}  
- Partnership Type: ${partnershipType}
- Industry: ${industry}
- Target Customers: ${targetCustomer}
- Current Stage: ${intakeData.currentStage}
- Primary Goal: ${intakeData.primaryPartnershipGoal}

CRITICAL INSTRUCTIONS:
- Use ONLY the actual company name "${companyName}" and partner name "${partnerName}" throughout
- NEVER use generic terms like "the partner", "the company", or "our company"
- Generate assumptions specific to their actual business context and industry
- Base assumptions on realistic scenarios for ${companyName} + ${partnerName} partnership
- Make each assumption specific, measurable, and testable

Generate 15 assumptions organized by validation tier:

DISCOVERY ASSUMPTIONS (5-6 assumptions): Desk research validation
Focus on: ${partnerName}'s public information, API documentation, competitive landscape analysis, support forums, case studies
Example topics: ${partnerName}'s technical capabilities, existing partnerships, pricing models, developer resources

FEASIBILITY ASSUMPTIONS (4-5 assumptions): Partner and customer interviews  
Focus on: Direct conversations with ${partnerName} team, ${companyName} customer interviews, internal stakeholder alignment
Example topics: ${partnerName}'s interest level, ${companyName} customer demand, resource allocation, mutual value proposition

VALIDATION ASSUMPTIONS (4-5 assumptions): Pilot program or market test
Focus on: Beta testing, pilot customer programs, measurable success metrics, market response
Example topics: Integration success rates, customer adoption, user satisfaction, business impact metrics

FORMAT: Return assumptions as a JSON object with this structure:
{
  "discovery": [{"assumption_text": "...", "category": "...", "sprint_tier": "discovery", "risk_level": "...", "confidence_level": "...", "validation_method": "...", "validation_approach_discovery": "...", "validation_approach_feasibility": "...", "validation_approach_validation": "...", "success_criteria": "...", "timeframe": "..."}],
  "feasibility": [...],
  "validation": [...]
}
` : `
Generate business validation assumptions for ${intakeData.companyName || 'this business'}:

BUSINESS CONTEXT:
- Product: ${intakeData.productDescription || intakeData.valueProposition}
- Target Market: ${intakeData.targetCustomerDescription}
- Business Model: ${intakeData.businessModel}
- Current Stage: ${intakeData.currentStage}
- Industry: ${intakeData.industry}
- Price Point: ${intakeData.estimatedPricePoint} ${intakeData.currency}
- Primary Goals: ${intakeData.primaryValidationGoals?.join(', ')}

KEY USER ASSUMPTIONS:
1. ${intakeData.assumption1}
2. ${intakeData.assumption2}
3. ${intakeData.assumption3}

Generate assumptions organized by validation tier:

DISCOVERY ASSUMPTIONS (5-6 assumptions): Desk research in 1 week
- Competitor analysis, market research, technical feasibility assessment
- Examples: "Competitor X charges 2x our proposed price", "Target market size exceeds 100K potential customers"

FEASIBILITY ASSUMPTIONS (4-5 assumptions): Customer interviews in 2 weeks
- Customer behavior, problem validation, willingness to pay, solution fit
- Examples: "60%+ of target users spend 2+ hours daily on this problem", "Users willing to pay $50+/month for solution"

VALIDATION ASSUMPTIONS (4-5 assumptions): Market tests in 4 weeks
- Landing page tests, beta programs, conversion metrics, early satisfaction
- Examples: "Landing page converts at 5%+ signup rate", "80%+ of beta users complete onboarding"
`;

    const baseInstructions = `
For each assumption, provide:
- assumption_text: Clear, testable statement with specific metrics and actual names (no generic terms)
- category: Market, Customer, Technical, Operational, or Financial
- risk_level: High, Medium, or Low
- confidence_level: High, Medium, or Low
- sprint_tier: discovery, feasibility, or validation
- validation_method: Specific research/test method for that tier
- validation_approach_discovery: Desk research method
- validation_approach_feasibility: Interview question or survey approach
- validation_approach_validation: Market test or beta experiment
- success_criteria: Specific metrics that would validate this assumption
- timeframe: Expected time to test (1 week, 2 weeks, 4 weeks)

Return as JSON with an "assumptions" array organized by sprint tier.
`;

    const finalPrompt = prompt + baseInstructions;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are the LaunchClarity Analysis Engine. Generate comprehensive business assumptions for validation sprints. Focus on realistic, testable hypotheses that could make or break the venture. For partnerships, use specific company/partner names throughout. Respond only with valid JSON."
        },
        {
          role: "user",
          content: finalPrompt
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

export async function generateAssumptionReport(intakeData: any) {
  try {
    const companyName = intakeData.companyName;
    const partnerName = intakeData.potentialPartnerName || intakeData.evaluatedPartner;
    const partnershipType = intakeData.partnershipType || 'Strategic Partnership';
    const industry = intakeData.industry || 'Technology';
    const targetCustomer = intakeData.targetCustomer || intakeData.targetCustomerDescription || 'target customers';
    const pricePoint = intakeData.estimatedPricePoint || 'competitive pricing';
    const pricingModel = intakeData.pricingModel || 'monthly subscription';
    const userBase = intakeData.userBase || intakeData.currentUsers || '50K+';
    const currentStage = intakeData.currentStage || 'Growth';
    const primaryGoal = intakeData.primaryPartnershipGoal || intakeData.primaryValidationGoals?.[0] || 'market expansion';
    
    if (!companyName || !partnerName) {
      throw new Error('Company name and partner name are required for generating report');
    }

    const prompt = `
Generate a comprehensive assumption validation report of approximately 1,500-2,000 words for a $5,000+ consulting sprint analyzing ${companyName}'s ${partnershipType} partnership with ${partnerName}.

PARTNERSHIP CONTEXT:
- Company: ${companyName} (${userBase} users, ${currentStage} stage)
- Partner: ${partnerName}
- Partnership Type: ${partnershipType}
- Industry: ${industry}
- Target Market: ${targetCustomer}
- Pricing: ${pricePoint} per ${pricingModel}
- Primary Goal: ${primaryGoal}

CRITICAL REQUIREMENTS:
- Generate 12-15 detailed assumptions (4-5 per sprint tier)
- Each assumption must be a full paragraph with rich context
- Use specific company/partner names throughout - NO generic terms
- Provide McKinsey-level strategic thinking, not generic ChatGPT output
- Make it feel like custom strategic analysis worth $5,000+

For each assumption include:
- Specific, testable hypothesis using actual company/partner names
- Risk level and detailed rationale (2-3 sentences explaining why this matters)
- Validation method with concrete steps the consultant can execute
- Success criteria with measurable thresholds
- Business impact explanation (why this assumption is critical)

FORMAT WITH PROPER HTML FOR GOOGLE DOCS TRANSFER:

<h1>Assumption Validation Report</h1>
<h2>${companyName} + ${partnerName} ${partnershipType} Partnership Analysis</h2>

<h2>Executive Summary</h2>
<p>This comprehensive analysis identifies 15 critical assumptions across three validation tiers for ${companyName}'s proposed ${partnershipType} partnership with ${partnerName}. The partnership represents a strategic opportunity to [specific value proposition based on context]. This report outlines testable hypotheses that will determine partnership viability, resource allocation requirements, and go-to-market strategy for the ${industry} sector.</p>

<p>Key findings indicate [3-4 specific strategic insights]. The analysis prioritizes assumptions with highest business impact and validates them through a structured 8-week sprint methodology. Success depends on validating 80% of high-risk assumptions and achieving [specific metrics] in pilot testing.</p>

<h2>Strategic Partnership Overview</h2>
<h3>Partnership Context & Objectives</h3>
<p>Provide 2-3 paragraphs of strategic context explaining why this partnership matters, the market opportunity, competitive landscape, and how it fits ${companyName}'s broader strategy.</p>

<h3>Critical Success Factors</h3>
<ul>
<li>Technical integration capabilities between ${companyName} and ${partnerName}</li>
<li>Market demand validation for integrated solution</li>
<li>Resource allocation and partnership commitment levels</li>
<li>Go-to-market strategy and customer adoption metrics</li>
</ul>

<h2>Discovery Sprint Assumptions (Weeks 1-2)</h2>
<p>Validate through desk research, competitive analysis, and public information gathering.</p>

Generate 4-5 detailed assumptions, each as a full paragraph. Examples of specific hypotheses:
"${partnerName}'s API infrastructure can handle ${companyName}'s current ${userBase} user base with sub-200ms response times..."
"${targetCustomer} are willing to pay ${pricePoint} for an integrated ${companyName}+${partnerName} solution..."
"${partnerName}'s customer success team has capacity to support ${companyName}'s ${pricingModel} onboarding process..."

Each assumption must include:
- Specific hypothesis using actual company names and metrics
- Why this assumption is critical to partnership success  
- Detailed validation approach with concrete research methods
- Success criteria with measurable thresholds
- Risk assessment and business impact

<h2>Feasibility Sprint Assumptions (Weeks 3-4)</h2>
<p>Validate through direct partner engagement and customer discovery interviews.</p>

Generate 4-5 detailed assumptions with specific examples:
"${partnerName}'s executive team will commit 2-3 FTE developers for ${companyName} integration within Q2..."
"${companyName}'s ${targetCustomer} show 40%+ interest in integrated solution during customer interviews..."
"${partnerName}'s webhook architecture supports real-time data sync for ${companyName}'s ${pricingModel} billing..."
"Joint ${companyName}+${partnerName} solution generates 25%+ revenue uplift vs standalone products..."

Focus on:
- Partnership interest and resource commitment specifics
- Customer demand validation with measurable thresholds
- Technical feasibility with concrete integration requirements
- Business model alignment and revenue projections

<h2>Validation Sprint Assumptions (Weeks 5-8)</h2>
<p>Validate through pilot programs, beta testing, and market experiments.</p>

Generate 4-5 detailed assumptions with specific examples:
"Beta pilot with 100 ${targetCustomer} achieves 60%+ weekly active usage of ${companyName}+${partnerName} integration..."
"${partnerName}'s infrastructure maintains 99.9% uptime during ${companyName}'s peak ${userBase} concurrent user load..."
"Integrated solution drives 15%+ customer lifetime value increase vs ${companyName} standalone pricing..."
"Partnership model scales to support 10x current ${companyName} user growth within 12 months..."

Focus on:
- Customer adoption metrics with specific usage thresholds
- Technical performance benchmarks under real load
- Quantified business impact and ROI calculations
- Scalability validation for future growth projections

<h2>Risk Assessment & Mitigation</h2>
Provide detailed analysis of highest-risk assumptions and mitigation strategies.

<h2>Recommended Validation Sequence</h2>
Provide week-by-week execution plan with specific deliverables and decision points.

TONE: Professional consulting language. Strategic depth. Custom analysis, not templates.
TARGET: 1,500-2,000 words total. Each assumption should be substantial, not bullet points.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: "You are a McKinsey-level senior strategy consultant generating premium assumption validation reports for $5,000+ engagements. Your analysis must demonstrate deep strategic thinking, industry expertise, and custom insights that justify high-value consulting fees. Each assumption should be a substantial paragraph with rich context, not bullet points. Use specific company names throughout and provide actionable validation methods with measurable success criteria. Generate 1,500-2,000 words of professional consulting content that reads like bespoke strategic analysis, not generic templates."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000
    });

    const reportContent = response.choices[0].message.content;
    
    return {
      report: reportContent,
      companyName,
      partnerName,
      partnershipType
    };

  } catch (error) {
    console.error('Error generating assumption report:', error);
    throw new Error("Failed to generate assumption report");
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

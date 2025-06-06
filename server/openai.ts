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
    
    // Get client's specific assumptions from intake
    const clientAssumptions = intakeData.topAssumptions || [];
    const keyRisks = intakeData.keyRisks || intakeData.uncertainties || [];
    const criticalQuestion = intakeData.criticalQuestion || intakeData.primaryValidationGoals?.[0];
    
    if (!companyName) {
      throw new Error('Company name is required for generating assumption validation plan');
    }

    if (!clientAssumptions || clientAssumptions.length === 0) {
      throw new Error('Client assumptions are required. Please complete the intake form with your top 3 assumptions to validate.');
    }

    const prompt = `
Generate a comprehensive assumption validation plan of approximately 1,500-2,000 words for a $5,000+ consulting sprint. The client has identified these specific assumptions that need validation:

CLIENT'S ASSUMPTIONS TO VALIDATE:
${clientAssumptions.map((assumption, index) => `${index + 1}. "${assumption}"`).join('\n')}

${keyRisks.length > 0 ? `KEY RISKS/UNCERTAINTIES: ${keyRisks.join(', ')}` : ''}
${criticalQuestion ? `CRITICAL QUESTION: "${criticalQuestion}"` : ''}

BUSINESS CONTEXT:
- Company: ${companyName} (${userBase} users, ${currentStage} stage)
${partnerName ? `- Partner: ${partnerName}` : ''}
${partnerName ? `- Partnership Type: ${partnershipType}` : ''}
- Industry: ${industry}
- Target Market: ${targetCustomer}
- Pricing: ${pricePoint} per ${pricingModel}
- Primary Goal: ${primaryGoal}

CRITICAL REQUIREMENTS:
- DO NOT generate new assumptions - work with the client's exact assumptions listed above
- For EACH client assumption, create a detailed validation plan
- Break each assumption into 2-3 testable sub-hypotheses
- Provide specific validation methods by sprint tier (Discovery/Feasibility/Validation)
- Use actual company names throughout - NO generic terms
- Make it actionable and specific to their business context

FORMAT WITH PROPER HTML FOR GOOGLE DOCS TRANSFER:

<h1>Assumption Validation Plan</h1>
<h2>${companyName} - Detailed Validation Roadmap</h2>

<h2>Executive Summary</h2>
<p>This comprehensive validation plan addresses the specific assumptions identified by ${companyName} for their ${industry} initiative. The client has prioritized ${clientAssumptions.length} core assumptions that require systematic validation across our three-tier sprint methodology. This plan transforms high-level concerns into actionable testing protocols with clear success criteria and go/no-go decision points.</p>

<p>The validation approach spans 8 weeks across Discovery, Feasibility, and Validation sprints, with each assumption broken into testable sub-hypotheses. Success depends on achieving validation thresholds for ${Math.ceil(clientAssumptions.length * 0.8)} of the ${clientAssumptions.length} assumptions, with early indicators available within 2-3 weeks.</p>

<h3>Client's Core Assumptions</h3>
<ul>
${clientAssumptions.map(assumption => `<li><strong>"${assumption}"</strong></li>`).join('\n')}
</ul>

<h2>Detailed Validation Plans</h2>

For EACH assumption listed above, provide a comprehensive validation plan (1+ page each):

<h3>Assumption 1: "[Restate first assumption exactly]"</h3>
<h4>Testable Sub-Hypotheses</h4>
<p>Break this assumption into 2-3 specific, measurable sub-hypotheses that can be tested independently.</p>

<h4>Discovery Sprint Validation (Weeks 1-2)</h4>
<p>Desk research and public information analysis:</p>
<ul>
<li>Specific research methods and data sources</li>
<li>Competitive analysis approaches</li>
<li>Industry benchmark gathering</li>
<li>Success criteria with measurable thresholds</li>
</ul>

<h4>Feasibility Sprint Validation (Weeks 3-4)</h4>
<p>Direct stakeholder engagement and customer discovery:</p>
<ul>
<li>Interview protocols and target respondents</li>
<li>Partner engagement strategies</li>
<li>Customer survey design and distribution</li>
<li>Technical feasibility assessments</li>
</ul>

<h4>Validation Sprint Testing (Weeks 5-8)</h4>
<p>Market experiments and pilot programs:</p>
<ul>
<li>Specific test designs and methodologies</li>
<li>Pilot program structure and metrics</li>
<li>A/B testing protocols</li>
<li>Performance benchmarks and success criteria</li>
</ul>

<h4>Risk Assessment & Mitigation</h4>
<p>What happens if this assumption proves false and how to mitigate that risk.</p>

[Repeat this structure for each client assumption]

<h2>Integrated Validation Roadmap</h2>
<h3>Week-by-Week Execution Plan</h3>
<p>Provide detailed weekly schedule showing:</p>
<ul>
<li>Which assumptions are being tested when</li>
<li>Dependencies between different validation activities</li>
<li>Resource requirements and team responsibilities</li>
<li>Decision points and go/no-go criteria</li>
</ul>

<h3>Success Metrics & Decision Framework</h3>
<p>Define clear criteria for determining assumption validation success and overall project viability.</p>

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

export async function generateMarketSizingReport(intakeData: any) {
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
    
    if (!companyName) {
      throw new Error('Company name is required for generating market sizing report');
    }

    const prompt = `
Generate a comprehensive market sizing analysis report of approximately 2,000-2,500 words for a $5,000+ consulting engagement analyzing ${companyName}'s market opportunity in the ${industry} sector.

COMPANY CONTEXT:
- Company: ${companyName} (${userBase} users, ${currentStage} stage)
- Target Market: ${targetCustomer}
- Pricing: ${pricePoint} per ${pricingModel}
- Industry: ${industry}
- Primary Goal: ${primaryGoal}
${partnerName ? `- Partnership Context: ${partnershipType} with ${partnerName}` : ''}

CRITICAL REQUIREMENTS:
- Generate 2,000-2,500 words with specific numbers and calculations
- Provide McKinsey-level depth with actual market data and reasoning
- Include detailed TAM/SAM/SOM analysis with specific dollar amounts
- Use realistic market sizing methodologies and cite reasoning
- Make it feel custom to ${companyName} in ${industry}, not generic templates

FORMAT WITH PROPER HTML FOR GOOGLE DOCS TRANSFER:

<h1>Market Sizing Analysis</h1>
<h2>${companyName} Market Opportunity Assessment</h2>

<h2>Executive Summary</h2>
<p>This comprehensive market sizing analysis evaluates the addressable market opportunity for ${companyName} in the ${industry} sector, targeting ${targetCustomer} with ${pricingModel} pricing. The analysis reveals a Total Addressable Market (TAM) of [specific $X billion], a Serviceable Addressable Market (SAM) of [specific $X million], and a realistic Serviceable Obtainable Market (SOM) of [specific $X million] over the next 5 years.</p>

<p>Key findings indicate [3-4 specific market insights with numbers]. ${companyName}'s current position with ${userBase} users represents [X%] market penetration in their primary segment. The analysis identifies [specific growth opportunities] that could drive [X%] annual growth through [specific strategies].</p>

<h3>Market Opportunity Headlines</h3>
<ul>
<li><strong>TAM:</strong> $[X] billion total market for ${industry} solutions</li>
<li><strong>SAM:</strong> $[X] million serviceable market for ${targetCustomer}</li>
<li><strong>SOM:</strong> $[X] million obtainable market (Year 1-5 projections)</li>
<li><strong>Growth Rate:</strong> [X]% CAGR over next 5 years</li>
<li><strong>Target Penetration:</strong> [X]% market share achievable</li>
</ul>

<h2>Total Addressable Market (TAM) Analysis</h2>
<h3>Market Definition & Boundaries</h3>
<p>Provide 2-3 paragraphs defining the total market for ${industry} solutions, including geographic scope, customer segments, and use cases. Explain methodology for TAM calculation.</p>

<h3>TAM Sizing by Geography</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
<tr><th>Region</th><th>Market Size</th><th>Growth Rate</th><th>Key Drivers</th></tr>
<tr><td>North America</td><td>$[X] billion</td><td>[X]% CAGR</td><td>[Specific drivers]</td></tr>
<tr><td>Europe</td><td>$[X] billion</td><td>[X]% CAGR</td><td>[Specific drivers]</td></tr>
<tr><td>Asia-Pacific</td><td>$[X] billion</td><td>[X]% CAGR</td><td>[Specific drivers]</td></tr>
<tr><td><strong>Global Total</strong></td><td><strong>$[X] billion</strong></td><td><strong>[X]% CAGR</strong></td><td>Digital transformation</td></tr>
</table>

<h3>Customer Segment Breakdown</h3>
<p>Analyze market size by customer segment relevant to ${companyName}'s target of ${targetCustomer}. Include segment definitions, sizing methodology, and growth projections.</p>

<h3>5-Year Growth Projections</h3>
<p>Detail market growth drivers, technology trends, and regulatory factors influencing ${industry} market expansion. Provide year-over-year projections with supporting rationale.</p>

<h2>Serviceable Addressable Market (SAM)</h2>
<h3>TAM to SAM Filtering Criteria</h3>
<p>Explain how the total market filters to serviceable market based on:</p>
<ul>
<li><strong>Target Customer Criteria:</strong> ${targetCustomer} segment represents [X]% of total market</li>
<li><strong>Geographic Focus:</strong> ${companyName}'s current/planned geographic reach</li>
<li><strong>Price Point Accessibility:</strong> Customers willing/able to pay ${pricePoint}</li>
<li><strong>Technology Fit:</strong> Customers needing ${companyName}'s specific solution type</li>
</ul>

<h3>SAM Calculation & Rationale</h3>
<p>Provide detailed SAM calculation: [Total market] × [Geographic filter %] × [Customer segment %] × [Price accessibility %] = $[X] million SAM. Explain each filter percentage with supporting data and reasoning.</p>

<h2>Serviceable Obtainable Market (SOM)</h2>
<h3>Realistic Capture Rate Analysis</h3>
<p>Analyze ${companyName}'s realistic market capture potential based on competitive positioning, go-to-market capabilities, and resource constraints. Consider current ${userBase} user base as baseline.</p>

<h3>SOM Projections</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
<tr><th>Scenario</th><th>Year 1</th><th>Year 3</th><th>Year 5</th><th>Market Share</th></tr>
<tr><td>Conservative</td><td>$[X]M</td><td>$[X]M</td><td>$[X]M</td><td>[X]%</td></tr>
<tr><td>Moderate</td><td>$[X]M</td><td>$[X]M</td><td>$[X]M</td><td>[X]%</td></tr>
<tr><td>Aggressive</td><td>$[X]M</td><td>$[X]M</td><td>$[X]M</td><td>[X]%</td></tr>
</table>

<h2>Market Dynamics & Competition</h2>
<h3>Market Segmentation Analysis</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
<tr><th>Segment</th><th>Size ($M)</th><th>Growth Rate</th><th>Competitive Density</th><th>Fit Score</th></tr>
<tr><td>[Segment 1]</td><td>$[X]M</td><td>[X]%</td><td>High/Medium/Low</td><td>[1-10]</td></tr>
<tr><td>[Segment 2]</td><td>$[X]M</td><td>[X]%</td><td>High/Medium/Low</td><td>[1-10]</td></tr>
<tr><td>[Segment 3]</td><td>$[X]M</td><td>[X]%</td><td>High/Medium/Low</td><td>[1-10]</td></tr>
</table>

<h3>Competitive Density & Market Share</h3>
<p>Analyze competitive landscape in ${industry} sector, identifying market leaders, their share percentages, and whitespace opportunities for ${companyName}. Include specific competitor names and positioning.</p>

<h3>Highest Opportunity Segments</h3>
<p>Identify the 2-3 customer segments with highest potential for ${companyName} based on size, growth, competitive density, and strategic fit. Explain prioritization rationale.</p>

${partnerName ? `
<h2>Partnership Market Opportunity</h2>
<h3>${partnerName} Customer Base Analysis</h3>
<p>Analyze ${partnerName}'s customer base overlap with ${companyName}'s target market. Estimate addressable customers within ${partnerName}'s ecosystem.</p>

<h3>Incremental Market Opportunity</h3>
<p>Calculate incremental market opportunity through ${partnershipType} with ${partnerName}. Example: "Of ${partnerName}'s [X] customers, approximately [X]% ([X] customers) need ${companyName}'s ${industry} solution, representing $[X]M incremental market opportunity."</p>

<h3>Joint Market Capture Potential</h3>
<p>Assess combined go-to-market potential, cross-selling opportunities, and accelerated market penetration through partnership channels.</p>
` : ''}

<h2>Strategic Recommendations</h2>
<h3>Market Entry Strategy</h3>
<p>Recommend optimal market entry approach based on market sizing analysis, including segment prioritization, geographic expansion, and resource allocation.</p>

<h3>Growth Acceleration Opportunities</h3>
<p>Identify specific tactics to accelerate market capture, including product development, pricing optimization, and partnership strategies.</p>

TONE: Professional consulting language with specific numbers and calculations throughout.
TARGET: 2,000-2,500 words with dense insights and data points.
METHODOLOGY: Use realistic market sizing approaches and cite reasoning for all calculations.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: "You are a McKinsey-level senior strategy consultant generating premium market sizing reports for $5,000+ engagements. Your analysis must demonstrate deep market research expertise, specific calculations, and custom insights that justify high-value consulting fees. Provide comprehensive TAM/SAM/SOM analysis with realistic numbers, detailed methodology, and actionable insights. Generate 2,000-2,500 words of professional consulting content with specific data points throughout, not generic market commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 7000
    });

    const reportContent = response.choices[0].message.content;
    
    return {
      report: reportContent
    };
  } catch (error) {
    console.error('Error generating market sizing report:', error);
    throw new Error('Failed to generate market sizing report');
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

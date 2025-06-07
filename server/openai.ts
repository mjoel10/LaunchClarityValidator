import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
  timeout: 90000 // 90 seconds timeout for comprehensive reports
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
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const isPartnership = intakeData.isPartnershipEvaluation;
  const companyName = intakeData.companyName || 'your company';
  const partnerName = intakeData.potentialPartnerName || intakeData.evaluatedPartner;
  const partnershipType = intakeData.partnershipType || 'Strategic Partnership';
  const industry = intakeData.industry || 'technology';
  const targetCustomer = intakeData.targetCustomerDescription || 'small businesses';
  const businessModel = intakeData.businessModel || 'subscription';
  const pricePoint = intakeData.estimatedPricePoint || '$100';
  const currentStage = intakeData.currentStage || 'Growth';
  
  if (!companyName) {
    throw new Error('Company name is required for generating competitive intelligence');
  }

  const prompt = isPartnership ? `
Generate a comprehensive competitive intelligence analysis report of 2,000-2,500 words for the PARTNERSHIP between ${companyName} and ${partnerName}.

PARTNERSHIP CONTEXT:
- Company: ${companyName} (${currentStage} stage)
- Partner: ${partnerName}
- Partnership Type: ${partnershipType}
- Target Market: ${targetCustomer}
- Industry: ${industry}
- Business Model: ${businessModel}
- Price Point: ${pricePoint}

Focus on:
- How the partnership changes competitive dynamics
- Competitors who might also pursue ${partnerName} partnerships
- Integration/partnership competitive landscape
- New competitive advantages from the partnership
- Potential competitive responses

Use the actual company names "${companyName}" and "${partnerName}" throughout your analysis.` : `
Generate a comprehensive competitive intelligence analysis report of 2,000-2,500 words analyzing ${companyName}'s competitive position in the ${industry} sector.

COMPANY CONTEXT:
- Company: ${companyName} (${currentStage} stage)
- Target Market: ${targetCustomer}
- Industry: ${industry}
- Business Model: ${businessModel}
- Price Point: ${pricePoint}

Focus on the general competitive landscape for ${companyName}.`;

  const fullPrompt = `${prompt}

CRITICAL REQUIREMENTS:
- Generate 2,000-2,500 words with McKinsey-level depth and specific market intelligence
- Analyze 5-7 direct competitors with detailed profiles (200-300 words each)
- Include specific pricing data, market share percentages, and funding information
- Make it feel custom to ${companyName} in ${industry}, not generic templates

FORMAT WITH EXACT PROFESSIONAL CONSULTING STANDARD:

COMPETITIVE INTELLIGENCE ANALYSIS
${companyName}${partnerName ? ` - ${partnerName} Partnership` : ''} Market Position Assessment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

The competitive landscape for ${companyName} in the ${industry} sector reveals a dynamic market with both established incumbents and emerging disruptors. This comprehensive analysis evaluates 5-7 key competitors across market positioning, pricing strategies, and competitive advantages to identify ${companyName}'s optimal positioning strategy.

${isPartnership ? `The proposed partnership between ${companyName} and ${partnerName} represents a strategic opportunity to strengthen competitive positioning through [specific advantages]. Key competitive dynamics include [specific insights about partnership impact on competition].` : `${companyName}'s position in the ${targetCustomer} segment shows [specific competitive assessment]. Market dynamics favor companies that [specific strategic insight].`}

KEY FINDINGS:
• Primary Competitors: [List top 3 with specific percentages]
• Market Leader: [Company] with XX% market share in ${targetCustomer} segment
• Key Differentiator: [Specific advantage for ${companyName}]
• Biggest Threat: [Main competitive risk with specific reasoning]
• Market Opportunity: $XXM in [specific unaddressed segment]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. COMPETITIVE LANDSCAPE OVERVIEW

Market Structure: The ${industry} market serving ${targetCustomer} is characterized by [specific market structure analysis with actual market dynamics]. Market concentration shows [specific concentration metrics] with the top 3 players controlling approximately [percentage]% of market share.

Key Player Categories:
• Enterprise Solutions: [List 2-3 specific companies with brief descriptions]
• Mid-Market Focus: [List 2-3 specific companies with positioning]
• SMB/Startup Tools: [List 2-3 specific companies with target segments]
• Emerging Disruptors: [List 1-2 companies with disruptive approaches]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. DIRECT COMPETITOR PROFILES

Competitor 1: [Company Name]
─────────────────────────────────────────

Overview: [Comprehensive 200-300 word analysis including:
- Founded year, headquarters, employee count, funding status
- Core value proposition and target customers
- Key features and capabilities
- Recent developments and market momentum
- Why they win/lose deals
- Specific vulnerabilities to exploit]

Pricing Strategy: [Detailed pricing analysis with specific tiers and price points]

Market Position: [Specific market share percentage and growth metrics]

Competitive Threat Level: [High/Medium/Low with specific reasoning]

[Repeat detailed profile structure for 5-7 total competitors]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. COMPETITIVE POSITIONING MATRIX

Feature Comparison Analysis:
[Create detailed feature comparison showing where ${companyName} leads/lags]

Market Position Mapping:
[2x2 matrix analysis (e.g., Price vs. Features) with specific positioning]

Differentiation Opportunities:
[Specific areas where ${companyName} can differentiate from competitors]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. MARKET GAPS & OPPORTUNITIES

Unserved Customer Needs:
[Specific customer needs not addressed by current competitors]

Feature Gaps in Current Solutions:
[Specific functionality gaps that ${companyName} could address]

Emerging Market Trends:
[Specific trends that create new competitive opportunities]

${isPartnership ? `

5. PARTNERSHIP COMPETITIVE IMPACT

How Partnership Changes Competitive Dynamics:
[Specific analysis of how ${companyName}-${partnerName} partnership alters competition]

New Competitive Advantages:
[Specific advantages gained through the partnership]

Potential Competitive Responses:
[Likely competitor reactions and counter-strategies]` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isPartnership ? '6' : '5'}. STRATEGIC RECOMMENDATIONS

Positioning Strategy:
[Specific recommendations for how ${companyName} should position against competitors]

Differentiation Tactics:
[Concrete tactics to differentiate from key competitors]

Competitive Response Playbook:
[Specific strategies for responding to competitive threats]

Implementation Priorities:
[Prioritized list of immediate competitive actions]

This analysis provides ${companyName} with actionable intelligence to strengthen competitive positioning and capitalize on market opportunities in the ${industry} sector.`;

  try {
    console.log('About to call OpenAI API...');
    console.log('Company name:', companyName);
    console.log('Industry:', industry);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a McKinsey-level senior strategy consultant generating premium competitive intelligence reports for $5,000+ engagements. Your analysis must demonstrate deep strategic thinking, market expertise, and custom insights that justify high-value consulting fees. Each competitor profile should be substantial with rich context, not bullet points. Use specific company names, actual pricing data, and real market intelligence. Generate 2,000-2,500 words of professional consulting content that reads like bespoke strategic analysis, not generic templates."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000
    });

    console.log('OpenAI API call completed successfully');
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return {
      report: content,
      companyName,
      partnerName,
      partnershipType
    };

  } catch (error) {
    console.error('Error generating competitive intelligence:', error);
    console.error('Error details:', error.message);
    throw new Error("Failed to generate competitive intelligence: " + error.message);
  }
}

export async function generateMarketSizing(intakeData: any) {
  try {
    const isPartnership = intakeData.isPartnershipEvaluation;
    const companyName = intakeData.companyName;
    const partnerName = intakeData.potentialPartnerName || intakeData.evaluatedPartner;
    const pricePoint = intakeData.estimatedPricePoint;
    const pricingModel = intakeData.pricingModel;
    const currency = intakeData.currency;

    const prompt = isPartnership ? `
You are the LaunchClarity Analysis Engine. Generate market sizing analysis for the PARTNERSHIP between ${companyName} and ${partnerName}.

PARTNERSHIP CONTEXT:
Company: ${companyName}
Partner: ${partnerName}
Partnership Type: ${intakeData.partnershipType}
Industry: ${intakeData.industry}
Geographic Markets: ${intakeData.geographicMarkets?.join(', ')}
Target Customer: ${intakeData.targetCustomerDescription}
Pricing Model: ${pricePoint} per ${pricingModel}

Focus on:
- The addressable market for the integration/partnership
- Revenue opportunity from the partnership specifically
- Customer overlap between ${companyName} and ${partnerName}
- Integration adoption rates
- Partnership-specific market dynamics

Use the actual company names "${companyName}" and "${partnerName}" throughout your analysis.` : `
You are the LaunchClarity Analysis Engine. Generate market sizing analysis for:

Company: ${companyName}
Industry: ${intakeData.industry}
Geographic Markets: ${intakeData.geographicMarkets?.join(', ')}
Business Model: ${intakeData.businessModel}
Target Customer: ${intakeData.targetCustomerDescription}
Price Point: ${pricePoint} ${currency}

Focus on the general business opportunity for ${companyName}.`;

    const fullPrompt = `${prompt}

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
      messages: [{ role: "user", content: fullPrompt }],
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
    const isPartnership = intakeData.isPartnershipEvaluation;
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

    const prompt = isPartnership ? `
Generate a comprehensive market sizing analysis report of approximately 2,000-2,500 words for the PARTNERSHIP between ${companyName} and ${partnerName}.

PARTNERSHIP CONTEXT:
- Company: ${companyName} (${userBase} users, ${currentStage} stage)
- Partner: ${partnerName}
- Partnership Type: ${partnershipType}
- Target Market: ${targetCustomer}
- Pricing Model: ${pricePoint} per ${pricingModel}
- Industry: ${industry}
- Primary Goal: ${primaryGoal}

Focus on:
- The addressable market for the integration/partnership
- Revenue opportunity from the partnership specifically
- Customer overlap between ${companyName} and ${partnerName}
- Integration adoption rates
- Partnership-specific market dynamics

Use the actual company names "${companyName}" and "${partnerName}" throughout your analysis.` : `
Generate a comprehensive market sizing analysis report of approximately 2,000-2,500 words analyzing ${companyName}'s market opportunity in the ${industry} sector.

COMPANY CONTEXT:
- Company: ${companyName} (${userBase} users, ${currentStage} stage)
- Target Market: ${targetCustomer}
- Pricing: ${pricePoint} per ${pricingModel}
- Industry: ${industry}
- Primary Goal: ${primaryGoal}

Focus on the general business opportunity for ${companyName}.`;

    const fullPrompt = `${prompt}

CRITICAL REQUIREMENTS:
- Generate 2,000-2,500 words with specific numbers and calculations
- Provide McKinsey-level depth with actual market data and reasoning
- Include detailed TAM/SAM/SOM analysis with specific dollar amounts
- Use realistic market sizing methodologies and cite reasoning
- Make it feel custom to ${companyName} in ${industry}, not generic templates

FORMAT WITH EXACT PROFESSIONAL CONSULTING STANDARD:

MARKET SIZING ANALYSIS
${companyName}${partnerName ? ` - ${partnerName} Partnership` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

This comprehensive market sizing analysis evaluates the addressable market opportunity for ${companyName} in the ${industry} sector, targeting ${targetCustomer} with ${pricingModel} pricing. The analysis reveals a Total Addressable Market (TAM) of $[X,XXX,XXX], a Serviceable Available Market (SAM) of $[XXX,XXX], and a realistic Serviceable Obtainable Market (SOM) of $[XXX,XXX] over the next 5 years.

Key findings indicate [3-4 specific market insights with numbers]. ${companyName}'s current position with ${userBase} users represents [XX]% market penetration in their primary segment. The analysis identifies [specific growth opportunities] that could drive [XX]% annual growth through [specific strategies].

KEY FINDINGS:

• Total Addressable Market (TAM): $[X,XXX,XXX]
• Serviceable Available Market (SAM): $[XXX,XXX]  
• Serviceable Obtainable Market (SOM): $[XXX,XXX]
• Year 1 Projected Adoption Rate: [XX]%
• Year 1 Projected Revenue: $[XXX,XXX]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL ADDRESSABLE MARKET (TAM)

The Total Addressable Market represents the complete revenue opportunity available for ${industry} solutions targeting ${targetCustomer}. This analysis uses both top-down and bottom-up methodologies to establish a realistic TAM calculation.

Market Characteristics:

• User Base: [XXX,XXX] total potential users
• Revenue Stage: $[XXX]M - $[X,XXX]M annual revenue range
• Key Segments: [List 3-4 primary market segments]
• Current Pain Points: [List specific challenges driving demand]

TAM Calculation:
─────────────────
TAM = Total Potential Users × Monthly Price × 12 months
TAM = [XXX,XXX] × $[XXX] × 12
TAM = $[XXX,XXX,XXX]

Geographic Market Breakdown:

• North America: $[XXX,XXX,XXX] ([XX]% of total TAM)
• Europe: $[XXX,XXX,XXX] ([XX]% of total TAM)
• Asia-Pacific: $[XXX,XXX,XXX] ([XX]% of total TAM)
• Other Regions: $[XXX,XXX,XXX] ([XX]% of total TAM)

Market Growth Drivers:

• Digital transformation initiatives driving [XX]% annual growth
• Regulatory requirements creating mandatory adoption
• Cost savings of $[XXX,XXX] per organization annually
• Technology advances reducing implementation barriers by [XX]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVICEABLE AVAILABLE MARKET (SAM)

The Serviceable Available Market represents the portion of the TAM that ${companyName} can realistically address based on geographic reach, target customer profile, and solution capabilities.

Target User Identification:

• Primary Target: ${targetCustomer} with [specific characteristics]
• Geographic Scope: [Primary markets where ${companyName} operates]
• Company Size Range: [XXX] to [X,XXX] employees
• Technology Readiness: Organizations with [specific technology requirements]
• Budget Capacity: Annual ${industry} budget of $[XXX,XXX] or more

SAM Filtering Criteria:

• Target Customer Fit: [XX]% of total market matches ${companyName}'s ideal customer profile
• Geographic Accessibility: [XX]% of market within serviceable regions
• Price Point Viability: [XX]% of prospects can afford ${pricePoint} ${pricingModel}
• Solution Compatibility: [XX]% require ${companyName}'s specific capabilities

SAM Calculation:
─────────────────
SAM = TAM × Target Filter × Geographic Filter × Price Filter
SAM = $[XXX,XXX,XXX] × [XX]% × [XX]% × [XX]%
SAM = $[XXX,XXX,XXX]

Market Segmentation Within SAM:

• Segment 1: [Segment Name] - $[XXX,XXX] ([XX]% of SAM)
• Segment 2: [Segment Name] - $[XXX,XXX] ([XX]% of SAM)  
• Segment 3: [Segment Name] - $[XXX,XXX] ([XX]% of SAM)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVICEABLE OBTAINABLE MARKET (SOM)

The Serviceable Obtainable Market represents the realistic portion of SAM that ${companyName} can capture based on competitive positioning, go-to-market capabilities, and resource constraints.

Realistic Adoption Rate Analysis:

Current market position analysis shows ${companyName} with ${userBase} users representing [XX]% penetration in their primary segment. Based on competitive benchmarking and go-to-market capabilities, realistic capture rates are:

• Year 1 Adoption Rate: [XX]% of SAM
• Year 3 Adoption Rate: [XX]% of SAM  
• Year 5 Adoption Rate: [XX]% of SAM

Market Capture Factors:

• Competitive Advantage: [Specific differentiators vs. key competitors]
• Go-to-Market Strength: [Distribution channels and sales capabilities]
• Resource Constraints: [Team size, funding, implementation timeline]
• Market Timing: [Market readiness and competitive landscape timing]

SOM Calculation:
─────────────────
SOM = SAM × Realistic Adoption Rate
SOM = $[XXX,XXX,XXX] × [XX]%
SOM = $[XXX,XXX,XXX]

Multi-Year Revenue Projections:

• Year 1: $[XXX,XXX] ([XXX] customers at $[XXX] ${pricingModel})
• Year 2: $[XXX,XXX] ([XXX] customers at $[XXX] ${pricingModel})
• Year 3: $[XXX,XXX] ([X,XXX] customers at $[XXX] ${pricingModel})
• Year 4: $[XXX,XXX] ([X,XXX] customers at $[XXX] ${pricingModel})  
• Year 5: $[X,XXX,XXX] ([X,XXX] customers at $[XXX] ${pricingModel})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPETITIVE LANDSCAPE AND MARKET DYNAMICS

The ${industry} market demonstrates significant opportunity for ${companyName} based on competitive positioning analysis and market segment evaluation.

Market Segmentation Analysis:

• Segment 1: [Primary Segment] - $[XXX,XXX] market size, [XX]% growth rate
• Segment 2: [Secondary Segment] - $[XXX,XXX] market size, [XX]% growth rate
• Segment 3: [Tertiary Segment] - $[XXX,XXX] market size, [XX]% growth rate

Competitive Positioning:

• Market Leader: [Company Name] - [XX]% market share, $[XXX,XXX,XXX] revenue
• Key Challenger: [Company Name] - [XX]% market share, $[XXX,XXX,XXX] revenue
• Emerging Players: [Company Names] - [XX]% combined market share
• Market Opportunity: [XX]% unaddressed market representing $[XXX,XXX,XXX]

${companyName} Competitive Advantages:

• [Specific differentiator 1]: [Quantified benefit vs. competitors]
• [Specific differentiator 2]: [Quantified benefit vs. competitors]
• [Specific differentiator 3]: [Quantified benefit vs. competitors]

Priority Market Segments:

• Primary Target: [Segment Name] - $[XXX,XXX] opportunity
  Rationale: [Specific reasons for prioritization and competitive advantages]

• Secondary Target: [Segment Name] - $[XXX,XXX] opportunity  
  Rationale: [Specific reasons for prioritization and market timing]

• Tertiary Target: [Segment Name] - $[XXX,XXX] opportunity
  Rationale: [Specific reasons for future expansion potential]

${partnerName ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER OVERLAP AND INTEGRATION ADOPTION

Partnership-specific market analysis evaluating the incremental opportunity through ${partnershipType} with ${partnerName}.

${partnerName} Customer Base Analysis:

• Total Customer Base: [XXX,XXX] active ${partnerName} customers
• Target Market Overlap: [XX]% overlap with ${companyName}'s ideal customer profile
• Addressable Segment: [XXX,XXX] qualified prospects within ${partnerName} ecosystem
• Geographic Distribution: [XX]% North America, [XX]% Europe, [XX]% other regions

Integration Adoption Dynamics:

Current ${partnerName} customers experience specific pain points that ${companyName} addresses:

• Manual ${industry} processes consuming [X-X] hours monthly per user
• Error rates of [XX]% in current ${industry} workflows
• Cost inefficiencies averaging $[XXX,XXX] annually per organization
• Integration gaps causing [XX]% productivity loss

Partnership Market Calculation:
─────────────────────────────
Partnership Opportunity = ${partnerName} Customers × Overlap % × Adoption Rate
Partnership Opportunity = [XXX,XXX] × [XX]% × [XX]%
Partnership Opportunity = $[XXX,XXX,XXX] incremental revenue

Time and Cost Savings Analysis:

• Time Savings: [X-X] hours monthly reduction in manual ${industry} tasks
• Cost Reduction: $[XXX,XXX] annual savings per customer through automation
• Error Reduction: [XX]% decrease in ${industry} process errors
• Implementation ROI: [XXX]% return on investment within [XX] months

Joint Market Capture Advantages:

• Market Entry Acceleration: [XX]% faster customer acquisition vs. independent approach
• Sales Cycle Reduction: ${partnerName} referrals reduce sales cycle by [XX]%
• Customer Lifetime Value: [XX]% higher LTV through integrated solution bundle
• Channel Access: Direct access to [XXX,XXX] pre-qualified ${partnerName} customers
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REVENUE OPPORTUNITY AND PRICING STRATEGY

Multi-year revenue projections based on market penetration analysis and competitive pricing benchmarks for ${companyName}'s ${pricingModel} model.

Pricing Strategy Justification:

Current market analysis supports ${companyName}'s ${pricePoint} ${pricingModel} positioning:

• Competitor Analysis: Market leaders price between $[XXX]-$[XXX] ${pricingModel}
• Value Proposition: ${companyName} delivers $[XXX,XXX] annual savings per customer
• Price Sensitivity: Target customers budget $[XXX,XXX] annually for ${industry} solutions
• Premium Positioning: [XX]% price premium justified by [specific differentiators]

Revenue Projections by Year:

• Year 1: $[XXX,XXX] revenue ([XXX] customers × $[XXX] average)
• Year 2: $[XXX,XXX] revenue ([XXX] customers × $[XXX] average)
• Year 3: $[X,XXX,XXX] revenue ([X,XXX] customers × $[XXX] average)
• Year 4: $[X,XXX,XXX] revenue ([X,XXX] customers × $[XXX] average)
• Year 5: $[XX,XXX,XXX] revenue ([XX,XXX] customers × $[XXX] average)

Customer Acquisition Cost and Lifetime Value:

• Customer Acquisition Cost (CAC): $[XXX] per customer
• Customer Lifetime Value (LTV): $[XXX,XXX] over [XX] months
• LTV:CAC Ratio: [XX]:1 (exceeds [X]:1 benchmark for profitable growth)
• Payback Period: [XX] months (below [XX] month industry standard)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTIONABLE INSIGHTS AND RECOMMENDATIONS

Strategic recommendations for ${companyName} to capture maximum market opportunity based on comprehensive market sizing analysis.

Market Entry Strategy:

Phase 1 (Months 0-12): Focus on [Primary Segment]
• Target Market: $[XXX,XXX] opportunity in [specific segment]
• Go-to-Market: [Specific channel strategy and tactics]
• Resource Allocation: [XX]% engineering, [XX]% sales, [XX]% marketing
• Success Metrics: [XXX] customers, $[XXX,XXX] ARR by month 12

Phase 2 (Months 12-24): Expand to [Secondary Segment]  
• Target Market: $[XXX,XXX] incremental opportunity
• Go-to-Market: [Channel expansion and scaling strategy]
• Resource Allocation: [XX]% product expansion, [XX]% sales scaling
• Success Metrics: [X,XXX] customers, $[X,XXX,XXX] ARR by month 24

Phase 3 (Months 24+): Scale to [Tertiary Segment]
• Target Market: $[XXX,XXX] long-term expansion opportunity
• Go-to-Market: [Enterprise and partnership channels]
• Resource Allocation: Focus on market leadership and expansion
• Success Metrics: [XX,XXX] customers, $[XX,XXX,XXX] ARR by month 36

Priority Growth Initiatives:

• Product Development: [Specific features] to increase market share by [XX]%
• Pricing Optimization: [Strategy] to improve ARPU by [XX]%
• Partnership Strategy: ${partnerName ? `${partnerName} integration` : 'Strategic partnerships'} for [XX]% GTM acceleration
• Geographic Expansion: [Markets] for $[XXX,XXX] incremental opportunity

Critical Success Factors:

• Market Timing: Enter [primary segment] within [XX] months to capture first-mover advantage
• Competitive Differentiation: Maintain [specific advantages] vs. key competitors
• Partnership Execution: ${partnerName ? `Execute ${partnerName} integration` : 'Develop strategic partnerships'} within [XX] months
• Resource Investment: Secure $[XXX,XXX] funding to achieve 3-year market capture goals

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: "You are a McKinsey-level senior strategy consultant generating premium market sizing reports for $5,000+ engagements. Your analysis must demonstrate deep market research expertise, specific calculations, and custom insights that justify high-value consulting fees. Provide comprehensive TAM/SAM/SOM analysis with realistic numbers, detailed methodology, and actionable insights. Generate 2,000-2,500 words of professional consulting content with specific data points throughout, not generic market commentary.\n\nCRITICAL FORMATTING RULES:\n- Use ONLY plain text formatting - NO LaTeX, NO HTML, NO markdown\n- NEVER use \\text{} or any LaTeX notation\n- Use simple math symbols: × for multiplication, = for equals\n- Use plain parentheses () for groupings\n- Example: Revenue = Users × Price × 12 (NOT \\text{Revenue} = \\text{Users} \\times \\text{Price})\n- All calculations must be in simple plain text format"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 7000
    });

    let reportContent = response.choices[0].message.content;
    
    // Clean any LaTeX formatting that might slip through
    reportContent = reportContent
      .replace(/\\text\{([^}]+)\}/g, '$1')  // Remove \text{} wrappers
      .replace(/\\times/g, '×')             // Replace LaTeX times with multiplication symbol
      .replace(/\\cdot/g, '×')              // Replace LaTeX cdot with multiplication symbol
      .replace(/\\div/g, '÷')               // Replace LaTeX div with division symbol
      .replace(/\\equals/g, '=')            // Replace LaTeX equals
      .replace(/\\\(/g, '(')                // Replace LaTeX parentheses
      .replace(/\\\)/g, ')')                // Replace LaTeX parentheses
      .replace(/\\,/g, ',')                 // Replace LaTeX comma spacing
      .replace(/\\\$/g, '$')                // Replace escaped dollar signs
      .replace(/\\&/g, '&');                // Replace escaped ampersands
    
    return {
      report: reportContent
    };
  } catch (error) {
    console.error('Error generating market sizing report:', error);
    throw new Error('Failed to generate market sizing report');
  }
}

export async function generateAssumptionValidationPlaybook(intakeData: any) {
  try {
    console.log('=== STARTING generateAssumptionValidationPlaybook ===');
    
    const { 
      companyName, 
      industry,
      targetCustomerDescription,
      currentStage,
      businessModel,
      productType,
      coreProblem,
      assumption1,
      assumption2,
      assumption3,
      partnershipRisk1,
      partnershipRisk2,
      partnershipRisk3,
      partnershipRisk4,
      partnershipRisk5
    } = intakeData;

    console.log('A1. Extracted data:', { companyName, industry, currentStage });
    
    const assumptions = [assumption1, assumption2, assumption3].filter(Boolean);
    const risks = [partnershipRisk1, partnershipRisk2, partnershipRisk3, partnershipRisk4, partnershipRisk5].filter(Boolean);

    console.log(`A2. Found ${assumptions.length} assumptions and ${risks.length} risks`);

    if (!assumptions.length || !risks.length) {
      throw new Error('Assumptions and risks are required to generate validation playbook');
    }

    const assumptionsList = assumptions.map((a: string, i: number) => `${i + 1}. "${a}"`).join('\n');
    const risksList = risks.map((r: string, i: number) => `${i + 1}. "${r}"`).join('\n');

    console.log('A3. Creating prompt...');
    
    const prompt = `Generate a clear, scannable Assumption & Risk Validation Playbook that shows SPECIFIC insights each module will deliver for ${companyName}'s assumptions and risks.

CLIENT'S SPECIFIC ASSUMPTIONS:
${assumptionsList}

CLIENT'S SPECIFIC RISKS/UNKNOWNS:
${risksList}

COMPANY CONTEXT: ${companyName} - ${industry} company, ${currentStage} stage, ${businessModel} model, targeting ${targetCustomerDescription}, solving ${coreProblem}

Create a concrete, actionable playbook using this EXACT format. You MUST use the exact headings provided - do not substitute similar phrases:

ASSUMPTION & RISK VALIDATION PLAYBOOK
${companyName} - How We Validate Your Specific Assumptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

MOST CRITICAL ASSUMPTION: [Identify which of their 3 assumptions has highest business impact and why]
HIGHEST RISK: [Identify which of their 5 risks poses biggest threat and why]
RECOMMENDED SPRINT TIER: [Discovery/Feasibility/Validation based on their needs]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW EACH MODULE VALIDATES YOUR ASSUMPTIONS

ASSUMPTION 1: "${assumptions[0] || 'Your first assumption'}"

MARKET SIZING ANALYSIS will reveal:
- Specific market data points (e.g., 'Xero has 22% market share in creative sector')
- Relevant trends (e.g., 'QuickBooks declining 5% yearly among photographers')
- Validation insights (e.g., 'Your 30% assumption may be optimistic based on adoption rates')

COMPETITIVE INTELLIGENCE will show:
- Which competitors offer what (e.g., '3 of 5 competitors are QuickBooks-only integrations')
- Pricing benchmarks (e.g., 'Xero integrations charge $12-18/month premium over QuickBooks')
- Market gaps (e.g., 'No competitor offers bi-directional sync with project management')

CUSTOMER VOICE SIMULATION will provide:
- Sentiment analysis (e.g., '65% prefer QuickBooks due to familiarity, 25% willing to switch')
- Specific concerns (e.g., 'Learning curve is #1 objection, pricing #2')
- Price sensitivity thresholds (e.g., 'Resistance above $18/month integration fee')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASSUMPTION 2: "${assumptions[1] || 'Your second assumption'}"

RISK ASSESSMENT will analyze:
- Technical feasibility scores (e.g., 'Xero API limitations impact 40% of desired features')
- Implementation timeline reality (e.g., 'Full integration requires 8-12 months vs 6 months assumed')
- Resource requirements (e.g., '3 full-time developers needed vs 1.5 budgeted')

BUSINESS MODEL SIMULATION will test:
- Revenue projections (e.g., 'Break-even requires 2,400 active users vs 1,000 estimated')
- Cost structure impacts (e.g., 'API fees reduce margins by 12% vs 5% assumed')
- Pricing sensitivity (e.g., 'Demand drops 35% above $25/month vs linear assumption')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASSUMPTION 3: "${assumptions[2] || 'Your third assumption'}"

COMPETITIVE INTELLIGENCE will reveal:
- Partnership landscape (e.g., 'Xero has 47 existing integrations, 12 in creative space')
- Competitive responses (e.g., 'QuickBooks likely to develop competing feature within 18 months')
- Market positioning opportunities (e.g., 'Focus on video production niche shows 67% less competition')

CHANNEL RECOMMENDATIONS will identify:
- Optimal go-to-market approach (e.g., 'Partner channel shows 3x higher conversion than direct')
- Customer acquisition costs (e.g., 'CAC through Xero marketplace: $45 vs $120 direct')
- Sales cycle realities (e.g., 'B2B sales average 4.2 months vs 2 months assumed')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW WE ADDRESS YOUR 5 IDENTIFIED RISKS

RISK 1: "${risks[0] || 'Your first risk'}"
Early Warning Signs: [Specific measurable indicators]
Detection Methods: [Which modules will identify this risk]
Mitigation Actions: [Concrete steps to take if risk materializes]

IMPORTANT: Use the exact heading "HOW WE ADDRESS YOUR 5 IDENTIFIED RISKS" - do not change this to any other variation like "YOUR RISK MITIGATION FRAMEWORK".

RISK 2: "${risks[1] || 'Your second risk'}"
Early Warning Signs: [Specific measurable indicators]
Detection Methods: [Which modules will identify this risk]  
Mitigation Actions: [Concrete steps to take if risk materializes]

RISK 3: "${risks[2] || 'Your third risk'}"
Early Warning Signs: [Specific measurable indicators]
Detection Methods: [Which modules will identify this risk]
Mitigation Actions: [Concrete steps to take if risk materializes]

RISK 4: "${risks[3] || 'Your fourth risk'}"
Early Warning Signs: [Specific measurable indicators]
Detection Methods: [Which modules will identify this risk]
Mitigation Actions: [Concrete steps to take if risk materializes]

RISK 5: "${risks[4] || 'Your fifth risk'}"
Early Warning Signs: [Specific measurable indicators]
Detection Methods: [Which modules will identify this risk]
Mitigation Actions: [Concrete steps to take if risk materializes]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT EACH SPRINT TIER ADDS

DISCOVERY SPRINT ($5,000) - Desk Research Foundation
- Market sizing data and competitive landscape analysis
- Customer sentiment from online sources and forums
- Technical feasibility assessment from documentation
- Business model stress testing with industry benchmarks

FEASIBILITY SPRINT ($15,000) - Adds Light Customer Validation
Discovery insights PLUS:
- 5 customer interviews revealing actual user preferences and pain points
- 1 demand test (landing page or survey) measuring real interest levels
- Direct feedback on pricing and feature priorities
- Validation confidence level: 70-80% for key assumptions

VALIDATION SPRINT ($35,000) - Comprehensive Market Testing  
Feasibility insights PLUS:
- 10-15 customer interviews across multiple segments for statistical significance
- 2-3 demand tests with paid advertising to measure true market response
- Comprehensive competitive positioning and threat assessment
- 90-day implementation roadmap with validated assumptions
- Validation confidence level: 90-95% for key assumptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPRINT TIER RECOMMENDATION

RECOMMENDED TIER: [Discovery/Feasibility/Validation]
RATIONALE: [Specific reasoning based on ${companyName}'s stage, assumptions, and risks]
EXPECTED OUTCOMES: [Specific insights they'll gain at this investment level]
SUCCESS CRITERIA: [How to measure if assumptions are validated or refuted]
NEXT STEPS: [Immediate actions to take based on validation results]

Focus on SPECIFIC insights and data points, not generic promises. Make it scannable and actionable. Show them exactly what intelligence they'll gain about their assumptions.`;

    console.log('A4. Calling OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: "You are a senior validation consultant creating detailed testing playbooks for startup assumptions and risks. Your analysis must provide specific, actionable testing strategies for each sprint investment level, with clear ROI justification for each tier.\n\nCRITICAL SPRINT TIER LIMITATIONS:\n\nDiscovery Sprint ($5,000) - 1 Week Desk Research Only:\n- NO customer interviews, prototypes, or live tests\n- ONLY secondary research: competitor analysis, online forums, existing data\n- Activities: Industry reports, Reddit/Facebook group analysis, support ticket analysis\n- Deliverables: Market insights report, competitive pricing analysis, technical feasibility assessment\n\nFeasibility Sprint ($15,000) - Discovery + Light Validation:\n- Includes everything from Discovery PLUS:\n- 5 customer interviews (phone/video calls)\n- 1 demand test (landing page with signup OR pricing survey)\n- Basic business model simulation\n- NO prototypes, beta programs, or A/B tests\n\nValidation Sprint ($35,000) - 30-Day Comprehensive Program:\n- Includes everything from Feasibility PLUS:\n- 10-15 customer interviews across segments\n- 2-3 demand tests (landing pages, paid ads, LOI collection)\n- Competitive battlecards\n- 90-day implementation roadmap\n- Still NO live product testing or beta programs\n\nFor each assumption, suggest:\n- Discovery: What can be learned from publicly available data\n- Feasibility: What 5 interviews + 1 test can reveal\n- Validation: What comprehensive research can prove\n\nAVOID suggesting prototypes, beta programs, A/B testing, or any activities requiring built products.\n\nCRITICAL FORMATTING RULES:\n- Use ONLY plain text formatting - NO LaTeX, NO HTML, NO markdown\n- NEVER use \\text{} or any LaTeX notation\n- Use simple symbols: × for multiplication, = for equals\n- Use plain parentheses () for groupings\n- All content must be formatted for clean copy/paste into Google Docs\n\nGenerate 1,800-2,200 words of practical validation guidance within these realistic constraints."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 8000
    });

    console.log('A5. OpenAI API response received, processing content...');

    let playbookContent = response.choices[0].message.content;
    
    // Clean any LaTeX formatting that might slip through
    if (playbookContent) {
      playbookContent = playbookContent
        .replace(/\\text\{([^}]+)\}/g, '$1')  // Remove \text{} wrappers
        .replace(/\\times/g, '×')             // Replace LaTeX times with multiplication symbol
        .replace(/\\cdot/g, '×')              // Replace LaTeX cdot with multiplication symbol
        .replace(/\\div/g, '÷')               // Replace LaTeX div with division symbol
        .replace(/\\equals/g, '=')            // Replace LaTeX equals
        .replace(/\\\(/g, '(')                // Replace LaTeX parentheses
        .replace(/\\\)/g, ')')                // Replace LaTeX parentheses
        .replace(/\\,/g, ',')                 // Replace LaTeX comma spacing
        .replace(/\\\$/g, '$')                // Replace escaped dollar signs
        .replace(/\\&/g, '&');                // Replace escaped ampersands
    }
    
    console.log('A6. Content cleaned, returning playbook');
    
    return {
      playbook: playbookContent
    };
  } catch (error) {
    console.error('Error generating assumption validation playbook:', error);
    throw new Error('Failed to generate assumption validation playbook');
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

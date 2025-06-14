import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
  timeout: 90000 // 90 seconds timeout for comprehensive reports
});

export async function generateCustomerVoiceSimulation(intakeData: any) {
  try {
    const companyName = intakeData.companyName || 'Your Company';
    const industry = intakeData.industry || 'Technology';
    const targetCustomer = intakeData.targetCustomerDescription || 'Small business owners';
    const coreProblem = intakeData.coreProblem || 'Business challenge';
    const valueProposition = intakeData.valueProposition || 'Value offering';
    const pricePoint = intakeData.estimatedPricePoint || '29';
    const currency = intakeData.currency || 'USD';
    const businessModel = intakeData.businessModel || 'Subscription';
    const currentStage = intakeData.currentStage || 'Pre-launch';
    
    // Get assumptions from intake data
    const assumptions = [
      intakeData.assumption1,
      intakeData.assumption2, 
      intakeData.assumption3
    ].filter(Boolean);

    // Check if partnership mode
    const isPartnership = intakeData.isPartnershipEvaluation;
    const partnerName = intakeData.partnershipCompany || '';
    const partnershipContext = isPartnership ? ` - ${partnerName} Partnership` : '';

    const prompt = `Generate comprehensive customer voice simulation for ${companyName} in ${industry} sector.

COMPANY CONTEXT:
- Business: ${companyName}${partnershipContext}
- Industry: ${industry}
- Target Customer: ${targetCustomer}
- Core Problem: ${coreProblem}
- Value Proposition: ${valueProposition}
- Price Point: ${currency} ${pricePoint}/month
- Business Model: ${businessModel}
- Stage: ${currentStage}

CUSTOMER ASSUMPTIONS TO VALIDATE:
${assumptions.map((a, i) => `${i + 1}. "${a}"`).join('\n')}

${isPartnership ? `
PARTNERSHIP CONTEXT:
This is a joint offering between ${companyName} and ${partnerName}. Generate responses that:
- Reference the JOINT experience and integration concerns
- Include trust issues with two companies handling data
- Address partnership stability and longevity concerns
- Evaluate combined solution value vs. separate tools
- Include data sharing concerns between partners
` : ''}

Generate a detailed 2,000-2,500 word customer voice simulation report using this EXACT format:

CUSTOMER VOICE SIMULATION
${companyName}${partnershipContext} Market Intelligence Report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

Generate 200-300 words summarizing key customer insights and validation results. Include emotional context and surprising discoveries. Make it feel like authentic market research.

KEY FINDINGS:
- Overall Receptivity: XX% positive, XX% neutral, XX% negative
- Top Concern: [Most common objection]
- Killer Feature: [Most requested capability] 
- Price Sensitivity: XX% find $${pricePoint}/month acceptable
- Adoption Timeline: XX% would try within 30 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SIMULATION METHODOLOGY

Approach:
Describe methodology for generating and analyzing 100+ customer responses across 4 key personas. Include confidence levels and rationale.

Confidence Levels:
- High Confidence: [List findings with 80%+ validation]
- Medium Confidence: [List findings with 60-79% validation]
- Directional Only: [List findings with <60% validation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. PERSONA ANALYSIS

Early Adopters (20% of responses)
─────────────────────────────────

Profile:
[300-400 word detailed persona description including demographics, psychographics, and decision criteria]

Representative Quotes:
- "Authentic quote showing enthusiasm with specific concerns..."
- "Quote about price sensitivity from this persona's perspective..."
- "Quote about competition or alternatives they're considering..."
- "Quote about specific feature requirements..."
- "Quote about timing and adoption concerns..."

Key Insights:
[Analysis of this persona's specific responses, objections, and decision factors]

Pragmatists (35% of responses)
─────────────────────────────

Profile:
[300-400 word detailed persona description]

Representative Quotes:
- "Need to see proof this actually works before I commit..."
- "Quote about needing references and case studies..."
- "Quote about integration and workflow concerns..."
- "Quote about cost-benefit analysis requirements..."
- "Quote about support and training needs..."

Key Insights:
[Analysis specific to pragmatist responses]

Skeptics (25% of responses)
──────────────────────────

Profile:
[300-400 word detailed persona description]

Representative Quotes:
- "Quote expressing doubt about value proposition..."
- "Quote about preferring current solution/competitor..."
- "Quote about being burned by similar promises before..."
- "Quote about specific technical or business concerns..."
- "Quote about budget constraints and priorities..."

Key Insights:
[Analysis of skeptical responses and conversion challenges]

Critics (20% of responses)
─────────────────────────

Profile:
[300-400 word detailed persona description]

Representative Quotes:
- "Quote expressing strong negative reaction..."
- "Quote about fundamental disagreement with approach..."
- "Quote about preferring alternative solutions..."
- "Quote about specific deal-breakers..."
- "Quote about industry or market concerns..."

Key Insights:
[Analysis of critical feedback and irreconcilable objections]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. ASSUMPTION VALIDATION RESULTS

${assumptions.map((assumption, index) => `
Assumption ${index + 1}: "${assumption}"
────────────────────────────────

Validation Score: XX% confidence
Supporting Quotes: XX responses
Contradicting Quotes: XX responses

Key Supporting Evidence:
- "Authentic quote demonstrating validation with emotional context..."
- "Another supporting perspective from different persona..."
- "Quote showing unexpected validation angle..."

Key Concerns Raised:
- "Quote showing skepticism with specific reasoning..."
- "Alternative viewpoint that challenges the assumption..."
- "Quote revealing implementation concerns..."

Strategic Implications:
[Analysis of how this validation impacts go-to-market strategy]
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. KEY THEMES & PATTERNS

Common Objections:
- [List top 5 objections with frequency percentages]

Excitement Drivers:
- [List top 5 excitement drivers with supporting quotes]

Deal Breakers:
- [List top 3 deal breakers that eliminate prospects]

Price Sensitivity Analysis:
[Detailed analysis of pricing feedback across personas]

Competitor Comparison:
[How customers compare to existing alternatives]

${isPartnership ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. PARTNERSHIP RECEPTION

Trust and Credibility Factors:
[Analysis of how customers perceive joint offering credibility]

Integration Concerns:
- "Quote about data sharing between ${companyName} and ${partnerName}..."
- "Quote about partnership stability concerns..."
- "Quote about preferring single vendor..."

Value Perception:
[How customers evaluate combined vs separate solutions]

Partnership-Specific Objections:
[Unique concerns raised about the partnership model]
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isPartnership ? '6' : '5'}. STRATEGIC RECOMMENDATIONS

Messaging Adjustments:
[Specific recommendations for improving value proposition messaging]

Feature Prioritization:
[Which capabilities to emphasize based on customer feedback]

Go-to-Market Insights:
[Tactical recommendations for customer acquisition and onboarding]

Risk Mitigation:
[How to address top concerns and objections proactively]

Market Positioning:
[How to differentiate from alternatives based on customer perspectives]

CRITICAL: Present all findings as genuine market research. Never mention AI, synthetic, or simulation. Make quotes feel authentic with industry-specific terminology and emotional context.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const reportContent = response.choices[0].message.content;
    
    return {
      report: reportContent,
      metadata: {
        generatedAt: new Date().toISOString(),
        wordCount: reportContent?.split(' ').length || 0,
        companyName,
        isPartnership
      }
    };
  } catch (error: any) {
    console.error('Error generating customer voice simulation:', error);
    throw new Error('Failed to generate customer voice simulation: ' + error.message);
  }
}

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

export async function generateRiskAssessment(intakeData: any) {
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
    throw new Error('Company name is required for generating risk assessment');
  }

  const prompt = isPartnership ? `
Generate a comprehensive risk assessment report of 2,000-2,500 words for the PARTNERSHIP between ${companyName} and ${partnerName}.

PARTNERSHIP CONTEXT:
- Company: ${companyName} (${currentStage} stage)
- Partner: ${partnerName}
- Partnership Type: ${partnershipType}
- Target Market: ${targetCustomer}
- Industry: ${industry}
- Business Model: ${businessModel}
- Price Point: ${pricePoint}

Focus on partnership-specific risks and mitigation strategies.` : `
Generate a comprehensive risk assessment report of 2,000-2,500 words analyzing risks for ${companyName} in the ${industry} sector.

COMPANY CONTEXT:
- Company: ${companyName} (${currentStage} stage)
- Target Market: ${targetCustomer}
- Industry: ${industry}
- Business Model: ${businessModel}
- Price Point: ${pricePoint}

Focus on general business risks for ${companyName}.`;

  const fullPrompt = `${prompt}

CRITICAL REQUIREMENTS:
- Generate 2,000-2,500 words with professional risk analysis depth
- Analyze 6 risk categories with 3-5 specific risks each
- Include probability ratings, impact assessments, and mitigation strategies
- Use specific percentages, dollar amounts, and concrete timelines
- Make it feel custom to ${companyName} in ${industry}, not generic templates

FORMAT WITH EXACT PROFESSIONAL RISK ANALYSIS STANDARD:

RISK ASSESSMENT REPORT
${companyName}${partnerName ? ` - ${partnerName} Partnership` : ''} Validation Sprint Risk Analysis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

The comprehensive risk assessment for ${companyName} in the ${industry} sector reveals a complex risk landscape requiring strategic mitigation across multiple categories. This analysis evaluates 6 primary risk categories with detailed probability assessments, impact quantification, and targeted mitigation strategies to ensure project success.

KEY FINDINGS:
- Critical Risks (Score >15): [Number] risks identified requiring immediate attention
- Highest Risk: [Risk name] - Score: XX/25 with potential $XXK impact
- Total Mitigation Investment: $XXK - $XXXK over 90-day period
- Risk Reduction Timeline: XX days to achieve target risk profile
- Success Probability: XX% with comprehensive mitigation implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. RISK ASSESSMENT METHODOLOGY

Framework Overview:
Our risk assessment utilizes a quantitative scoring framework combining probability and impact assessments to generate actionable risk scores. Each risk is evaluated on a 1-25 scale using standardized criteria for consistency and prioritization.

Risk Scoring Formula: Risk Score = Probability (1-5) × Impact (1-5)

Probability Ratings:
- High (5): >70% likelihood of occurrence
- Medium-High (4): 50-70% likelihood  
- Medium (3): 30-50% likelihood
- Medium-Low (2): 10-30% likelihood
- Low (1): <10% likelihood

Impact Ratings:
- High (5): >$500K impact or critical business disruption
- Medium-High (4): $100K-$500K impact or significant disruption
- Medium (3): $25K-$100K impact or moderate disruption
- Medium-Low (2): $5K-$25K impact or minor disruption
- Low (1): <$5K impact or minimal disruption

Risk Tolerance Levels:
- Critical (Score 20-25): Immediate action required, executive escalation
- High (Score 15-19): Priority mitigation needed within 30 days
- Medium (Score 8-14): Monitor and manage with 60-day action plan
- Low (Score 1-7): Accept risk or implement basic monitoring

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. CATEGORY RISK ANALYSIS

Market Risks
────────────
[Analyze 3-5 specific market risks for ${companyName} with probability, impact, and mitigation strategies]

Technical/Product Risks
──────────────────────
[Analyze 3-5 specific technical risks with detailed assessments]

Financial Risks
──────────────
[Analyze 3-5 financial risks with dollar impact quantification]

Operational Risks
────────────────
[Analyze 3-5 operational risks with efficiency impact assessment]

Competitive Risks
────────────────
[Analyze 3-5 competitive risks specific to ${industry} sector]

Regulatory/Compliance Risks
─────────────────────────
[Analyze 3-5 regulatory risks relevant to ${companyName}]

${isPartnership ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. PARTNERSHIP RISK ANALYSIS

${companyName}'s Partnership Risks
─────────────────────────────────
[Specific risks from ${companyName}'s perspective]

${partnerName}'s Partnership Risks
────────────────────────────────
[Specific risks from ${partnerName}'s perspective]

Mutual Partnership Risks
───────────────────────
[Shared risks affecting both parties]` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isPartnership ? '4' : '3'}. RISK PRIORITY MATRIX

TOP 10 CRITICAL RISKS (Ranked by Risk Score):
[List top 10 risks with specific scores and categories]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isPartnership ? '5' : '4'}. MITIGATION STRATEGIES

[Detailed mitigation plans for critical risks with specific actions, timelines, and success metrics]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isPartnership ? '6' : '5'}. RISK MANAGEMENT ROADMAP

90-Day Risk Reduction Plan:
[Specific implementation timeline with resource requirements and success metrics]

This comprehensive risk assessment provides ${companyName} with actionable intelligence to proactively manage risks and ensure project success in the ${industry} sector.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a McKinsey-level senior risk management consultant generating premium risk assessment reports for $5,000+ engagements. Your analysis must demonstrate deep risk expertise, quantitative rigor, and actionable mitigation strategies that justify high-value consulting fees. Each risk should be substantial with specific probability assessments, dollar impact quantification, and concrete mitigation plans. Use actual percentages, dollar amounts, and realistic timelines throughout. Generate 2,000-2,500 words of professional risk analysis that reads like expert strategic assessment, not generic templates."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000
    });

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

  } catch (error: any) {
    console.error('Error generating risk assessment:', error);
    throw new Error("Failed to generate risk assessment: " + error.message);
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

export async function generatePartnershipViability(intakeData: any) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  // Ensure this is a partnership evaluation
  if (!intakeData.isPartnershipEvaluation) {
    throw new Error('Partnership viability analysis is only available for partnership evaluations');
  }

  const companyName = intakeData.companyName || 'Your Company';
  const partnerName = intakeData.potentialPartnerName || intakeData.evaluatedPartner || 'Partner Company';
  const partnershipType = intakeData.partnershipType || 'Strategic Partnership';
  const industry = intakeData.industry || 'Technology';
  const targetCustomer = intakeData.targetCustomerDescription || 'small businesses';
  const businessModel = intakeData.businessModel || 'Subscription';
  const pricePoint = intakeData.estimatedPricePoint || '$99';
  const currentStage = intakeData.currentStage || 'Growth';
  const userBase = intakeData.currentUsers || '10K+ users';
  const primaryGoal = intakeData.primaryPartnershipGoal || 'market expansion';

  if (!companyName || !partnerName) {
    throw new Error('Both company name and partner name are required for partnership viability analysis');
  }

  const prompt = `Generate a comprehensive Partnership Viability Analysis of 2,000-2,500 words for the strategic partnership between ${companyName} and ${partnerName}.

PARTNERSHIP CONTEXT:
- Company 1: ${companyName} (${currentStage} stage, ${userBase})
- Company 2: ${partnerName}
- Partnership Type: ${partnershipType}
- Industry: ${industry}
- Target Market: ${targetCustomer}
- Business Model: ${businessModel}
- Price Point: ${pricePoint}/month
- Primary Goal: ${primaryGoal}

CRITICAL REQUIREMENTS:
- Generate 2,000-2,500 words with McKinsey-level depth and analysis
- Provide detailed scoring (1-10) for all 6 fit dimensions with specific justification
- Include realistic financial projections for Conservative, Realistic, and Optimistic scenarios
- Create specific partnership structure options with pros/cons and revenue models
- Provide 90-day implementation roadmap with detailed phases
- Use actual industry benchmarks and real partnership examples where relevant
- Make analysis feel custom to ${companyName} × ${partnerName}, not generic templates

FORMAT WITH EXACT PROFESSIONAL CONSULTING STANDARD:

PARTNERSHIP VIABILITY ANALYSIS
${companyName} × ${partnerName} Strategic Alliance Assessment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

The proposed strategic partnership between ${companyName} and ${partnerName} represents a compelling opportunity to [specific opportunity description based on their businesses]. This comprehensive viability assessment evaluates six critical dimensions of partnership fit to determine the likelihood of successful collaboration and mutual value creation.

Initial analysis reveals strong alignment in [specific area] with particular synergies in [specific examples]. The partnership addresses ${companyName}'s need for [specific need] while providing ${partnerName} with [specific value]. Key concerns center around [specific risks] which require careful management during implementation.

KEY FINDINGS:
• Overall Viability Score: XX/60 (based on 6 dimensions)
• Strongest Alignment: [Dimension] at X/10
• Biggest Concern: [Dimension] at X/10
• Revenue Opportunity: $X.XM in Year 1
• Implementation Timeline: XX days to launch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTNERSHIP FIT ASSESSMENT

Strategic Alignment: X/10
────────────────────────

Analysis: [Detailed assessment of how the companies' strategic objectives, market positioning, and long-term visions align. Include specific examples of complementary goals and potential conflicts.]

Evidence:
• [Specific proof point 1 with details]
• [Specific proof point 2 with details]
• [Specific proof point 3 with details]

Concerns:
• [Red flag or risk 1 with specific impact]
• [Red flag or risk 2 with specific impact]

Cultural Compatibility: X/10
────────────────────────

Analysis: [Assessment of organizational cultures, working styles, decision-making processes, and values alignment between the two companies.]

Evidence:
• [Specific cultural alignment example 1]
• [Specific cultural alignment example 2]
• [Specific cultural alignment example 3]

Concerns:
• [Cultural risk or mismatch 1]
• [Cultural risk or mismatch 2]

Technical Feasibility: X/10
────────────────────────

Analysis: [Evaluation of technical integration requirements, API compatibility, system architecture alignment, and implementation complexity.]

Evidence:
• [Technical compatibility point 1]
• [Technical compatibility point 2]
• [Technical compatibility point 3]

Concerns:
• [Technical integration challenge 1]
• [Technical integration challenge 2]

Financial Impact: X/10
────────────────────────

Analysis: [Assessment of financial benefits, cost implications, revenue sharing potential, and overall economic value creation for both parties.]

Evidence:
• [Financial benefit example 1]
• [Financial benefit example 2]
• [Financial benefit example 3]

Concerns:
• [Financial risk or concern 1]
• [Financial risk or concern 2]

Market Synergies: X/10
────────────────────────

Analysis: [Evaluation of market overlap, customer base synergies, cross-selling opportunities, and combined market positioning strength.]

Evidence:
• [Market synergy example 1]
• [Market synergy example 2]
• [Market synergy example 3]

Concerns:
• [Market conflict or cannibalization risk 1]
• [Market conflict or cannibalization risk 2]

Risk Factor: X/10
────────────────────────

Analysis: [Assessment of partnership risks including dependency, competitive threats, execution risks, and exit scenario complexity.]

Evidence:
• [Risk mitigation factor 1]
• [Risk mitigation factor 2]
• [Risk mitigation factor 3]

Concerns:
• [Significant risk factor 1]
• [Significant risk factor 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETAILED COMPATIBILITY ANALYSIS

Business Model Alignment
────────────────────────

[Deep dive into how the business models complement or conflict, including revenue streams, pricing strategies, customer acquisition approaches, and value chain positioning.]

Customer Base Overlap
────────────────────────

[Analysis of customer segment alignment, potential for cross-selling, customer behavior patterns, and market expansion opportunities.]

Technology Integration Requirements
────────────────────────

[Detailed technical assessment including API requirements, data sharing protocols, system integration complexity, and ongoing maintenance needs.]

Operational Considerations
────────────────────────

[Evaluation of operational processes, support structures, quality standards, and day-to-day collaboration requirements.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTNERSHIP STRUCTURE OPTIONS

Option 1: Deep API Integration
──────────────────────────────

Description: [Detailed explanation of deep technical integration model with API connectivity, data synchronization, and unified user experience.]

Pros:
• [Specific advantage 1 with business impact]
• [Specific advantage 2 with business impact]
• [Specific advantage 3 with business impact]

Cons:
• [Specific disadvantage 1 with mitigation strategy]
• [Specific disadvantage 2 with mitigation strategy]

Revenue Model: [Specific revenue sharing split, pricing structure, and financial terms]

Implementation Complexity: [High/Medium/Low with specific requirements]

Option 2: White-Label Partnership
──────────────────────────────

Description: [Detailed explanation of white-label model with branding, customization, and market positioning considerations.]

Pros:
• [Specific advantage 1]
• [Specific advantage 2]
• [Specific advantage 3]

Cons:
• [Specific disadvantage 1]
• [Specific disadvantage 2]

Revenue Model: [Specific terms and financial structure]

Implementation Complexity: [Assessment with timeline]

Option 3: Strategic Referral Program
──────────────────────────────

Description: [Detailed explanation of referral-based partnership with qualification criteria, incentive structures, and mutual promotion strategies.]

Pros:
• [Specific advantage 1]
• [Specific advantage 2]
• [Specific advantage 3]

Cons:
• [Specific disadvantage 1]
• [Specific disadvantage 2]

Revenue Model: [Commission structure and payment terms]

Implementation Complexity: [Assessment with requirements]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPLEMENTATION ROADMAP

Phase 1: Technical Integration (Days 1-30)
──────────────────────────────

Week 1-2: Technical Discovery
• API documentation review and technical requirements gathering
• Security and compliance assessment
• Integration architecture design and approval

Week 3-4: Core Integration Development
• API connectivity implementation
• Data mapping and synchronization setup
• Initial testing and validation protocols

Phase 2: Pilot Program (Days 31-60)
──────────────────────────────

Week 5-6: Pilot Setup
• Limited customer pilot group selection
• Training materials and support documentation
• Pilot monitoring and feedback systems

Week 7-8: Pilot Execution
• Active pilot program with selected customers
• Performance monitoring and data collection
• Issue identification and resolution

Phase 3: Full Launch (Days 61-90)
──────────────────────────────

Week 9-10: Launch Preparation
• Full integration testing and quality assurance
• Marketing materials and communication strategies
• Support team training and process documentation

Week 11-12: Market Launch
• Public announcement and customer communication
• Full customer onboarding and support activation
• Performance tracking and optimization

Phase 4: Scale and Optimize (Days 90+)
──────────────────────────────

Ongoing Activities:
• Performance monitoring and optimization
• Customer feedback integration and product improvements
• Expansion planning and additional integration opportunities
• Quarterly business reviews and strategic alignment assessment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINANCIAL PROJECTIONS

Conservative Scenario
────────────────────────

Assumptions:
• Customer adoption rate: [X]% in Year 1
• Average revenue per customer: $[XXX]/month
• Partnership revenue share: [XX]% to ${companyName}
• Implementation costs: $[XX,XXX]

Year 1 Projections:
• Month 1-3: $[X,XXX] (pilot phase)
• Month 4-6: $[XX,XXX] (early adoption)
• Month 7-9: $[XX,XXX] (growth phase)
• Month 10-12: $[XX,XXX] (mature adoption)
• Total Year 1 Revenue: $[XXX,XXX]

Realistic Scenario
────────────────────────

Assumptions:
• Customer adoption rate: [X]% in Year 1
• Average revenue per customer: $[XXX]/month
• Partnership revenue share: [XX]% to ${companyName}
• Implementation costs: $[XX,XXX]

Year 1 Projections:
• Q1: $[XX,XXX]
• Q2: $[XX,XXX]
• Q3: $[XXX,XXX]
• Q4: $[XXX,XXX]
• Total Year 1 Revenue: $[X.X]M

Years 2-3 Quarterly Projections:
• Year 2: $[X.X]M
• Year 3: $[X.X]M

Optimistic Scenario
────────────────────────

Assumptions:
• Customer adoption rate: [X]% in Year 1
• Average revenue per customer: $[XXX]/month
• Partnership revenue share: [XX]% to ${companyName}
• Implementation costs: $[XX,XXX]

Year 1 Projections:
• Q1: $[XX,XXX]
• Q2: $[XXX,XXX]
• Q3: $[XXX,XXX]
• Q4: $[X.X]M
• Total Year 1 Revenue: $[X.X]M

ROI Analysis:
• Break-even Timeline: [X] months
• 3-Year NPV: $[X.X]M
• IRR: [XX]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUCCESS METRICS & GOVERNANCE

Key Performance Indicators
────────────────────────

Partnership Health Metrics:
• Integration uptime: >99.5%
• Customer satisfaction score: >8.5/10
• Support ticket resolution time: <24 hours
• API response time: <200ms

Business Performance Metrics:
• Monthly recurring revenue growth: [X]% month-over-month
• Customer adoption rate: [X]% of eligible customers
• Revenue per partnership customer: $[XXX]/month
• Customer lifetime value increase: [X]%

Review Cadence
────────────────────────

Weekly Operational Reviews:
• Technical performance and issue resolution
• Customer support and satisfaction tracking
• Immediate tactical adjustments

Monthly Business Reviews:
• Financial performance against targets
• Customer adoption and engagement metrics
• Product feedback and improvement opportunities

Quarterly Strategic Reviews:
• Partnership strategic alignment assessment
• Market opportunity evaluation and expansion planning
• Competitive landscape analysis and positioning

Escalation Processes
────────────────────────

Level 1: Operational Issues
• Technical problems, support escalations
• Response time: <4 hours
• Resolution team: Technical leads from both companies

Level 2: Business Issues
• Performance concerns, customer complaints
• Response time: <24 hours
• Resolution team: Partnership managers and business leads

Level 3: Strategic Issues
• Partnership direction, major conflicts
• Response time: <72 hours
• Resolution team: C-level executives from both companies

Exit Strategies
────────────────────────

Planned Exit Scenarios:
• Natural contract expiration with evaluation for renewal
• Strategic pivot requiring partnership restructuring
• Acquisition by third party affecting partnership dynamics

Unplanned Exit Triggers:
• Persistent technical integration failures
• Irreconcilable business model conflicts
• Regulatory or compliance issues
• Material breach of partnership agreement

Exit Process:
• 90-day notice period for contract termination
• Customer transition plan and support continuity
• Data migration and technical disconnection procedures
• Post-partnership relationship management and potential future collaboration

RECOMMENDATION: [PROCEED/PROCEED WITH MODIFICATIONS/DO NOT PROCEED]

Based on the comprehensive analysis, the ${companyName} × ${partnerName} partnership shows [overall assessment]. The [XX/60] viability score indicates [interpretation]. Primary recommendation is to [specific next steps] with particular attention to [key areas requiring focus].

Focus on implementing the clean slate approach and using professional consulting formatting throughout the analysis.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a senior partnership strategy consultant specializing in technology company alliances. Generate comprehensive partnership viability analyses with McKinsey-level depth, specific financial modeling, and actionable implementation roadmaps. Use real industry benchmarks and partnership examples where relevant.\n\nCRITICAL FORMATTING RULES:\n- Use ONLY plain text formatting - NO LaTeX, NO HTML, NO markdown\n- Use simple symbols: × for multiplication, = for equals, ━ for separators\n- Use plain parentheses () for groupings\n- All content must be formatted for clean copy/paste into Google Docs\n- Generate 2,000-2,500 words of strategic partnership analysis"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 8000
    });

    let reportContent = response.choices[0].message.content;
    
    // Clean any LaTeX formatting that might slip through
    if (reportContent) {
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
    }
    
    return {
      report: reportContent
    };
  } catch (error) {
    console.error('Error generating partnership viability analysis:', error);
    throw new Error('Failed to generate partnership viability analysis');
  }
}

export async function generateGoDecision(sprintData: any, completedModules: any[]) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const companyName = sprintData.intakeData?.companyName || 'Your Company';
  const industry = sprintData.intakeData?.industry || 'Technology';
  const targetCustomer = sprintData.intakeData?.targetCustomerDescription || 'target customers';
  const sprintTier = sprintData.tier || 'discovery';
  const isPartnership = sprintData.intakeData?.isPartnershipEvaluation;
  const partnerName = sprintData.intakeData?.potentialPartnerName || '';

  // Extract all completed module reports with comprehensive data extraction
  const moduleReports = {};
  let totalModules = completedModules.length;
  let completedCount = 0;

  console.log('=== DECISION ENGINE DEBUG ===');
  console.log('Total modules provided:', totalModules);
  console.log('Module types found:', completedModules.map(m => m.moduleType));

  completedModules.forEach(module => {
    if (module.isCompleted) {
      completedCount++;
      console.log(`Processing module: ${module.moduleType}, has aiAnalysis:`, !!module.aiAnalysis);
      
      // Extract report content from different possible locations
      let reportContent = null;
      
      if (module.aiAnalysis?.report) {
        reportContent = module.aiAnalysis.report;
      } else if (module.aiAnalysis?.playbook) {
        reportContent = module.aiAnalysis.playbook;
      } else if (module.generatedData) {
        reportContent = JSON.stringify(module.generatedData, null, 2);
      } else if (module.aiAnalysis) {
        reportContent = JSON.stringify(module.aiAnalysis, null, 2);
      }
      
      if (reportContent) {
        moduleReports[module.moduleType] = reportContent;
        console.log(`Found report content for ${module.moduleType}, length:`, reportContent.length);
      } else {
        console.log(`No report content found for ${module.moduleType}`);
      }
    }
  });

  const completionRate = (completedCount / totalModules) * 100;
  console.log('Completed modules with reports:', Object.keys(moduleReports).length);
  console.log('Module types with reports:', Object.keys(moduleReports));

  if (Object.keys(moduleReports).length < 3) {
    throw new Error(`Insufficient data: At least 3 completed modules with reports required for decision analysis. Found ${Object.keys(moduleReports).length} modules with reports: ${Object.keys(moduleReports).join(', ')}`);
  }

  // Build comprehensive prompt with all module data
  let moduleAnalysisText = '';
  Object.entries(moduleReports).forEach(([moduleType, report]) => {
    const moduleTitle = moduleType.toUpperCase().replace(/_/g, ' ');
    moduleAnalysisText += `\n\n━━━ ${moduleTitle} MODULE REPORT ━━━\n${report}\n━━━ END ${moduleTitle} ━━━\n`;
  });

  const prompt = `You are a senior strategy consultant conducting a comprehensive GO/PIVOT/KILL decision analysis for ${companyName}. 

CRITICAL DATA AUTHENTICITY REQUIREMENTS:
- Extract ONLY authentic insights from the actual module reports provided below
- Use REAL data points, metrics, and findings from each module - NO FABRICATED NUMBERS
- Cite specific modules when referencing insights (e.g., "Market Sizing Analysis shows...")
- Cross-reference findings between modules to identify data convergence or contradictions
- Base confidence percentage on actual data quality and convergence across modules

COMPANY CONTEXT:
- Company: ${companyName}
- Industry: ${industry}
- Target Market: ${targetCustomer}
- Sprint Tier: ${sprintTier} (${sprintTier === 'discovery' ? 'DESK RESEARCH ONLY - NO IMPLEMENTATION ROADMAP' : 'INCLUDES IMPLEMENTATION PLANNING'})
- Modules Analyzed: ${Object.keys(moduleReports).length} completed modules
${isPartnership ? `- Partnership Context: Evaluating collaboration with ${partnerName}` : ''}

ACTUAL MODULE REPORTS TO ANALYZE:
${moduleAnalysisText}

ANALYSIS REQUIREMENTS:
- Generate 7-10 pages analyzing these ${Object.keys(moduleReports).length} specific modules
- Extract real findings from each module report (not generic assumptions)
- Provide GO/PIVOT/KILL recommendation based on actual data convergence
- Calculate confidence percentage based on data quality and consistency across modules
- Identify specific contradictions or supporting evidence between modules
- Reference which module provided each key insight
${sprintTier === 'discovery' ? '- NO IMPLEMENTATION ROADMAP (Discovery tier focuses on initial validation only)' : '- Include implementation roadmap and next steps'}
- Focus on cross-module synthesis using authentic data points

FORMAT WITH EXACT PROFESSIONAL CONSULTING STANDARD:

STRATEGIC DECISION ANALYSIS
${companyName}${isPartnership ? ` × ${partnerName} Partnership` : ''} Go/Pivot/Kill Assessment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY

Based on comprehensive analysis of ${Object.keys(moduleReports).length} validation modules (${Object.keys(moduleReports).map(m => m.replace(/_/g, ' ')).join(', ')}), this strategic assessment evaluates the viability of ${companyName}'s business proposition in the ${industry} sector. The analysis synthesizes authentic findings from completed validation modules to provide a data-driven recommendation.

${isPartnership ? `The partnership evaluation with ${partnerName} requires assessment based on actual partnership analysis data from the completed modules.` : ''}

RECOMMENDATION: [GO/PIVOT/KILL - based on actual data convergence]
CONFIDENCE LEVEL: [XX]% - calculated from data quality and consistency across modules
RATIONALE: [2-3 sentence summary citing specific module findings]

KEY DECISION FACTORS (with module citations):
• Market Opportunity: [Extract specific data from Market Sizing Analysis module]
• Customer Validation: [Extract specific data from Customer Voice Simulation module]
• Competitive Position: [Extract specific data from Competitive Intelligence module]
• Risk Profile: [Extract specific data from Risk Assessment module]
• Validation Strength: [Assessment based on actual module completion and data quality]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CROSS-MODULE SYNTHESIS

Data Convergence Analysis
────────────────────────

[Analyze where multiple modules provide supporting or conflicting evidence on key business assumptions. Identify patterns across market sizing, competitive intelligence, customer voice, and risk assessment that either strengthen or weaken the business case.]

Validation Strength Assessment
────────────────────────

[Evaluate the quality and consistency of validation data across modules. Rate the reliability of insights and highlight areas where multiple data sources confirm or contradict each other.]

Critical Assumption Validation
────────────────────────

[Cross-reference the original assumptions from intake with findings across all modules. Provide specific evidence for which assumptions are validated, challenged, or require further investigation.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODULE-BY-MODULE DECISION IMPACT

[For each completed module, extract the 3-5 most decision-relevant insights and their impact on the GO/PIVOT/KILL recommendation]

Market Sizing Analysis Impact
────────────────────────

Key Insights:
• [Specific market size finding and implication]
• [Specific growth trend and implication]
• [Specific competitive landscape finding]

Decision Relevance: [High/Medium/Low impact on recommendation]

Competitive Intelligence Impact
────────────────────────

Key Insights:
• [Specific competitive positioning finding]
• [Specific market gap or opportunity]
• [Specific competitive threat or advantage]

Decision Relevance: [High/Medium/Low impact on recommendation]

[Continue for all completed modules]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RISK-ADJUSTED RECOMMENDATION

Primary Recommendation: [GO/PIVOT/KILL]
────────────────────────

Confidence Level: [XX]%

Supporting Evidence:
• [Specific data point from modules supporting this recommendation]
• [Specific data point from modules supporting this recommendation]
• [Specific data point from modules supporting this recommendation]

Contradicting Evidence:
• [Specific concerns or negative findings from modules]
• [Specific risks or challenges identified]

Risk Mitigation Requirements:
• [Specific action required to address identified risks]
• [Specific action required to address identified risks]
• [Specific action required to address identified risks]

Alternative Scenario Analysis
────────────────────────

PIVOT Option: [If recommendation is GO, what would trigger a PIVOT?]
KILL Triggers: [What specific conditions would warrant stopping the initiative?]

${sprintTier !== 'discovery' ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPLEMENTATION ROADMAP

Immediate Next Steps (Days 1-30)
────────────────────────

[Based on the recommendation, provide specific, actionable next steps with owners and timelines]

• [Specific action item based on module findings]
• [Specific action item based on module findings]
• [Specific action item based on module findings]

Short-term Objectives (Days 31-90)
────────────────────────

[Medium-term actions required to execute the recommendation]

• [Specific milestone or objective]
• [Specific milestone or objective]
• [Specific milestone or objective]

Long-term Strategic Moves (3-12 months)
────────────────────────

[Strategic initiatives required for long-term success]

• [Strategic initiative based on analysis]
• [Strategic initiative based on analysis]
• [Strategic initiative based on analysis]` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONITORING & SUCCESS METRICS

Key Performance Indicators
────────────────────────

Based on module findings, track these metrics to validate the decision:

Market Metrics:
• [Specific metric from market analysis with target]
• [Specific metric from market analysis with target]

Customer Metrics:
• [Specific metric from customer validation with target]
• [Specific metric from customer validation with target]

Competitive Metrics:
• [Specific metric from competitive analysis with target]
• [Specific metric from competitive analysis with target]

Decision Review Triggers
────────────────────────

Schedule decision reviews when:
• [Specific condition that would warrant reassessment]
• [Specific condition that would warrant reassessment]
• [Specific condition that would warrant reassessment]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APPENDIX: MODULE SUMMARY

[Brief 2-3 sentence summary of each completed module's key findings]

${Object.keys(moduleReports).map(moduleType => `
${moduleType.replace(/_/g, ' ').toUpperCase()}:
[2-3 sentence summary of this module's key findings and implications]
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINAL RECOMMENDATION

After comprehensive analysis of ${Object.keys(moduleReports).length} validation modules (${Object.keys(moduleReports).map(m => m.replace(/_/g, ' ')).join(', ')}), the recommended course of action for ${companyName} is:

[CLEAR, DEFINITIVE RECOMMENDATION WITH SPECIFIC REASONING FROM ACTUAL MODULE DATA]

This recommendation is based on [cite specific evidence from actual module reports] and carries a [XX]% confidence level calculated from [specific data quality assessment across the ${Object.keys(moduleReports).length} completed modules].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL INSTRUCTIONS FOR ANALYSIS:
1. Extract ONLY real data points from the provided module reports
2. Reference specific modules when citing insights (e.g., "Risk Assessment identifies...")
3. Calculate confidence based on actual data convergence between modules
4. Identify real contradictions or supportive evidence across modules
5. Base ALL metrics and findings on actual report content - NO FABRICATED DATA
6. Focus on cross-module synthesis using authentic insights
7. Ensure module count (${Object.keys(moduleReports).length}) matches actual modules analyzed

Generate comprehensive analysis using ONLY the authentic data from these specific module reports.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a senior strategy consultant specializing in business validation and go-to-market decisions. Generate comprehensive strategic decision analyses that synthesize multiple data sources into actionable recommendations. Your analysis must provide specific, evidence-based reasoning for GO/PIVOT/KILL decisions with clear implementation roadmaps.\n\nCRITICAL FORMATTING RULES:\n- Use ONLY plain text formatting - NO LaTeX, NO HTML, NO markdown\n- Use simple symbols: × for multiplication, = for equals, ━ for separators\n- Use plain parentheses () for groupings\n- All content must be formatted for clean copy/paste into Google Docs\n- Generate 3,500-5,000 words of comprehensive strategic analysis"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 16000
    });

    let decisionContent = response.choices[0].message.content;
    
    // Clean any LaTeX formatting that might slip through
    if (decisionContent) {
      decisionContent = decisionContent
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
    
    // Extract structured recommendation data for UI components
    const extractRecommendation = (content: string) => {
      const lines = content.split('\n');
      let recommendation = 'GO';
      let confidence = 75;
      
      for (const line of lines) {
        if (line.includes('RECOMMENDATION:')) {
          const match = line.match(/RECOMMENDATION:\s*(GO|PIVOT|KILL)/i);
          if (match) recommendation = match[1].toUpperCase();
        }
        if (line.includes('CONFIDENCE LEVEL:')) {
          const match = line.match(/CONFIDENCE LEVEL:\s*(\d+)%/);
          if (match) confidence = parseInt(match[1]);
        }
      }
      
      return { recommendation, confidence };
    };
    
    const { recommendation, confidence } = extractRecommendation(decisionContent);
    
    return {
      report: decisionContent,
      recommendation,
      confidence,
      completionRate,
      modulesAnalyzed: Object.keys(moduleReports).length
    };
  } catch (error) {
    console.error('Error generating strategic decision analysis:', error);
    throw new Error('Failed to generate strategic decision analysis');
  }
}

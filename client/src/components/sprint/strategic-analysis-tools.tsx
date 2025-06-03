import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Shield, 
  Sword, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Zap,
  Star,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StrategicAnalysisToolsProps {
  sprintId: number;
  intakeData?: any;
  competitiveData?: any;
}

export default function StrategicAnalysisTools({ sprintId, intakeData, competitiveData }: StrategicAnalysisToolsProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>({});

  // Mock strategic analysis results (would come from AI analysis)
  const swotAnalysis = {
    strengths: [
      { title: 'Strong Technical Team', description: 'Experienced developers with domain expertise', impact: 'High' },
      { title: 'First Mover Advantage', description: 'Early in emerging market segment', impact: 'High' },
      { title: 'Low Initial Costs', description: 'SaaS model with scalable infrastructure', impact: 'Medium' },
      { title: 'Strategic Partnerships', description: 'Key integrations already in place', impact: 'Medium' }
    ],
    weaknesses: [
      { title: 'Limited Brand Recognition', description: 'Unknown in target market', impact: 'High' },
      { title: 'Small Customer Base', description: 'Limited testimonials and case studies', impact: 'Medium' },
      { title: 'Resource Constraints', description: 'Limited marketing and sales budget', impact: 'Medium' },
      { title: 'Feature Gaps', description: 'Missing some enterprise features', impact: 'Low' }
    ],
    opportunities: [
      { title: 'Market Growth', description: 'Industry growing at 25% annually', impact: 'High' },
      { title: 'Remote Work Trend', description: 'Increased demand for digital solutions', impact: 'High' },
      { title: 'API Economy', description: 'Growing integration marketplace', impact: 'Medium' },
      { title: 'Enterprise Adoption', description: 'Large companies seeking solutions', impact: 'Medium' }
    ],
    threats: [
      { title: 'Established Competitors', description: 'Large players with resources', impact: 'High' },
      { title: 'Economic Downturn', description: 'Reduced enterprise spending', impact: 'Medium' },
      { title: 'Technology Changes', description: 'Rapid evolution in tech stack', impact: 'Medium' },
      { title: 'Regulatory Changes', description: 'Data privacy regulations', impact: 'Low' }
    ]
  };

  const competitiveBattlecards = [
    {
      name: 'Market Leader Corp',
      marketShare: 35,
      pricing: '$299/month',
      strengths: ['Brand recognition', 'Enterprise features', 'Large customer base'],
      weaknesses: ['High price', 'Complex setup', 'Poor support'],
      differentiators: ['Lower cost', 'Easier setup', 'Better UX'],
      winStrategy: 'Position as modern alternative with better user experience',
      loseReasons: ['Feature parity', 'Enterprise credibility'],
      keyTalkingPoints: [
        'Our solution is 60% less expensive with faster setup',
        'Modern architecture vs legacy system',
        'Better customer support and onboarding'
      ]
    },
    {
      name: 'Startup Rival Inc',
      marketShare: 12,
      pricing: '$199/month',
      strengths: ['Modern tech', 'Aggressive pricing', 'Fast iteration'],
      weaknesses: ['Limited features', 'Small team', 'Funding concerns'],
      differentiators: ['More features', 'Better stability', 'Proven team'],
      winStrategy: 'Highlight our superior feature set and stability',
      loseReasons: ['Price competition', 'Similar positioning'],
      keyTalkingPoints: [
        'More comprehensive feature set',
        'Proven track record and stability',
        'Better enterprise readiness'
      ]
    },
    {
      name: 'Enterprise Giant',
      marketShare: 28,
      pricing: '$599/month',
      strengths: ['Enterprise trust', 'Global reach', 'Deep pockets'],
      weaknesses: ['Slow innovation', 'Over-engineered', 'Poor UX'],
      differentiators: ['Innovation speed', 'User experience', 'Agility'],
      winStrategy: 'Position as innovative alternative for modern teams',
      loseReasons: ['Enterprise requirements', 'Risk aversion'],
      keyTalkingPoints: [
        'Built for modern workflows',
        'Faster innovation cycle',
        'Superior user experience'
      ]
    }
  ];

  const implementationRoadmap = {
    phases: [
      {
        name: 'Foundation (Months 1-3)',
        timeline: '90 days',
        priority: 'Critical',
        initiatives: [
          { task: 'Complete MVP development', owner: 'Engineering', status: 'In Progress' },
          { task: 'Launch beta testing program', owner: 'Product', status: 'Planned' },
          { task: 'Establish initial partnerships', owner: 'BD', status: 'Planned' },
          { task: 'Build core team (5 hires)', owner: 'HR', status: 'Planned' }
        ],
        budget: '$150K',
        keyMetrics: ['Beta users: 50', 'Feature completion: 80%', 'Team size: 8']
      },
      {
        name: 'Market Entry (Months 4-6)',
        timeline: '90 days',
        priority: 'High',
        initiatives: [
          { task: 'Official product launch', owner: 'Marketing', status: 'Planned' },
          { task: 'Customer acquisition campaigns', owner: 'Marketing', status: 'Planned' },
          { task: 'Sales process optimization', owner: 'Sales', status: 'Planned' },
          { task: 'Customer success program', owner: 'CS', status: 'Planned' }
        ],
        budget: '$300K',
        keyMetrics: ['Customers: 100', 'MRR: $10K', 'CAC: $150']
      },
      {
        name: 'Scale (Months 7-12)',
        timeline: '180 days',
        priority: 'Medium',
        initiatives: [
          { task: 'Enterprise feature development', owner: 'Engineering', status: 'Planned' },
          { task: 'International expansion', owner: 'BD', status: 'Planned' },
          { task: 'Advanced analytics platform', owner: 'Engineering', status: 'Planned' },
          { task: 'Strategic partnership deals', owner: 'BD', status: 'Planned' }
        ],
        budget: '$500K',
        keyMetrics: ['Customers: 500', 'MRR: $50K', 'Team size: 25']
      }
    ]
  };

  const actionPlan90Day = {
    weeks: [
      {
        week: 'Week 1-2: Setup & Foundation',
        focus: 'Infrastructure and team alignment',
        tasks: [
          'Finalize product roadmap and specifications',
          'Set up development and testing environments',
          'Establish project management and communication tools',
          'Define success metrics and KPI dashboard'
        ]
      },
      {
        week: 'Week 3-4: Development Sprint',
        focus: 'Core feature development',
        tasks: [
          'Begin MVP development of core features',
          'Create user testing framework',
          'Develop initial marketing materials',
          'Start customer discovery interviews'
        ]
      },
      {
        week: 'Week 5-8: Beta Preparation',
        focus: 'Testing and refinement',
        tasks: [
          'Complete alpha version of product',
          'Conduct internal testing and bug fixes',
          'Recruit beta testing group',
          'Create customer onboarding process'
        ]
      },
      {
        week: 'Week 9-12: Beta Launch',
        focus: 'Market validation',
        tasks: [
          'Launch closed beta with selected users',
          'Gather feedback and iterate on features',
          'Optimize user experience based on data',
          'Prepare for public launch strategy'
        ]
      }
    ]
  };

  const partnershipEvaluation = {
    criteria: [
      { name: 'Strategic Fit', weight: 25, score: 85, description: 'Alignment with business goals' },
      { name: 'Market Access', weight: 20, score: 78, description: 'Opens new customer segments' },
      { name: 'Technical Integration', weight: 15, score: 92, description: 'API compatibility and ease' },
      { name: 'Revenue Potential', weight: 20, score: 75, description: 'Expected financial impact' },
      { name: 'Risk Assessment', weight: 10, score: 88, description: 'Partnership risks and mitigation' },
      { name: 'Implementation Cost', weight: 10, score: 82, description: 'Resources required' }
    ],
    overallScore: 82,
    recommendation: 'Proceed with partnership negotiations',
    keyRisks: [
      'Dependency on partner for critical functionality',
      'Potential future competition with partner',
      'Integration complexity may delay timeline'
    ],
    mitigationStrategies: [
      'Maintain backup integration options',
      'Include non-compete clauses in agreement',
      'Allocate additional development resources'
    ]
  };

  const runAnalysis = (type: string) => {
    setActiveAnalysis(type);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        ...analysisResults,
        [type]: true
      });
    }, 2000);
  };

  const getSWOTIcon = (category: string) => {
    switch (category) {
      case 'strengths': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'weaknesses': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'opportunities': return <Target className="w-4 h-4 text-blue-600" />;
      case 'threats': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return null;
    }
  };

  const getSWOTColor = (category: string) => {
    switch (category) {
      case 'strengths': return 'border-green-200 bg-green-50';
      case 'weaknesses': return 'border-red-200 bg-red-50';
      case 'opportunities': return 'border-blue-200 bg-blue-50';
      case 'threats': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Strategic Analysis Tools
          </CardTitle>
          <CardDescription>
            Comprehensive strategic analysis including SWOT, competitive battlecards, and implementation roadmaps
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="swot" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          <TabsTrigger value="battlecards">Battlecards</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="action-plan">90-Day Plan</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
        </TabsList>

        <TabsContent value="swot">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SWOT Analysis Matrix</CardTitle>
                <CardDescription>
                  Strategic assessment of internal strengths/weaknesses and external opportunities/threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(swotAnalysis).map(([category, items]) => (
                    <Card key={category} className={getSWOTColor(category)}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 capitalize text-lg">
                          {getSWOTIcon(category)}
                          {category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {items.map((item: any, index: number) => (
                          <div key={index} className="p-3 bg-white rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{item.title}</h4>
                              <Badge 
                                variant={item.impact === 'High' ? 'default' : item.impact === 'Medium' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {item.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategic Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Leverage Strengths
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              Emphasize technical expertise in marketing materials
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              Capitalize on first-mover advantage with rapid feature development
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              Expand strategic partnerships for market credibility
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            Address Weaknesses
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                              Invest in content marketing and thought leadership
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                              Create customer case studies and testimonials program
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                              Prioritize enterprise features for competitive positioning
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="battlecards">
          <div className="space-y-6">
            {competitiveBattlecards.map((competitor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sword className="w-5 h-5" />
                        {competitor.name}
                      </CardTitle>
                      <CardDescription>
                        {competitor.marketShare}% market share • {competitor.pricing}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      Battlecard #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700">Their Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold mb-3 mt-4 text-red-700">Their Weaknesses</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-blue-700">Our Differentiators</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.differentiators.map((diff, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {diff}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Win Strategy</h4>
                        <p className="text-sm text-blue-700">{competitor.winStrategy}</p>
                      </div>

                      <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">Why We Might Lose</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {competitor.loseReasons.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Key Talking Points</h4>
                      <div className="space-y-3">
                        {competitor.keyTalkingPoints.map((point, i) => (
                          <div key={i} className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-sm font-medium">{point}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Market Position</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">Market Share</span>
                          <Progress value={competitor.marketShare} className="flex-1" />
                          <span className="text-sm font-medium">{competitor.marketShare}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>12-Month Implementation Roadmap</CardTitle>
                <CardDescription>
                  Phased approach to market entry and scaling
                </CardDescription>
              </CardHeader>
            </Card>

            {implementationRoadmap.phases.map((phase, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {phase.name}
                      </CardTitle>
                      <CardDescription>{phase.timeline} • Budget: {phase.budget}</CardDescription>
                    </div>
                    <Badge variant={phase.priority === 'Critical' ? 'default' : 'secondary'}>
                      {phase.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Initiatives</h4>
                      <div className="space-y-3">
                        {phase.initiatives.map((initiative, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{initiative.task}</p>
                              <p className="text-xs text-gray-600">Owner: {initiative.owner}</p>
                            </div>
                            <Badge 
                              variant={
                                initiative.status === 'In Progress' ? 'default' : 
                                initiative.status === 'Completed' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {initiative.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Success Metrics</h4>
                      <div className="space-y-2">
                        {phase.keyMetrics.map((metric, i) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">{metric}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 border rounded-lg">
                        <h5 className="font-semibold mb-2">Budget Breakdown</h5>
                        <p className="text-2xl font-bold text-green-600">{phase.budget}</p>
                        <p className="text-sm text-gray-600">Total phase investment</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="action-plan">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>90-Day Action Plan</CardTitle>
                <CardDescription>
                  Detailed execution plan for the next quarter
                </CardDescription>
              </CardHeader>
            </Card>

            {actionPlan90Day.weeks.map((week, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {week.week}
                  </CardTitle>
                  <CardDescription>{week.focus}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {week.tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-blue-600">{i + 1}</span>
                        </div>
                        <p className="text-sm flex-1">{task}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>90-Day Success Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">50</p>
                    <p className="text-sm text-gray-600">Beta Users</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">80%</p>
                    <p className="text-sm text-gray-600">Feature Completion</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">10</p>
                    <p className="text-sm text-gray-600">Paying Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partnerships">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Evaluation Framework</CardTitle>
                <CardDescription>
                  Strategic assessment of potential partnership opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Evaluation Criteria</h4>
                    <div className="space-y-3">
                      {partnershipEvaluation.criteria.map((criterion, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{criterion.name}</p>
                            <p className="text-xs text-gray-600">{criterion.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center gap-2">
                              <Progress value={criterion.score} className="w-16 h-2" />
                              <span className="text-sm font-medium w-8">{criterion.score}</span>
                            </div>
                            <p className="text-xs text-gray-500">{criterion.weight}% weight</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Overall Score</h4>
                      <div className="flex items-center gap-3">
                        <Progress value={partnershipEvaluation.overallScore} className="flex-1 h-3" />
                        <span className="text-2xl font-bold text-green-700">
                          {partnershipEvaluation.overallScore}/100
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-2">
                        {partnershipEvaluation.recommendation}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Risk Assessment</h4>
                    <div className="space-y-3 mb-6">
                      {partnershipEvaluation.keyRisks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <p className="text-sm text-red-800">{risk}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className="font-semibold mb-4">Mitigation Strategies</h4>
                    <div className="space-y-3">
                      {partnershipEvaluation.mitigationStrategies.map((strategy, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-800">{strategy}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Next Steps</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Schedule partnership discussion meeting</li>
                        <li>Prepare partnership proposal document</li>
                        <li>Define success metrics and KPIs</li>
                        <li>Create implementation timeline</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
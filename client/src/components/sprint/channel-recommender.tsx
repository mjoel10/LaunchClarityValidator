import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Target, 
  Star,
  Search,
  Mail,
  Share2,
  Phone,
  MessageSquare,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ChannelRecommenderProps {
  sprintId: number;
  intakeData?: any;
}

const CHANNEL_DATABASE = {
  'B2B': {
    'SaaS': [
      {
        name: 'LinkedIn Ads',
        icon: <Users className="w-4 h-4" />,
        costEffectiveness: 85,
        timeToResults: 'Medium',
        scalability: 90,
        avgCac: '$120-180',
        conversionRate: '2.8%',
        suitability: 95,
        description: 'Highly targeted professional audience, excellent for SaaS',
        pros: ['Precise targeting', 'High-intent audience', 'Good for B2B'],
        cons: ['Higher cost per click', 'Limited creative formats'],
        setup: ['Create Business Manager', 'Define audience', 'Create campaigns'],
        budget: '$2,000-5,000/month',
        kpis: ['CTR: 0.4-0.8%', 'CPC: $5-12', 'Conversion Rate: 2-4%']
      },
      {
        name: 'Google Ads (Search)',
        icon: <Search className="w-4 h-4" />,
        costEffectiveness: 80,
        timeToResults: 'Fast',
        scalability: 95,
        avgCac: '$100-150',
        conversionRate: '3.2%',
        suitability: 90,
        description: 'Capture high-intent searches for your solution',
        pros: ['High intent', 'Fast results', 'Scalable'],
        cons: ['Competitive keywords expensive', 'Requires optimization'],
        setup: ['Keyword research', 'Create campaigns', 'Landing pages'],
        budget: '$3,000-8,000/month',
        kpis: ['CTR: 2-5%', 'Quality Score: 7+', 'ROAS: 3:1+']
      },
      {
        name: 'Content Marketing + SEO',
        icon: <Globe className="w-4 h-4" />,
        costEffectiveness: 95,
        timeToResults: 'Slow',
        scalability: 85,
        avgCac: '$50-100',
        conversionRate: '4.1%',
        suitability: 88,
        description: 'Build organic authority and capture search traffic',
        pros: ['Low cost', 'High-quality leads', 'Builds authority'],
        cons: ['Slow results', 'Requires expertise', 'Content intensive'],
        setup: ['Content strategy', 'SEO optimization', 'Distribution plan'],
        budget: '$1,000-3,000/month',
        kpis: ['Organic traffic growth', 'Keyword rankings', 'Lead quality']
      },
      {
        name: 'Email Marketing',
        icon: <Mail className="w-4 h-4" />,
        costEffectiveness: 90,
        timeToResults: 'Fast',
        scalability: 80,
        avgCac: '$30-80',
        conversionRate: '5.2%',
        suitability: 85,
        description: 'Direct communication with prospects and customers',
        pros: ['High ROI', 'Direct communication', 'Automation friendly'],
        cons: ['Requires email list', 'Deliverability challenges'],
        setup: ['Email platform', 'Segmentation', 'Automation flows'],
        budget: '$500-2,000/month',
        kpis: ['Open rate: 20-25%', 'Click rate: 3-5%', 'Conversion rate: 2-4%']
      },
      {
        name: 'Sales Outreach',
        icon: <Phone className="w-4 h-4" />,
        costEffectiveness: 75,
        timeToResults: 'Medium',
        scalability: 60,
        avgCac: '$200-400',
        conversionRate: '8.5%',
        suitability: 82,
        description: 'Direct sales approach for enterprise deals',
        pros: ['High conversion', 'Personal touch', 'Good for enterprise'],
        cons: ['Labor intensive', 'Hard to scale', 'Requires skilled reps'],
        setup: ['Sales team', 'CRM system', 'Outreach sequences'],
        budget: '$5,000-15,000/month',
        kpis: ['Response rate: 10-15%', 'Meeting rate: 3-5%', 'Close rate: 15-25%']
      }
    ],
    'Service': [
      {
        name: 'Google Ads (Local)',
        icon: <Search className="w-4 h-4" />,
        costEffectiveness: 85,
        timeToResults: 'Fast',
        scalability: 70,
        avgCac: '$80-120',
        conversionRate: '4.5%',
        suitability: 92,
        description: 'Target local businesses searching for services',
        pros: ['Local targeting', 'High intent', 'Quick results'],
        cons: ['Geographic limitations', 'Competitive'],
        setup: ['Local campaign setup', 'Location targeting', 'Call tracking'],
        budget: '$2,000-5,000/month',
        kpis: ['Local CTR: 3-6%', 'Call conversion: 15-25%']
      },
      {
        name: 'LinkedIn Outreach',
        icon: <Users className="w-4 h-4" />,
        costEffectiveness: 80,
        timeToResults: 'Medium',
        scalability: 65,
        avgCac: '$150-250',
        conversionRate: '6.2%',
        suitability: 88,
        description: 'Direct outreach to decision makers',
        pros: ['Direct access', 'Professional context', 'High-quality leads'],
        cons: ['Time intensive', 'Platform limitations'],
        setup: ['Profile optimization', 'Target list building', 'Message sequences'],
        budget: '$1,000-3,000/month',
        kpis: ['Connection rate: 15-25%', 'Response rate: 8-12%']
      }
    ]
  },
  'B2C': {
    'App': [
      {
        name: 'Facebook/Instagram Ads',
        icon: <Share2 className="w-4 h-4" />,
        costEffectiveness: 88,
        timeToResults: 'Fast',
        scalability: 95,
        avgCac: '$15-40',
        conversionRate: '2.1%',
        suitability: 93,
        description: 'Massive reach with sophisticated targeting',
        pros: ['Huge audience', 'Visual formats', 'Advanced targeting'],
        cons: ['iOS14 impact', 'Ad fatigue', 'Competition'],
        setup: ['Business Manager', 'Pixel setup', 'Creative development'],
        budget: '$2,000-10,000/month',
        kpis: ['CPM: $5-15', 'CTR: 1-3%', 'CPI: $1-5']
      },
      {
        name: 'Google Ads (App)',
        icon: <Smartphone className="w-4 h-4" />,
        costEffectiveness: 82,
        timeToResults: 'Fast',
        scalability: 90,
        avgCac: '$20-50',
        conversionRate: '2.8%',
        suitability: 90,
        description: 'App install campaigns across Google network',
        pros: ['High intent', 'Google Play integration', 'Universal campaigns'],
        cons: ['Competitive', 'Algorithm dependency'],
        setup: ['App campaigns', 'Firebase integration', 'Conversion tracking'],
        budget: '$3,000-12,000/month',
        kpis: ['CPI: $1-8', 'Install rate: 15-25%', 'ROAS: 2:1+']
      },
      {
        name: 'TikTok Ads',
        icon: <Monitor className="w-4 h-4" />,
        costEffectiveness: 85,
        timeToResults: 'Fast',
        scalability: 88,
        avgCac: '$12-35',
        conversionRate: '1.8%',
        suitability: 85,
        description: 'Engage younger demographics with video content',
        pros: ['Young audience', 'Viral potential', 'Creative formats'],
        cons: ['Specific demographics', 'Content intensive'],
        setup: ['Business account', 'Video creatives', 'Audience setup'],
        budget: '$1,500-8,000/month',
        kpis: ['CTR: 1.5-4%', 'CPM: $3-12', 'Video completion: 25-45%']
      }
    ],
    'E-commerce': [
      {
        name: 'Google Shopping',
        icon: <Search className="w-4 h-4" />,
        costEffectiveness: 90,
        timeToResults: 'Fast',
        scalability: 85,
        avgCac: '$25-60',
        conversionRate: '3.8%',
        suitability: 95,
        description: 'Product listings in Google search results',
        pros: ['High intent', 'Visual format', 'Competitive advantage'],
        cons: ['Product feed complexity', 'Google dependency'],
        setup: ['Merchant Center', 'Product feed', 'Shopping campaigns'],
        budget: '$2,000-8,000/month',
        kpis: ['CTR: 0.8-2%', 'ROAS: 4:1+', 'Impression share: 70%+']
      },
      {
        name: 'Facebook/Instagram Shop',
        icon: <Share2 className="w-4 h-4" />,
        costEffectiveness: 85,
        timeToResults: 'Fast',
        scalability: 90,
        avgCac: '$20-45',
        conversionRate: '2.5%',
        suitability: 90,
        description: 'Social commerce with native shopping experience',
        pros: ['Social proof', 'Native experience', 'Retargeting'],
        cons: ['Platform dependency', 'Attribution challenges'],
        setup: ['Shop setup', 'Catalog sync', 'Dynamic ads'],
        budget: '$1,500-6,000/month',
        kpis: ['CTR: 1.2-2.5%', 'ROAS: 3:1+', 'Add to cart rate: 8-15%']
      }
    ]
  }
};

export default function ChannelRecommender({ sprintId, intakeData }: ChannelRecommenderProps) {
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Determine recommended channels based on intake data
  const businessModel = intakeData?.businessModel || 'B2B';
  const productType = intakeData?.productType || 'SaaS';
  const currentStage = intakeData?.currentStage || 'Pre-launch';
  const budget = 5000; // Would come from intake

  const getRecommendedChannels = () => {
    const channels = CHANNEL_DATABASE[businessModel]?.[productType] || CHANNEL_DATABASE['B2B']['SaaS'];
    
    return channels.map(channel => ({
      ...channel,
      score: calculateChannelScore(channel),
      priority: getPriority(channel)
    })).sort((a, b) => b.score - a.score);
  };

  const calculateChannelScore = (channel: any) => {
    let score = channel.suitability;
    
    // Adjust based on budget
    const budgetNum = parseInt(channel.budget.replace(/[$,\-\/month]/g, ''));
    if (budgetNum <= budget) score += 10;
    else score -= 15;
    
    // Adjust based on stage
    if (currentStage === 'Pre-launch' && channel.timeToResults === 'Fast') score += 15;
    if (currentStage === 'Revenue > $100K' && channel.scalability > 80) score += 10;
    
    return Math.min(100, score);
  };

  const getPriority = (channel: any) => {
    const score = calculateChannelScore(channel);
    if (score >= 85) return 'High';
    if (score >= 70) return 'Medium';
    return 'Low';
  };

  const recommendedChannels = getRecommendedChannels();
  const topChannels = recommendedChannels.slice(0, 3);

  // Channel mix analysis
  const channelMixData = topChannels.map(channel => ({
    name: channel.name,
    effectiveness: channel.costEffectiveness,
    scalability: channel.scalability,
    speed: channel.timeToResults === 'Fast' ? 90 : channel.timeToResults === 'Medium' ? 60 : 30,
    cost: 100 - parseInt(channel.avgCac.replace(/[$\-]/g, '')) / 5,
  }));

  const runAnalysis = () => {
    setAnalysisComplete(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Channel Recommender
          </CardTitle>
          <CardDescription>
            AI-powered analysis of optimal customer acquisition channels for your business
          </CardDescription>
        </CardHeader>
      </Card>

      {!analysisComplete ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze Your Channels</h3>
            <p className="text-gray-600 mb-6">
              Based on your {businessModel} {productType} business model, I'll recommend the most effective customer acquisition channels.
            </p>
            <Button onClick={runAnalysis} size="lg">
              Analyze Optimal Channels
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="analysis">Channel Analysis</TabsTrigger>
            <TabsTrigger value="roadmap">Implementation</TabsTrigger>
            <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              {/* Top Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 3 Recommended Channels</CardTitle>
                  <CardDescription>
                    Ranked by effectiveness for your {businessModel} {productType} business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topChannels.map((channel, index) => (
                      <div 
                        key={index}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedChannel?.name === channel.name 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {channel.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{channel.name}</h3>
                              <p className="text-sm text-gray-600">{channel.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={channel.priority === 'High' ? 'default' : 'secondary'}
                            >
                              {channel.priority} Priority
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">Score: {channel.score}/100</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Cost Effectiveness</p>
                            <Progress value={channel.costEffectiveness} className="h-2 mt-1" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Avg CAC</p>
                            <p className="text-sm font-medium">{channel.avgCac}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Conv. Rate</p>
                            <p className="text-sm font-medium">{channel.conversionRate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time to Results</p>
                            <p className="text-sm font-medium">{channel.timeToResults}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Channel Details */}
              {selectedChannel && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedChannel.icon}
                      {selectedChannel.name} - Implementation Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Pros & Cons</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-green-700">Advantages:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {selectedChannel.pros.map((pro: string, i: number) => (
                                <li key={i}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-700">Considerations:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {selectedChannel.cons.map((con: string, i: number) => (
                                <li key={i}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Setup Requirements</h4>
                        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                          {selectedChannel.setup.map((step: string, i: number) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>

                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">Recommended Budget:</p>
                          <p className="text-lg font-bold text-blue-600">{selectedChannel.budget}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Key Performance Indicators</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedChannel.kpis.map((kpi: string, i: number) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">{kpi}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={channelMixData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="Effectiveness"
                          dataKey="effectiveness"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                        />
                        <Radar
                          name="Scalability"
                          dataKey="scalability"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.1}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost vs Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={recommendedChannels.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="costEffectiveness" fill="#3b82f6" />
                        <Bar dataKey="scalability" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Channel Suitability Analysis</CardTitle>
                <CardDescription>
                  How each channel aligns with your business model and stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedChannels.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          {channel.icon}
                        </div>
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-sm text-gray-600">{channel.avgCac} CAC</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Suitability</p>
                          <Progress value={channel.score} className="w-24 h-2" />
                        </div>
                        <Badge variant={channel.priority === 'High' ? 'default' : 'secondary'}>
                          {channel.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle>90-Day Implementation Roadmap</CardTitle>
                <CardDescription>
                  Step-by-step plan to launch your top 3 channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      period: 'Days 1-30: Foundation',
                      tasks: [
                        'Set up tracking and analytics infrastructure',
                        `Launch ${topChannels[0]?.name} with initial budget`,
                        'Create landing pages and conversion funnels',
                        'Establish baseline KPIs and reporting'
                      ]
                    },
                    {
                      period: 'Days 31-60: Optimization',
                      tasks: [
                        `Scale ${topChannels[0]?.name} based on initial results`,
                        `Launch ${topChannels[1]?.name} as second channel`,
                        'A/B test creative and messaging',
                        'Optimize conversion funnels based on data'
                      ]
                    },
                    {
                      period: 'Days 61-90: Expansion',
                      tasks: [
                        `Launch ${topChannels[2]?.name} as third channel`,
                        'Implement advanced attribution modeling',
                        'Create customer acquisition playbooks',
                        'Plan next quarter channel expansion'
                      ]
                    }
                  ].map((phase, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-lg mb-2">{phase.period}</h3>
                      <ul className="space-y-1">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Budget Allocation</CardTitle>
                  <CardDescription>Monthly budget distribution across channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topChannels.map((channel, index) => {
                      const allocation = index === 0 ? 50 : index === 1 ? 30 : 20;
                      const budget = (allocation / 100) * 5000;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {channel.icon}
                            <div>
                              <p className="font-medium">{channel.name}</p>
                              <p className="text-sm text-gray-600">{allocation}% allocation</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${budget.toLocaleString()}/mo</p>
                            <p className="text-sm text-gray-600">Est. CAC: {channel.avgCac}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Budget Recommendations:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Start with 50% on your highest-scoring channel</li>
                      <li>• Allocate 30% to your second-best option</li>
                      <li>• Reserve 20% for testing additional channels</li>
                      <li>• Reallocate monthly based on performance data</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ROI Projections</CardTitle>
                  <CardDescription>Expected returns by channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topChannels.map((channel, index) => {
                      const allocation = index === 0 ? 50 : index === 1 ? 30 : 20;
                      const monthlyBudget = (allocation / 100) * 5000;
                      const avgCac = parseInt(channel.avgCac.replace(/[$\-]/g, '').split('').filter(c => !isNaN(parseInt(c))).join(''));
                      const expectedCustomers = Math.floor(monthlyBudget / avgCac);
                      const expectedRevenue = expectedCustomers * 99; // Assuming $99 monthly price
                      
                      return (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{channel.name}</p>
                            <Badge variant="outline">${monthlyBudget}/mo</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Customers</p>
                              <p className="font-medium">{expectedCustomers}/mo</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Revenue</p>
                              <p className="font-medium">${expectedRevenue}/mo</p>
                            </div>
                            <div>
                              <p className="text-gray-600">ROAS</p>
                              <p className="font-medium">{(expectedRevenue / monthlyBudget).toFixed(1)}:1</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
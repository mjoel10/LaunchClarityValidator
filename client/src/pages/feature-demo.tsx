import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Lock, 
  CheckCircle, 
  Crown, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Brain,
  Sword,
  MapPin,
  Calendar,
  Handshake,
  Lightbulb
} from 'lucide-react';
import Sidebar from '@/components/navigation/sidebar';
import BusinessModelSimulator from '@/components/sprint/business-model-simulator';
import ChannelRecommender from '@/components/sprint/channel-recommender';
import StrategicAnalysisTools from '@/components/sprint/strategic-analysis-tools';
import { cn } from '@/lib/utils';

const MOCK_SPRINT_DATA = {
  discovery: {
    id: 1,
    tier: 'discovery',
    status: 'active',
    companyName: 'TechStart AI',
    progress: 65,
    client: { name: 'Sarah Chen' },
    consultant: { name: 'Mike Johnson' },
    intakeData: {
      businessModel: 'B2B',
      productType: 'SaaS',
      currentStage: 'MVP',
      industry: 'Artificial Intelligence'
    }
  },
  feasibility: {
    id: 2,
    tier: 'feasibility',
    status: 'active',
    companyName: 'GreenTech Solutions',
    progress: 40,
    client: { name: 'David Park' },
    consultant: { name: 'Mike Johnson' },
    intakeData: {
      businessModel: 'B2B',
      productType: 'SaaS',
      currentStage: 'Revenue < $100K',
      industry: 'Clean Technology'
    }
  },
  validation: {
    id: 3,
    tier: 'validation',
    status: 'active',
    companyName: 'FinanceFlow Pro',
    progress: 85,
    client: { name: 'Lisa Rodriguez' },
    consultant: { name: 'Mike Johnson' },
    intakeData: {
      businessModel: 'B2B',
      productType: 'SaaS',
      currentStage: 'Revenue > $100K',
      industry: 'Financial Services'
    }
  }
};

const MOCK_MODULES = [
  { id: 1, moduleType: 'intake', isCompleted: true, isLocked: false },
  { id: 2, moduleType: 'market_simulation', isCompleted: true, isLocked: false },
  { id: 3, moduleType: 'assumptions', isCompleted: false, isLocked: false },
  { id: 4, moduleType: 'competitive_intel', isCompleted: false, isLocked: false },
  { id: 5, moduleType: 'market_sizing', isCompleted: false, isLocked: false },
  { id: 6, moduleType: 'risk_assessment', isCompleted: false, isLocked: false },
  { id: 7, moduleType: 'swot_analysis', isCompleted: false, isLocked: false },
];

const FEATURE_COMPONENTS = {
  business_model_simulator: BusinessModelSimulator,
  channel_recommender: ChannelRecommender,
  strategic_analysis: StrategicAnalysisTools,
};

export default function FeatureDemo() {
  const [selectedTier, setSelectedTier] = useState<'discovery' | 'feasibility' | 'validation'>('discovery');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const currentSprint = MOCK_SPRINT_DATA[selectedTier];

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'discovery':
        return { 
          label: 'Discovery Sprint', 
          price: '$5,000', 
          color: 'bg-blue-100 text-blue-800',
          icon: <Shield className="w-4 h-4" />
        };
      case 'feasibility':
        return { 
          label: 'Feasibility Sprint', 
          price: '$15,000', 
          color: 'bg-orange-100 text-orange-800',
          icon: <Zap className="w-4 h-4" />
        };
      case 'validation':
        return { 
          label: 'Validation Sprint', 
          price: '$35,000', 
          color: 'bg-purple-100 text-purple-800',
          icon: <Crown className="w-4 h-4" />
        };
      default:
        return { label: 'Unknown', price: '$0', color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const tierInfo = getTierInfo(selectedTier);

  const FeatureCard = ({ feature, isLocked, requiredTier }: any) => {
    const Component = FEATURE_COMPONENTS[feature.key as keyof typeof FEATURE_COMPONENTS];
    
    return (
      <Card className={cn(
        "cursor-pointer transition-all",
        isLocked ? "opacity-50 bg-gray-50" : "hover:shadow-md",
        activeFeature === feature.key && "ring-2 ring-blue-500"
      )}>
        <CardHeader 
          className="pb-3"
          onClick={() => !isLocked && setActiveFeature(activeFeature === feature.key ? null : feature.key)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isLocked ? "bg-gray-200" : "bg-blue-100"
              )}>
                {feature.icon}
              </div>
              <div>
                <CardTitle className={cn(
                  "text-lg",
                  isLocked && "line-through text-gray-500"
                )}>
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isLocked && (
                <>
                  <Lock className="w-4 h-4 text-gray-400" />
                  <Badge className={getTierInfo(requiredTier).color}>
                    {getTierInfo(requiredTier).icon}
                    {getTierInfo(requiredTier).label}
                  </Badge>
                </>
              )}
              {!isLocked && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
        </CardHeader>
        
        {activeFeature === feature.key && Component && !isLocked && (
          <CardContent>
            <Component 
              sprintId={currentSprint.id} 
              intakeData={currentSprint.intakeData}
            />
          </CardContent>
        )}
      </Card>
    );
  };

  const ALL_FEATURES = [
    // Discovery Features (Always Available)
    { 
      key: 'market_simulation', 
      title: 'AI Market Simulation', 
      description: 'Simulate market conditions and customer behavior',
      icon: <Users className="w-5 h-5" />,
      tier: 'discovery'
    },
    { 
      key: 'swot_analysis', 
      title: 'SWOT Analysis', 
      description: 'Comprehensive strengths, weaknesses, opportunities, threats analysis',
      icon: <Shield className="w-5 h-5" />,
      tier: 'discovery'
    },
    { 
      key: 'competitive_intel', 
      title: 'Competitive Intelligence', 
      description: 'Deep analysis of competitive landscape',
      icon: <Target className="w-5 h-5" />,
      tier: 'discovery'
    },
    { 
      key: 'market_sizing', 
      title: 'Market Sizing Analysis', 
      description: 'TAM, SAM, SOM calculations with AI insights',
      icon: <BarChart3 className="w-5 h-5" />,
      tier: 'discovery'
    },
    { 
      key: 'risk_assessment', 
      title: 'Risk Assessment', 
      description: 'Identify and quantify business risks',
      icon: <Shield className="w-5 h-5" />,
      tier: 'discovery'
    },

    // Feasibility Features
    { 
      key: 'business_model_simulator', 
      title: 'Business Model Simulator', 
      description: 'Interactive unit economics and revenue modeling',
      icon: <TrendingUp className="w-5 h-5" />,
      tier: 'feasibility'
    },
    { 
      key: 'channel_recommender', 
      title: 'Channel Recommender', 
      description: 'AI-powered customer acquisition channel optimization',
      icon: <Target className="w-5 h-5" />,
      tier: 'feasibility'
    },
    { 
      key: 'async_interviews', 
      title: 'Async Interview Suite', 
      description: 'Automated customer interview platform',
      icon: <Users className="w-5 h-5" />,
      tier: 'feasibility'
    },
    { 
      key: 'demand_testing', 
      title: 'Demand Testing Lab', 
      description: 'A/B test demand with landing pages and campaigns',
      icon: <Lightbulb className="w-5 h-5" />,
      tier: 'feasibility'
    },

    // Validation Features (Premium)
    { 
      key: 'strategic_analysis', 
      title: 'Strategic Analysis Tools', 
      description: 'Advanced battlecards, roadmaps, and strategic planning',
      icon: <Brain className="w-5 h-5" />,
      tier: 'validation'
    },
    { 
      key: 'battlecards', 
      title: 'Competitive Battlecards', 
      description: 'Sales-ready competitive positioning materials',
      icon: <Sword className="w-5 h-5" />,
      tier: 'validation'
    },
    { 
      key: 'implementation_roadmap', 
      title: 'Implementation Roadmap', 
      description: '12-month strategic execution plan',
      icon: <MapPin className="w-5 h-5" />,
      tier: 'validation'
    },
    { 
      key: 'action_plans', 
      title: '90-Day Action Plan', 
      description: 'Detailed quarterly execution framework',
      icon: <Calendar className="w-5 h-5" />,
      tier: 'validation'
    },
    { 
      key: 'partnership_evaluation', 
      title: 'Partnership Evaluation', 
      description: 'Strategic partnership assessment framework',
      icon: <Handshake className="w-5 h-5" />,
      tier: 'validation'
    },
    { 
      key: 'full_interview_suite', 
      title: 'Full Interview Suite', 
      description: '25+ participant comprehensive validation interviews',
      icon: <Users className="w-5 h-5" />,
      tier: 'validation'
    },
    { 
      key: 'multi_channel_testing', 
      title: 'Multi-Channel Testing', 
      description: 'Advanced A/B/C testing across multiple channels',
      icon: <BarChart3 className="w-5 h-5" />,
      tier: 'validation'
    }
  ];

  const getFeatureAccess = (featureTier: string) => {
    const tierHierarchy = { discovery: 1, feasibility: 2, validation: 3 };
    const currentTierLevel = tierHierarchy[selectedTier];
    const featureTierLevel = tierHierarchy[featureTier as keyof typeof tierHierarchy];
    
    return currentTierLevel >= featureTierLevel;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar sprint={currentSprint} modules={MOCK_MODULES} />
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  LaunchClarity Feature Demonstration
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete tier-based feature gating system with all components
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as any)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery Sprint - $5,000</SelectItem>
                    <SelectItem value="feasibility">Feasibility Sprint - $15,000</SelectItem>
                    <SelectItem value="validation">Validation Sprint - $35,000</SelectItem>
                  </SelectContent>
                </Select>
                
                <Badge className={cn("flex items-center gap-2", tierInfo.color)}>
                  {tierInfo.icon}
                  {tierInfo.label}
                </Badge>
              </div>
            </div>

            {/* Current Sprint Info */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{currentSprint.companyName}</h2>
                    <p className="text-gray-600">
                      Client: {currentSprint.client.name} • 
                      Consultant: {currentSprint.consultant.name} • 
                      Progress: {currentSprint.progress}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{tierInfo.price}</p>
                    <p className="text-sm text-gray-600">{tierInfo.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Grid */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Available Features for {tierInfo.label}</h3>
              
              <div className="grid grid-cols-1 gap-6">
                {ALL_FEATURES.map((feature) => {
                  const hasAccess = getFeatureAccess(feature.tier);
                  
                  return (
                    <FeatureCard
                      key={feature.key}
                      feature={feature}
                      isLocked={!hasAccess}
                      requiredTier={feature.tier}
                    />
                  );
                })}
              </div>
            </div>

            {/* Feature Summary */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Feature Access Summary</CardTitle>
                <CardDescription>
                  Your current {tierInfo.label} includes the following capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3">Included Features</h4>
                    <div className="space-y-2">
                      {ALL_FEATURES.filter(f => getFeatureAccess(f.tier)).map(feature => (
                        <div key={feature.key} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature.title}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Locked Features</h4>
                    <div className="space-y-2">
                      {ALL_FEATURES.filter(f => !getFeatureAccess(f.tier)).map(feature => (
                        <div key={feature.key} className="flex items-center gap-2 text-sm text-gray-500">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="line-through">{feature.title}</span>
                          <Badge className={cn("text-xs", getTierInfo(feature.tier).color)}>
                            {getTierInfo(feature.tier).label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-700 mb-3">Upgrade Benefits</h4>
                    <div className="space-y-2 text-sm">
                      {selectedTier === 'discovery' && (
                        <>
                          <p>• Upgrade to Feasibility for Business Model Simulator</p>
                          <p>• Get Channel Recommender and Interview Suite</p>
                          <p>• Access demand testing capabilities</p>
                        </>
                      )}
                      {selectedTier === 'feasibility' && (
                        <>
                          <p>• Upgrade to Validation for Strategic Analysis</p>
                          <p>• Get Competitive Battlecards</p>
                          <p>• Access Implementation Roadmaps</p>
                        </>
                      )}
                      {selectedTier === 'validation' && (
                        <p className="text-green-600 font-medium">
                          • You have access to all premium features!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
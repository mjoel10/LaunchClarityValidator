import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Lock, 
  Check, 
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
  Lightbulb,
  ChevronRight,
  FileText,
  Sparkles,
  ArrowRight,
  DollarSign,
  UserCheck,
  Microscope,
  Rocket
} from 'lucide-react';
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
    progress: 33,
    client: { name: 'Mike Johnson' },
    consultant: { name: 'Sarah Chen' },
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
    progress: 60,
    client: { name: 'David Park' },
    consultant: { name: 'Sarah Chen' },
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
    consultant: { name: 'Sarah Chen' },
    intakeData: {
      businessModel: 'B2B',
      productType: 'SaaS',
      currentStage: 'Revenue > $100K',
      industry: 'Financial Services'
    }
  }
};

export default function FeatureDemo() {
  const [selectedTier, setSelectedTier] = useState<'discovery' | 'feasibility' | 'validation'>('discovery');
  const [activeSection, setActiveSection] = useState<'overview' | 'features' | 'reports'>('overview');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const currentSprint = MOCK_SPRINT_DATA[selectedTier];

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'discovery':
        return { 
          label: 'Discovery Sprint', 
          price: '$5,000', 
          color: 'bg-blue-100 text-blue-800'
        };
      case 'feasibility':
        return { 
          label: 'Feasibility Sprint', 
          price: '$15,000', 
          color: 'bg-orange-100 text-orange-800'
        };
      case 'validation':
        return { 
          label: 'Validation Sprint', 
          price: '$35,000', 
          color: 'bg-purple-100 text-purple-800'
        };
      default:
        return { label: 'Unknown', price: '$0', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const tierInfo = getTierInfo(selectedTier);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'active': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'active': return 'In Progress';
      default: return 'Not Started';
    }
  };

  const ALL_FEATURES = {
    discovery: [
      {
        id: 'ai-market',
        name: 'AI Market Simulation',
        description: 'Simulate market conditions and customer behavior',
        icon: Brain,
        available: true,
        status: 'active'
      },
      {
        id: 'swot',
        name: 'SWOT Analysis',
        description: 'Comprehensive strengths, weaknesses, opportunities, threats analysis',
        icon: Shield,
        available: true,
        status: 'active'
      },
      {
        id: 'competitive',
        name: 'Competitive Intelligence',
        description: 'Deep analysis of competitive landscape',
        icon: Target,
        available: true,
        status: 'completed'
      },
      {
        id: 'market-sizing',
        name: 'Market Sizing Analysis',
        description: 'TAM, SAM, SOM calculations with AI insights',
        icon: TrendingUp,
        available: true,
        status: 'active'
      },
      {
        id: 'risk',
        name: 'Risk Assessment',
        description: 'Identify and quantify business risks',
        icon: Shield,
        available: true,
        status: 'not-started'
      }
    ],
    feasibility: [
      {
        id: 'business-model',
        name: 'Business Model Simulator',
        description: 'Interactive unit economics and revenue modeling',
        icon: DollarSign,
        available: selectedTier !== 'discovery',
        tier: 'Feasibility Sprint'
      },
      {
        id: 'channel',
        name: 'Channel Recommender',
        description: 'AI-powered customer acquisition channel optimization',
        icon: Rocket,
        available: selectedTier !== 'discovery',
        tier: 'Feasibility Sprint'
      },
      {
        id: 'interviews',
        name: 'Customer Interviews',
        description: '5-7 professional interviews via User Interviews API',
        icon: UserCheck,
        available: selectedTier !== 'discovery',
        tier: 'Feasibility Sprint'
      }
    ],
    validation: [
      {
        id: 'strategic',
        name: 'Strategic Analysis Tools',
        description: 'Comprehensive strategic planning toolkit',
        icon: Microscope,
        available: selectedTier === 'validation',
        tier: 'Validation Sprint'
      },
      {
        id: 'implementation',
        name: 'Implementation Roadmap',
        description: '90-day action plan with milestones',
        icon: Calendar,
        available: selectedTier === 'validation',
        tier: 'Validation Sprint'
      }
    ]
  };

  const getFeatureAccess = (featureTier: string) => {
    const tierHierarchy = { discovery: 1, feasibility: 2, validation: 3 };
    const currentTierLevel = tierHierarchy[selectedTier];
    const featureTierLevel = tierHierarchy[featureTier as keyof typeof tierHierarchy];
    
    return currentTierLevel >= featureTierLevel;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LaunchClarity
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setActiveSection('overview')}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === 'overview' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveSection('features')}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === 'features' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sprint Features
                </button>
                <button 
                  onClick={() => setActiveSection('reports')}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === 'reports' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reports
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sprint Progress</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${currentSprint.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{currentSprint.progress}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sprint Info Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentSprint.companyName}</h2>
              <p className="text-blue-100 mt-1">
                {tierInfo.label} • Day 3 of 5 • {currentSprint.client.name}, Founder
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{tierInfo.price}</div>
              <div className="text-blue-100 text-sm">Investment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tier Selector */}
        <div className="mb-6 flex justify-center">
          <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as any)}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discovery">Discovery Sprint - $5,000</SelectItem>
              <SelectItem value="feasibility">Feasibility Sprint - $15,000</SelectItem>
              <SelectItem value="validation">Validation Sprint - $35,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Your Sprint Progress</h3>
                <div className="space-y-4">
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>What we're doing:</strong> We're analyzing your market opportunity through AI simulations and competitive research. You'll receive actionable insights without the time investment.
                    </p>
                  </div>
                  {ALL_FEATURES.discovery.map(feature => (
                    <div key={feature.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(feature.status)}`}>
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(feature.status)}`}>
                          {getStatusText(feature.status)}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">What You Can Do</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <FileText className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Download Report</span>
                  </button>
                  <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <Users className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Book Strategy Call</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Key Insights
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium">Strong Market Fit</p>
                    <p className="text-xs text-blue-700 mt-1">Your idea resonates with 85% of target users</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="text-sm text-yellow-900 font-medium">Pricing Opportunity</p>
                    <p className="text-xs text-yellow-700 mt-1">We recommend testing a tiered model</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-green-900 font-medium">First-Mover Advantage</p>
                    <p className="text-xs text-green-700 mt-1">Low competition in your specific niche</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Ready for Deeper Validation?</h3>
                <p className="text-sm text-purple-100 mb-4">Get customer interviews, business modeling, and channel strategy</p>
                <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors">
                  Discuss Next Steps
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'features' && (
          <div className="space-y-8">
            {/* Available Features */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-500" />
                What's Included in Your {tierInfo.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_FEATURES.discovery.map(feature => (
                  <div key={feature.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${feature.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                        <feature.icon className={`w-6 h-6 ${feature.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className="font-semibold mb-2">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Features */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-gray-400" />
                Unlock More with Higher Tiers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...ALL_FEATURES.feasibility, ...ALL_FEATURES.validation].map(feature => {
                  const isLocked = !feature.available;
                  return (
                    <div key={feature.id} className={`bg-white rounded-xl border border-gray-200 p-6 ${isLocked ? 'opacity-60' : ''} hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${isLocked ? 'bg-gray-100' : 'bg-blue-100'}`}>
                          <feature.icon className={`w-6 h-6 ${isLocked ? 'text-gray-400' : 'text-blue-600'}`} />
                        </div>
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <h4 className={`font-semibold mb-2 ${isLocked ? 'text-gray-500' : ''}`}>
                        {feature.name}
                      </h4>
                      <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                      {isLocked && feature.tier && (
                        <div className="mt-3">
                          <Badge variant="secondary" className="text-xs">
                            Requires {feature.tier}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Reports Coming Soon</h3>
            <p className="text-gray-500">Detailed analytics and insights will be available here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
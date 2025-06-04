import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
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
  Building2,
  Eye,
  Play,
  CheckCircle2,
  Clock
} from 'lucide-react';
import MarketSimulation from '@/components/sprint/market-simulation';
import BusinessModelSimulator from '@/components/sprint/business-model-simulator';
import ChannelRecommender from '@/components/sprint/channel-recommender';
import StrategicAnalysisTools from '@/components/sprint/strategic-analysis-tools';
import AsyncInterviews from '@/components/sprint/async-interviews';
import DemandTestTracker from '@/components/sprint/demand-test-tracker';
import { cn } from '@/lib/utils';

const FEATURE_COMPONENTS = {
  market_simulation: MarketSimulation,
  business_model_simulator: BusinessModelSimulator,
  channel_recommender: ChannelRecommender,
  strategic_analysis: StrategicAnalysisTools,
  async_interviews: AsyncInterviews,
  demand_test: DemandTestTracker,
};

export default function SprintView() {
  const params = useParams();
  const sprintId = Number(params.id);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: sprint, isLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
    enabled: !!sprintId,
  });

  const { data: modules = [] } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
    enabled: !!sprintId,
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleStatusColor = (module: any) => {
    if (module.isCompleted) return 'text-green-600 bg-green-50';
    if (module.isLocked) return 'text-gray-400 bg-gray-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getModuleStatusText = (module: any) => {
    if (module.isCompleted) return 'Completed';
    if (module.isLocked) return 'Locked';
    return 'Available';
  };

  const getModuleIcon = (moduleType: string) => {
    const iconMap: Record<string, any> = {
      intake: Building2,
      market_simulation: Brain,
      assumptions: Target,
      competitive_intel: Sword,
      market_sizing: BarChart3,
      risk_assessment: Shield,
      swot_analysis: Shield,
      business_model_simulator: TrendingUp,
      channel_recommender: Target,
      strategic_analysis: Brain,
      battlecards: Sword,
      implementation_roadmap: MapPin,
      action_plans: Calendar,
      partnership_evaluation: Handshake,
      async_interviews: Users,
      demand_test: BarChart3,
      full_interviews: Users,
      multi_channel_tests: Target,
      blue_ocean_strategy: Brain,
      enhanced_market_intel: BarChart3,
      go_defer_decision: CheckCircle2,
      go_pivot_defer: CheckCircle2,
      go_pivot_kill: CheckCircle2,
    };
    return iconMap[moduleType] || FileText;
  };

  const getModuleName = (moduleType: string) => {
    const nameMap: Record<string, string> = {
      intake: 'Initial Intake',
      market_simulation: 'AI Market Simulation',
      assumptions: 'Assumption Tracker',
      competitive_intel: 'Competitive Intelligence',
      market_sizing: 'Market Sizing Analysis',
      risk_assessment: 'Risk Assessment',
      swot_analysis: 'SWOT Analysis',
      
      // Feasibility Sprint Features
      business_model_simulator: 'Business Model Simulator',
      channel_recommender: 'Channel Recommender',
      async_interviews: 'Async Interview Suite (5-7 interviews)',
      demand_test: 'Demand Test Tracker',
      
      // Validation Sprint Features
      strategic_analysis: 'Strategic Analysis Tools',
      battlecards: 'Competitive Battlecards',
      implementation_roadmap: 'Implementation Roadmap',
      action_plans: '90-Day Action Plans',
      partnership_evaluation: 'Partnership Evaluation',
      full_interviews: 'Full Interview Suite (15+ interviews)',
      multi_channel_tests: 'Multi-Channel Testing Dashboard',
      enhanced_market_intel: 'Enhanced Market Intelligence',
      blue_ocean_strategy: 'Blue Ocean Strategy Analysis',
      
      // Decision Points
      go_defer_decision: 'Go/Defer Decision Framework',
      go_pivot_defer: 'Go/Pivot/Defer Decision',
      go_pivot_kill: 'Go/Pivot/Kill Decision',
    };
    return nameMap[moduleType] || moduleType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Sprint not found</h2>
            <p className="text-gray-600">The requested sprint could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(sprint.tier);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LaunchClarity
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={cn("flex items-center gap-1", tierInfo.color)}>
                {tierInfo.icon}
                {tierInfo.label}
              </Badge>
              <Badge className={getStatusColor(sprint.status)}>
                {sprint.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Sprint Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">{sprint.companyName}</h2>
              <p className="text-blue-100 mt-2">
                {tierInfo.label} • Day 3 of 5 • Progress: {sprint.progress}%
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{tierInfo.price}</div>
              <div className="text-blue-100 text-sm">Investment</div>
            </div>
          </div>
          <Progress value={sprint.progress} className="h-3 bg-blue-800" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl shadow-sm sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Sprint Modules</CardTitle>
                <CardDescription>
                  {tierInfo.label} features and analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.map((module: any) => {
                  const Icon = getModuleIcon(module.moduleType);
                  const isActive = activeModule === module.moduleType;
                  
                  return (
                    <div
                      key={module.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                        isActive ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50",
                        module.isLocked && "opacity-60 cursor-not-allowed"
                      )}
                      onClick={() => !module.isLocked && setActiveModule(
                        activeModule === module.moduleType ? null : module.moduleType
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          getModuleStatusColor(module)
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {getModuleName(module.moduleType)}
                          </h4>
                          <p className={cn(
                            "text-xs",
                            getModuleStatusColor(module).split(' ')[0]
                          )}>
                            {getModuleStatusText(module)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {module.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                        {module.isCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {!module.isLocked && !module.isCompleted && (
                          <Play className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Active Modules</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      Sprint Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {modules.filter((m: any) => m.isCompleted).length}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {modules.filter((m: any) => !m.isCompleted && !m.isLocked).length}
                        </div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {modules.filter((m: any) => m.isLocked).length}
                        </div>
                        <div className="text-sm text-gray-600">Locked</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Company</h4>
                        <p className="text-gray-600">{sprint.companyName}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sprint Type</h4>
                        <div className="flex items-center gap-2">
                          {tierInfo.icon}
                          <span>{tierInfo.label}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Investment</h4>
                        <p className="text-gray-600">{tierInfo.price}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Status</h4>
                        <Badge className={getStatusColor(sprint.status)}>
                          {sprint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {sprint.status === 'active' && (
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Complete Intake Form</h4>
                            <p className="text-sm text-gray-600">Fill out the comprehensive business assessment</p>
                          </div>
                          <Button size="sm" asChild className="ml-auto">
                            <Link href={`/sprints/${sprint.id}/intake`}>
                              Start
                            </Link>
                          </Button>
                        </div>
                        
                        {modules.filter((m: any) => !m.isCompleted && !m.isLocked).slice(0, 2).map((module: any) => {
                          const Icon = getModuleIcon(module.moduleType);
                          return (
                            <div key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Icon className="w-5 h-5 text-gray-600" />
                              <div>
                                <h4 className="font-medium">{getModuleName(module.moduleType)}</h4>
                                <p className="text-sm text-gray-600">Ready to begin analysis</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="ml-auto"
                                onClick={() => {
                                  setActiveTab('modules');
                                  setActiveModule(module.moduleType);
                                }}
                              >
                                View
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules" className="space-y-6">
                {activeModule ? (
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          {React.createElement(getModuleIcon(activeModule), { className: "w-6 h-6 text-blue-600" })}
                          {getModuleName(activeModule)}
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveModule(null)}
                        >
                          Close Module
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {FEATURE_COMPONENTS[activeModule as keyof typeof FEATURE_COMPONENTS] && 
                        React.createElement(
                          FEATURE_COMPONENTS[activeModule as keyof typeof FEATURE_COMPONENTS],
                          { sprintId, intakeData: sprint.intakeData }
                        )
                      }
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="rounded-xl shadow-sm text-center py-12">
                    <CardContent>
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Module</h3>
                      <p className="text-gray-500">Choose a module from the sidebar to view its content</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <Card className="rounded-xl shadow-sm text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Reports Coming Soon</h3>
                    <p className="text-gray-500">Detailed analytics and downloadable reports will be available here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
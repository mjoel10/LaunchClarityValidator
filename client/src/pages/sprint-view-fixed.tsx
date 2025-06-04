import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Brain, 
  Target, 
  Sword, 
  BarChart3, 
  Shield, 
  FileText, 
  Users, 
  TrendingUp, 
  Handshake, 
  MapPin, 
  Calendar,
  Lock,
  Play,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Zap,
  Eye,
  Waves
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import DecisionEngine from '@/components/sprint/decision-engine';
import MarketSimulation from '@/components/sprint/market-simulation';
import BusinessModelSimulator from '@/components/sprint/business-model-simulator';
import ChannelRecommender from '@/components/sprint/channel-recommender';
import StrategicAnalysisTools from '@/components/sprint/strategic-analysis-tools';
import AsyncInterviews from '@/components/sprint/async-interviews';
import DemandTestTracker from '@/components/sprint/demand-test-tracker';
import FullInterviewSuite from '@/components/sprint/full-interview-suite';
import MultiChannelTesting from '@/components/sprint/multi-channel-testing';
import EnhancedMarketIntel from '@/components/sprint/enhanced-market-intel';
import BlueOceanStrategy from '@/components/sprint/blue-ocean-strategy';
import ImplementationRoadmap from '@/components/sprint/implementation-roadmap';
import ActionPlans from '@/components/sprint/action-plans';
import { cn } from '@/lib/utils';

const FEATURE_COMPONENTS = {
  market_simulation: MarketSimulation,
  business_model_simulator: BusinessModelSimulator,
  channel_recommender: ChannelRecommender,
  strategic_analysis: StrategicAnalysisTools,
  async_interviews: AsyncInterviews,
  demand_test: DemandTestTracker,
  full_interviews: FullInterviewSuite,
  multi_channel_tests: MultiChannelTesting,
  enhanced_market_intel: EnhancedMarketIntel,
  blue_ocean_strategy: BlueOceanStrategy,
  implementation_roadmap: ImplementationRoadmap,
  action_plans: ActionPlans,
};

export default function SprintView() {
  const params = useParams();
  const sprintId = Number(params.id);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    discovery: true,
    feasibility: false,
    validation: false
  });

  const toggleSection = (section: 'discovery' | 'feasibility' | 'validation') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const { data: sprint, isLoading, error } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
  });

  const { data: intakeData } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/intake`],
  });

  // Regenerate modules with correct tier access
  const regenerateModulesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/regenerate-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to regenerate modules');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
    }
  });

  useEffect(() => {
    if (sprint && sprint.status === 'active' && !modulesLoading) {
      regenerateModulesMutation.mutate();
    }
  }, [sprint?.status]);

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
      blue_ocean_strategy: Waves,
      enhanced_market_intel: Eye,
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

  const getModulesByTier = () => {
    if (!modules) return { discovery: [], feasibility: [], validation: [] };
    
    const discoveryModules = ['intake', 'market_simulation', 'assumptions', 'competitive_intel', 'market_sizing', 'risk_assessment', 'swot_analysis', 'go_defer_decision'];
    const feasibilityModules = ['business_model_simulator', 'channel_recommender', 'async_interviews', 'demand_test', 'go_pivot_defer'];
    const validationModules = ['full_interviews', 'multi_channel_tests', 'enhanced_market_intel', 'strategic_analysis', 'blue_ocean_strategy', 'implementation_roadmap', 'action_plans', 'battlecards', 'partnership_evaluation', 'go_pivot_kill'];

    return {
      discovery: modules.filter((m: any) => discoveryModules.includes(m.moduleType)),
      feasibility: modules.filter((m: any) => feasibilityModules.includes(m.moduleType)),
      validation: modules.filter((m: any) => validationModules.includes(m.moduleType))
    };
  };

  const renderModuleGroup = (
    title: string, 
    modules: any[], 
    sectionKey: 'discovery' | 'feasibility' | 'validation',
    isUnlocked: boolean
  ) => {
    const isExpanded = expandedSections[sectionKey];
    const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
    
    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ChevronIcon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              {title} ({modules.length})
            </h3>
          </div>
        </button>
        
        {isExpanded && (
          <div className="ml-6 space-y-2 mt-2">
            {modules.map((module: any) => {
              const Icon = getModuleIcon(module.moduleType);
              const isAvailable = !module.isLocked;
              
              return (
                <button
                  key={module.id}
                  onClick={() => isAvailable && setSelectedModule(module.moduleType)}
                  title={!isAvailable ? `Available in ${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Sprint` : ''}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors",
                    isAvailable 
                      ? "bg-white hover:bg-blue-50 border-gray-200 cursor-pointer" 
                      : "bg-gray-50 border-gray-100 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      module.isCompleted 
                        ? "bg-green-100 text-green-600"
                        : isAvailable
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {module.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={cn(
                        "font-medium text-sm",
                        !isAvailable && "text-gray-500"
                      )}>
                        {getModuleName(module.moduleType)}
                      </div>
                      {module.isCompleted && (
                        <div className="text-xs text-green-600">Completed</div>
                      )}
                      {!module.isCompleted && isAvailable && (
                        <div className="text-xs text-blue-600">Available</div>
                      )}
                    </div>
                  </div>
                  {!isAvailable && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSelectedModule = () => {
    if (!selectedModule || !FEATURE_COMPONENTS[selectedModule as keyof typeof FEATURE_COMPONENTS]) {
      return (
        <div className="text-center py-12 text-gray-500">
          Select a module from the sidebar to view its content
        </div>
      );
    }

    const Component = FEATURE_COMPONENTS[selectedModule as keyof typeof FEATURE_COMPONENTS];
    return <Component sprintId={sprintId} intakeData={intakeData} />;
  };

  if (isLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !sprint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error loading sprint</div>
        </div>
      </div>
    );
  }

  const modulesByTier = getModulesByTier();
  const isDiscoveryUnlocked = true; // Always unlocked for paid sprints
  const isFeasibilityUnlocked = sprint.tier === 'feasibility' || sprint.tier === 'validation';
  const isValidationUnlocked = sprint.tier === 'validation';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl font-bold">
                LaunchClarity
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{intakeData?.companyName || 'Company Name'}</h1>
              <p className="text-blue-100">
                {sprint?.tier?.charAt(0).toUpperCase() + sprint?.tier?.slice(1)} Sprint • 
                ${sprint?.tier === 'discovery' ? '5,000' : sprint?.tier === 'feasibility' ? '15,000' : '35,000'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(((modules?.filter((m: any) => m.isCompleted).length || 0) / (modules?.length || 1)) * 100)}%
              </div>
              <div className="text-blue-100">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - All Features by Tier */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl shadow-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Validation Features</CardTitle>
                <CardDescription>
                  {modules?.length || 0} total modules • {modules?.filter((m: any) => m.isCompleted).length || 0} completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {renderModuleGroup(
                  "Discovery Sprint",
                  modulesByTier.discovery,
                  "discovery",
                  isDiscoveryUnlocked
                )}
                
                {renderModuleGroup(
                  "Feasibility Sprint",
                  modulesByTier.feasibility,
                  "feasibility",
                  isFeasibilityUnlocked
                )}
                
                {renderModuleGroup(
                  "Validation Sprint",
                  modulesByTier.validation,
                  "validation",
                  isValidationUnlocked
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Active Modules</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Decision Engine - Replaces Investment Display */}
                <DecisionEngine 
                  sprintId={sprintId}
                  tier={sprint.tier}
                  modules={modules || []}
                  intakeData={intakeData}
                />

                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Sprint Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {modulesByTier.discovery?.filter((m: any) => m.isCompleted).length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Discovery Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {modulesByTier.feasibility?.filter((m: any) => m.isCompleted).length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Feasibility Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {modulesByTier.validation?.filter((m: any) => m.isCompleted).length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Validation Completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="space-y-6">
                {selectedModule ? (
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{getModuleName(selectedModule)}</CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedModule(null)}
                        >
                          Back to Overview
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderSelectedModule()}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                      <CardTitle>Select a Module</CardTitle>
                      <CardDescription>
                        Choose a module from the sidebar to begin or continue your analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        Select any unlocked module from the sidebar to get started
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Sprint Reports</CardTitle>
                    <CardDescription>
                      Comprehensive analysis and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      Reports will be available as you complete more modules
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
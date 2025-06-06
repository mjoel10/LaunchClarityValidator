import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Waves,
  Save
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import DecisionEngine from '@/components/sprint/decision-engine';
import InitialIntake from '@/components/sprint/initial-intake';
import MarketSimulation from '@/components/sprint/market-simulation';
import BusinessModelSimulator from '@/components/sprint/business-model-simulator';
import ChannelRecommender from '@/components/sprint/channel-recommender';
import StrategicAnalysisTools from '@/components/sprint/strategic-analysis-tools';
import AsyncInterviews from '@/components/sprint/async-interviews';
import AssumptionsTracker from '@/components/sprint/assumptions-tracker';
import AIAssumptionTracker from '@/components/sprint/ai-assumption-tracker';
import DemandTestTracker from '@/components/sprint/demand-test-tracker';
import FullInterviewSuite from '@/components/sprint/full-interview-suite';
import MultiChannelTesting from '@/components/sprint/multi-channel-testing';
import EnhancedMarketIntel from '@/components/sprint/enhanced-market-intel';
import BlueOceanStrategy from '@/components/sprint/blue-ocean-strategy';
import ImplementationRoadmap from '@/components/sprint/implementation-roadmap';
import ActionPlans from '@/components/sprint/action-plans';
import { cn } from '@/lib/utils';

const FEATURE_COMPONENTS = {
  intake: InitialIntake,
  market_simulation: MarketSimulation,
  assumptions: AssumptionsTracker,
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
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    discovery: true,
    feasibility: false,
    validation: false
  });
  const [isDecisionEngineOpen, setIsDecisionEngineOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

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

  // Save sprint progress
  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to save sprint');
      return response.json();
    },
    onSuccess: (data) => {
      setLastSaved(new Date(data.savedAt));
    }
  });

  useEffect(() => {
    if (sprint && sprint.status === 'active' && !modulesLoading) {
      regenerateModulesMutation.mutate();
    }
  }, [sprint?.status]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const interval = setInterval(() => {
      if (sprint) {
        saveMutation.mutate();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [sprint, autoSaveEnabled]);

  const handleManualSave = () => {
    saveMutation.mutate();
  };

  const formatSaveTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      async_interviews: 'Async Interview Suite',
      demand_test: 'Demand Test Tracker',
      
      // Validation Sprint Features
      strategic_analysis: 'Strategic Analysis Tools',
      battlecards: 'Competitive Battlecards',
      implementation_roadmap: 'Implementation Roadmap',
      action_plans: '90-Day Action Plans',
      partnership_evaluation: 'Partnership Evaluation',
      full_interviews: 'Full Interview Suite',
      multi_channel_tests: 'Multi-Channel Testing',
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
    
    const discoveryModules = ['intake', 'market_simulation', 'assumptions', 'competitive_intel', 'market_sizing', 'risk_assessment', 'swot_analysis'];
    const feasibilityModules = ['business_model_simulator', 'channel_recommender', 'async_interviews', 'demand_test'];
    const validationModules = ['full_interviews', 'multi_channel_tests', 'enhanced_market_intel', 'implementation_roadmap', 'battlecards'];

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

                    </div>
                  </div>
                  {!isAvailable && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
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

  // Get correct module counts based on tier
  const getTierModuleCounts = () => {
    switch (sprint?.tier) {
      case 'discovery': return 7;
      case 'feasibility': return 11;
      case 'validation': return 16;
      default: return 7;
    }
  };

  // Get decision preview for header
  const getDecisionPreview = () => {
    const completedModules = modules?.filter(m => m.isCompleted) || [];
    const totalModules = getTierModuleCounts();
    const completionRate = (completedModules.length / totalModules) * 100;
    
    if (completionRate < 30) {
      return { text: 'Insufficient Data', confidence: Math.round(completionRate), color: 'text-gray-300' };
    }
    
    if (completionRate >= 70) {
      return { text: 'Ready for Decision', confidence: 85, color: 'text-green-300' };
    } else if (completionRate >= 50) {
      return { text: 'Gathering Data', confidence: 65, color: 'text-yellow-300' };
    }
    
    return { text: 'Early Analysis', confidence: Math.round(completionRate + 20), color: 'text-blue-300' };
  };

  const decisionPreview = getDecisionPreview();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-none mx-6 px-4 py-4">
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
            
            <div className="flex items-center gap-4">
              {lastSaved && (
                <div className="text-sm text-gray-500">
                  Last saved: {formatSaveTime(lastSaved)}
                </div>
              )}
              <Button 
                onClick={handleManualSave}
                disabled={saveMutation.isPending}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? 'Saving...' : 'Save Progress'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-none mx-6 px-4 py-8">
          <div className="flex items-center justify-between">
            {/* Left Section - Company & Sprint Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-1 tracking-tight">{sprint?.companyName || 'Company Name'}</h1>
              <p className="text-lg text-blue-100 font-medium">
                {sprint?.tier?.charAt(0).toUpperCase() + sprint?.tier?.slice(1)} Sprint • 
                ${sprint?.tier === 'discovery' ? '5,000' : sprint?.tier === 'feasibility' ? '15,000' : '35,000'}
              </p>
            </div>
            
            {/* Center Section - Decision Engine (Star Feature) */}
            <div className="flex-1 flex justify-center">
              <Link href={`/sprints/${sprintId}/decision-engine`}>
                <div className={`relative group bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 cursor-pointer border border-white/20 
                  hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105`}>
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl shadow-lg ${
                      decisionPreview.confidence >= 70 
                        ? 'bg-emerald-500/30 shadow-emerald-500/20' 
                        : decisionPreview.confidence >= 50 
                        ? 'bg-amber-500/30 shadow-amber-500/20'
                        : 'bg-slate-500/30 shadow-slate-500/20'
                    }`}>
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-white mb-1">Decision Engine</div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${
                          decisionPreview.confidence >= 70 
                            ? 'text-emerald-200' 
                            : decisionPreview.confidence >= 50 
                            ? 'text-amber-200'
                            : 'text-slate-200'
                        }`}>
                          {decisionPreview.text}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            decisionPreview.confidence >= 70 
                              ? 'bg-emerald-400' 
                              : decisionPreview.confidence >= 50 
                              ? 'bg-amber-400'
                              : 'bg-slate-400'
                          }`}></div>
                          <span className="text-xs text-white/80 font-medium">{decisionPreview.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-3 group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-6 h-6 text-white/60" />
                    </div>
                  </div>
                  
                  {/* Subtle glow effect for high confidence */}
                  {decisionPreview.confidence >= 70 && (
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-pulse"></div>
                  )}
                </div>
              </Link>
            </div>
            
            {/* Right Section - Sprint Progress */}
            <div className="flex-1 flex justify-end">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  {/* Circular Progress Ring */}
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/20"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${
                        ((modules?.filter((m: any) => m.isCompleted).length || 0) / getTierModuleCounts()) * 100 >= 70 
                          ? 'text-emerald-400' 
                          : ((modules?.filter((m: any) => m.isCompleted).length || 0) / getTierModuleCounts()) * 100 >= 50 
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="transparent"
                      strokeDasharray={`${((modules?.filter((m: any) => m.isCompleted).length || 0) / getTierModuleCounts()) * 100}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {Math.round(((modules?.filter((m: any) => m.isCompleted).length || 0) / getTierModuleCounts()) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-blue-100 font-medium mt-2">Sprint Complete</div>
                <div className="text-xs text-blue-200 mt-1">
                  {modules?.filter((m: any) => m.isCompleted).length || 0} of {getTierModuleCounts()} modules
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-none mx-6 pl-2 pr-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - All Features by Tier */}
          <div className="lg:col-span-3">
            <Card className="rounded-xl shadow-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Validation Features</CardTitle>
                <CardDescription>
                  16 total modules • {modules?.filter((m: any) => m.isCompleted).length || 0} completed
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
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {selectedModule ? (
                <Card className="rounded-xl shadow-sm">
                  <CardHeader className="px-8 pt-8">
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
                  <CardContent className="px-8 pb-8">
                    {renderSelectedModule()}
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-xl shadow-sm h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <Target className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                    <CardTitle className="mb-4 text-xl">Select a Module</CardTitle>
                    <CardDescription className="text-base mb-6 max-w-md">
                      Choose a module from the sidebar to begin or continue your analysis
                    </CardDescription>
                    <div className="text-sm text-gray-500">
                      Select any unlocked module from the sidebar to get started
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
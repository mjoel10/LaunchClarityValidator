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
  assumptions: StrategicAnalysisTools,
  competitive_intel: StrategicAnalysisTools,
  market_sizing: StrategicAnalysisTools,
  risk_assessment: StrategicAnalysisTools,
  swot_analysis: StrategicAnalysisTools,
  battlecards: StrategicAnalysisTools,
};

export default function DecisionEnginePage() {
  const { id: sprintId } = useParams();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    discovery: true,
    feasibility: false,
    validation: false
  });

  const { data: sprint, isLoading: sprintLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
    enabled: !!sprintId,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
    enabled: !!sprintId,
  });

  const { data: intakeData, isLoading: intakeLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/intake`],
    enabled: !!sprintId,
  });

  const regenerateModulesMutation = useMutation({
    mutationFn: () => fetch(`/api/sprints/${sprintId}/regenerate-modules`, { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
    }
  });

  useEffect(() => {
    if (modules && modules.length === 0 && !modulesLoading) {
      regenerateModulesMutation.mutate();
    }
  }, [modules, modulesLoading]);

  if (sprintLoading || modulesLoading || intakeLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  const getModuleIcon = (moduleType: string) => {
    const iconMap = {
      intake: Building2,
      market_simulation: Brain,
      assumptions: Target,
      competitive_intel: Sword,
      market_sizing: BarChart3,
      risk_assessment: Shield,
      swot_analysis: FileText,
      business_model_simulator: Building2,
      channel_recommender: TrendingUp,
      async_interviews: Users,
      demand_test: BarChart3,
      full_interviews: Users,
      multi_channel_tests: Zap,
      enhanced_market_intel: Eye,
      blue_ocean_strategy: Waves,
      implementation_roadmap: MapPin,
      action_plans: Calendar,
      battlecards: Sword,
    };
    return iconMap[moduleType] || FileText;
  };

  const getModuleName = (moduleType: string) => {
    const nameMap = {
      intake: 'Initial Intake',
      market_simulation: 'AI Market Simulation',
      assumptions: 'Assumption Tracker',
      competitive_intel: 'Competitive Intelligence',
      market_sizing: 'Market Sizing Analysis',
      risk_assessment: 'Risk Assessment',
      swot_analysis: 'SWOT Analysis',
      business_model_simulator: 'Business Model Simulator',
      channel_recommender: 'Channel Recommender',
      async_interviews: 'Async Interviews',
      demand_test: 'Demand Test Tracker',
      full_interviews: 'Full Interview Suite',
      multi_channel_tests: 'Multi-Channel Testing',
      enhanced_market_intel: 'Enhanced Market Intel',
      blue_ocean_strategy: 'Blue Ocean Strategy',
      implementation_roadmap: 'Implementation Roadmap',
      action_plans: 'Action Plans',
      battlecards: 'Battle Cards',
    };
    return nameMap[moduleType] || moduleType;
  };

  const toggleSection = (section: 'discovery' | 'feasibility' | 'validation') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getModulesByTier = () => {
    if (!modules || modules.length === 0) return { discovery: [], feasibility: [], validation: [] };
    
    const discoveryModules = ['intake', 'market_simulation', 'assumptions', 'competitive_intel', 'market_sizing', 'risk_assessment', 'swot_analysis'];
    const feasibilityModules = ['business_model_simulator', 'channel_recommender', 'async_interviews', 'demand_test'];
    const validationModules = ['full_interviews', 'multi_channel_tests', 'enhanced_market_intel', 'blue_ocean_strategy', 'implementation_roadmap'];

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

  const getTierModuleCounts = () => {
    if (sprint?.tier === 'discovery') return 7;
    if (sprint?.tier === 'feasibility') return 11;
    if (sprint?.tier === 'validation') return 16;
    return 7;
  };

  const modulesByTier = getModulesByTier();
  const isDiscoveryUnlocked = true;
  const isFeasibilityUnlocked = sprint?.tier === 'feasibility' || sprint?.tier === 'validation';
  const isValidationUnlocked = sprint?.tier === 'validation';

  const getDecisionPreview = () => {
    const completionRate = ((modules?.filter((m: any) => m.isCompleted).length || 0) / getTierModuleCounts()) * 100;
    
    if (completionRate >= 80) {
      return { text: 'High Confidence', confidence: Math.round(completionRate) };
    } else if (completionRate >= 50) {
      return { text: 'Moderate Data', confidence: Math.round(completionRate) };
    } else {
      return { text: 'Insufficient Data', confidence: Math.round(completionRate) };
    }
  };

  const decisionPreview = getDecisionPreview();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-none mx-6 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/sprints/${sprintId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sprint View
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-none mx-6 px-4 py-8">
          <div className="flex items-center justify-between">
            {/* Left Section - Company & Sprint Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-1 tracking-tight">{intakeData?.companyName || 'Company Name'}</h1>
              <p className="text-lg text-blue-100 font-medium">
                {sprint?.tier?.charAt(0).toUpperCase() + sprint?.tier?.slice(1)} Sprint • 
                ${sprint?.tier === 'discovery' ? '5,000' : sprint?.tier === 'feasibility' ? '15,000' : '35,000'}
              </p>
            </div>
            
            {/* Center Section - Decision Engine (Active State) */}
            <div className="flex-1 flex justify-center">
              <div className={`relative bg-white/15 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/30 shadow-xl`}>
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
                  <div className="ml-3">
                    <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                  </div>
                </div>
                
                {/* Active state glow */}
                <div className="absolute inset-0 rounded-2xl bg-white/5 animate-pulse"></div>
              </div>
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
                      className="text-white"
                      stroke="currentColor"
                      strokeWidth="3"
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

          {/* Main Content - Decision Engine Analysis */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              <DecisionEngine 
                sprintId={sprintId}
                tier={sprint?.tier || ''}
                modules={modules || []}
                intakeData={intakeData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
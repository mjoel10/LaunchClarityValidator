import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, BarChart3, ChevronRight, ChevronDown, Lock } from 'lucide-react';
import DecisionEngine from '@/components/sprint/decision-engine';

export default function DecisionEnginePage() {
  const params = useParams();
  const sprintId = Number(params.id);
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

  const { data: sprint, isLoading: sprintLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
    enabled: !!sprintId,
  });

  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
    enabled: !!sprintId,
  });

  const { data: intakeData, isLoading: intakeLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/intake`],
    enabled: !!sprintId,
  });

  if (sprintLoading || modulesLoading || intakeLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Debug logging
  console.log('Decision Engine Data:', { sprint, modules, intakeData });

  const getDecisionPreview = () => {
    const moduleArray = Array.isArray(modules) ? modules : [];
    const completionRate = ((moduleArray.filter((m: any) => m.isCompleted).length) / (moduleArray.length || 1)) * 100;
    
    if (completionRate >= 70) {
      return { text: 'Ready for Analysis', confidence: Math.round(completionRate), color: 'text-emerald-300' };
    } else if (completionRate >= 50) {
      return { text: 'Partial Analysis', confidence: Math.round(completionRate), color: 'text-amber-300' };
    }
    
    return { text: 'Early Analysis', confidence: Math.round(completionRate + 20), color: 'text-blue-300' };
  };

  const decisionPreview = getDecisionPreview();

  // Module organization functions (copied from sprint-view-fixed.tsx)
  const getModulesByTier = () => {
    const moduleArray = Array.isArray(modules) ? modules : [];
    if (moduleArray.length === 0) return { discovery: [], feasibility: [], validation: [] };
    
    const discoveryModules = ['intake', 'market_simulation', 'assumptions', 'competitive_intel', 'market_sizing', 'risk_assessment', 'swot_analysis'];
    const feasibilityModules = ['business_model_simulator', 'channel_recommender', 'async_interviews', 'demand_test'];
    const validationModules = ['full_interviews', 'multi_channel_tests', 'enhanced_market_intel', 'implementation_roadmap', 'battlecards'];

    return {
      discovery: moduleArray.filter((m: any) => discoveryModules.includes(m.moduleType)),
      feasibility: moduleArray.filter((m: any) => feasibilityModules.includes(m.moduleType)),
      validation: moduleArray.filter((m: any) => validationModules.includes(m.moduleType))
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
              const isAvailable = !module.isLocked;
              const isCompleted = module.isCompleted;
              
              return (
                <Link key={module.id} href={`/sprints/${sprintId}`}>
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isAvailable 
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' 
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isCompleted ? 'bg-green-500' : isAvailable ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isAvailable ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {module.moduleType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Badge variant="outline" className="text-xs">Complete</Badge>}
                      {!isAvailable && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const modulesByTier = getModulesByTier();
  const isDiscoveryUnlocked = true;
  const isFeasibilityUnlocked = sprint?.tier === 'feasibility' || sprint?.tier === 'validation';
  const isValidationUnlocked = sprint?.tier === 'validation';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sprint Banner - Identical to main sprint view */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-none mx-6 px-4 py-8">
          <div className="flex items-center justify-between">
            {/* Left Section - Company & Sprint Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-1 tracking-tight">{intakeData?.companyName || sprint?.companyName || 'Company Name'}</h1>
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
                      ? 'bg-emerald-500/40 shadow-emerald-500/30' 
                      : decisionPreview.confidence >= 50 
                      ? 'bg-amber-500/40 shadow-amber-500/30'
                      : 'bg-slate-500/40 shadow-slate-500/30'
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
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
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
                      strokeDasharray={`${Array.isArray(modules) ? ((modules.filter((m: any) => m.isCompleted).length) / (modules.length || 1)) * 100 : 0}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {Array.isArray(modules) ? Math.round(((modules.filter((m: any) => m.isCompleted).length) / (modules.length || 1)) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-blue-100 font-medium mt-2">Sprint Complete</div>
                <div className="text-xs text-blue-200 mt-1">
                  {Array.isArray(modules) ? modules.filter((m: any) => m.isCompleted).length : 0} of {Array.isArray(modules) ? modules.length : 0} modules
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-none mx-6 pl-2 pr-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - Identical to main sprint view */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Validation Features</h2>
                <p className="text-sm text-gray-600">
                  {Array.isArray(modules) ? modules.length : 0} total modules
                </p>
              </div>
              
              <div className="p-6 space-y-1">
                {renderModuleGroup("Discovery Sprint", modulesByTier.discovery, "discovery", isDiscoveryUnlocked)}
                {renderModuleGroup("Feasibility Sprint", modulesByTier.feasibility, "feasibility", isFeasibilityUnlocked)}
                {renderModuleGroup("Validation Sprint", modulesByTier.validation, "validation", isValidationUnlocked)}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="space-y-8">
              {/* Strategic Decision Analysis Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Strategic Decision Analysis</h2>
                <p className="text-xl text-gray-600 mb-2">
                  Go/Pivot/Kill recommendation engine
                </p>
                <p className="text-gray-500">
                  Based on {modules?.filter((m: any) => m.isCompleted).length || 0} of {modules?.length || 0} completed validation modules
                </p>
              </div>

              {/* Decision Engine Component */}
              <DecisionEngine 
                sprintId={sprintId}
                tier={sprint?.tier || ''}
                modules={modules || []}
                intakeData={intakeData}
              />

              {/* Back to Sprint Button */}
              <div className="flex justify-center pt-8">
                <Link href={`/sprints/${sprintId}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sprint View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
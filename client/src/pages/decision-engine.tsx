import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, BarChart3, ChevronRight } from 'lucide-react';
import DecisionEngine from '@/components/sprint/decision-engine';
import Sidebar from '@/components/navigation/sidebar';

export default function DecisionEnginePage() {
  const params = useParams();
  const sprintId = Number(params.id);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const { data: sprint, isLoading: sprintLoading } = useQuery({
    queryKey: ['/api/sprints', sprintId],
    enabled: !!sprintId,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'modules'],
    enabled: !!sprintId,
  });

  const { data: intakeData } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'intake'],
    enabled: !!sprintId,
  });

  if (sprintLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Sprint not found</div>
        </div>
      </div>
    );
  }

  // Get decision preview for header
  const getDecisionPreview = () => {
    const completedModules = modules?.filter((m: any) => m.isCompleted) || [];
    const totalModules = modules?.length || 1;
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
              <Link href={`/sprints/${sprintId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sprint
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Go/Pivot/Kill Decision Engine</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {intakeData?.companyName || 'Company Name'} • {sprint.tier?.charAt(0).toUpperCase() + sprint.tier?.slice(1)} Sprint
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-none mx-6 px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{intakeData?.companyName || 'Company Name'}</h1>
              <p className="text-blue-100">
                {sprint?.tier?.charAt(0).toUpperCase() + sprint?.tier?.slice(1)} Sprint • 
                ${sprint?.tier === 'discovery' ? '5,000' : sprint?.tier === 'feasibility' ? '15,000' : '35,000'}
              </p>
            </div>
            
            {/* Decision Engine Header Element - Active State */}
            <div className="flex items-center gap-6">
              <div className={`relative rounded-xl px-6 py-4 border-2 ${
                decisionPreview.confidence >= 70 
                  ? 'bg-emerald-500/30 border-emerald-400/60' 
                  : decisionPreview.confidence >= 50 
                  ? 'bg-amber-500/30 border-amber-400/60'
                  : 'bg-slate-500/30 border-slate-400/60'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    decisionPreview.confidence >= 70 
                      ? 'bg-emerald-400/30' 
                      : decisionPreview.confidence >= 50 
                      ? 'bg-amber-400/30'
                      : 'bg-slate-400/30'
                  }`}>
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-semibold text-white mb-1">Decision Engine</div>
                    <div className="text-sm text-white/90 font-medium">
                      {decisionPreview.text}
                    </div>
                    <div className="text-xs text-white/70">
                      {decisionPreview.confidence}% Analysis Complete
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                  </div>
                </div>
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
      </div>

      <div className="max-w-none mx-6 pl-2 pr-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <Sidebar sprint={sprint} modules={modules || []} />
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="space-y-8">
              {/* Strategic Decision Analysis Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Strategic Decision Analysis</h2>
                <p className="text-xl text-gray-600 mb-2">
                  AI-powered Go/Pivot/Kill recommendation engine
                </p>
                <p className="text-gray-500">
                  Based on {modules?.filter((m: any) => m.isCompleted).length || 0} of {modules?.length || 0} completed validation modules
                </p>
              </div>

              {/* Decision Engine Component */}
              <DecisionEngine 
                sprintId={sprintId}
                tier={sprint.tier}
                modules={modules || []}
                intakeData={intakeData}
              />
              
              {/* Decision Framework Context */}
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Decision Framework Context
                  </CardTitle>
                  <CardDescription>
                    Understanding the strategic decision process for {sprint.tier} tier validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">GO</div>
                      <div className="text-sm text-gray-600">
                        Strong validation signals across multiple dimensions. Ready to proceed to next phase or market.
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">PIVOT</div>
                      <div className="text-sm text-gray-600">
                        Mixed signals suggest strategic adjustments needed before proceeding further.
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-2">KILL</div>
                      <div className="text-sm text-gray-600">
                        Insufficient validation or negative signals indicate project termination.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
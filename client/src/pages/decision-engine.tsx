import React from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import DecisionEngine from '@/components/sprint/decision-engine';

export default function DecisionEnginePage() {
  const params = useParams();
  const sprintId = Number(params.id);

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
        <div className="max-w-none mx-6 px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Strategic Decision Analysis</h1>
            <p className="text-xl text-blue-100 mb-2">
              AI-powered Go/Pivot/Kill recommendation engine
            </p>
            <p className="text-blue-200">
              Based on {modules?.filter((m: any) => m.isCompleted).length || 0} of {modules?.length || 0} completed validation modules
            </p>
          </div>
        </div>
      </div>

      {/* Decision Engine Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <DecisionEngine 
          sprintId={sprintId}
          tier={sprint.tier}
          modules={modules || []}
          intakeData={intakeData}
        />
        
        {/* Additional Context Section */}
        <Card className="mt-8 rounded-xl shadow-sm">
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
  );
}
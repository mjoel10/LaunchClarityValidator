import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, FileText } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface RiskAssessmentProps {
  sprintId: number;
  intakeData?: any;
}

export default function RiskAssessment({ sprintId, intakeData }: RiskAssessmentProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: module } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`, 'risk_assessment'],
    select: (data: any[]) => data?.find(m => m.moduleType === 'risk_assessment'),
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/modules/risk_assessment/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to generate risk assessment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
      setIsGenerating(false);
    },
    onError: (error) => {
      console.error('Error generating risk assessment:', error);
      setIsGenerating(false);
    }
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    generateMutation.mutate();
  };

  if (!module?.aiAnalysis && !isGenerating) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Risk Assessment Analysis</CardTitle>
          <p className="text-muted-foreground">
            Generate comprehensive 2,000-2,500 word risk assessment report across 6 risk categories with detailed mitigation strategies.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleGenerate} className="bg-red-600 hover:bg-red-700">
            Generate Risk Assessment Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating || generateMutation.isPending) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generating Comprehensive Risk Assessment Report</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Analyzing 6 risk categories with probability assessments, impact quantification, and strategic mitigation plans...
          </p>
        </CardContent>
      </Card>
    );
  }

  const analysis = module?.aiAnalysis;
  if (!analysis?.report) return null;

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Risk Assessment Analysis Report
            {analysis.companyName && (
              <span className="text-sm font-normal text-muted-foreground">
                for {analysis.companyName}
                {analysis.partnerName && ` - ${analysis.partnerName} Partnership`}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div 
              className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border"
              style={{ fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
            >
              {analysis.report}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, FileText } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface CompetitiveIntelligenceProps {
  sprintId: number;
  intakeData?: any;
}

export default function CompetitiveIntelligence({ sprintId, intakeData }: CompetitiveIntelligenceProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: module } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`, 'competitive_intelligence'],
    select: (data: any[]) => data?.find(m => m.moduleType === 'competitive_intelligence'),
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/modules/competitive_intelligence/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to generate competitive intelligence');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
      setIsGenerating(false);
    },
    onError: (error) => {
      console.error('Error generating competitive intelligence:', error);
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
          <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-xl">Competitive Intelligence Analysis</CardTitle>
          <p className="text-muted-foreground">
            Generate comprehensive 2,000-2,500 word competitive analysis report to understand your market position and identify strategic opportunities.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleGenerate} className="bg-purple-600 hover:bg-purple-700">
            Generate Competitive Intelligence Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating || generateMutation.isPending) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generating Comprehensive Competitive Intelligence Report</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Analyzing 5-7 key competitors with detailed profiles, pricing strategies, market positioning, and strategic recommendations...
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
            <FileText className="w-5 h-5 text-purple-600" />
            Competitive Intelligence Analysis Report
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
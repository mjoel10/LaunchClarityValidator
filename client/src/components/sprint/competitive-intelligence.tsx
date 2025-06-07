import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, FileText, Copy, CheckCircle } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CompetitiveIntelligenceProps {
  sprintId: number;
  intakeData?: any;
}

export default function CompetitiveIntelligence({ sprintId, intakeData }: CompetitiveIntelligenceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Load existing saved report
  const { data: modules } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
  });

  // Load saved report when component mounts
  useEffect(() => {
    if (modules) {
      const competitiveModule = modules.find((m: any) => m.moduleType === 'competitive_intelligence');
      if (competitiveModule?.aiAnalysis?.report) {
        setReport(competitiveModule.aiAnalysis.report);
      }
    }
  }, [modules]);

  const generateReport = async () => {
    if (!intakeData?.companyName) {
      toast({
        title: "Missing Information",
        description: "Please complete the Initial Intake first to generate competitive intelligence.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/sprints/${sprintId}/modules/competitive_intelligence/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate competitive intelligence');
      }

      const data = await response.json();
      setReport(data.report);
      
      // Invalidate queries to refresh the module data
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
      
      toast({
        title: "Competitive Intelligence Generated",
        description: "Comprehensive competitive analysis report generated successfully.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed", 
        description: "Unable to generate competitive intelligence report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Competitive intelligence report copied. Paste into Google Docs for client delivery.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Competitive Intelligence Analysis
            </div>
            <div className="flex gap-2">
              {report && (
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Report
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  report ? 'Regenerate Report' : 'Generate Report'
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!report && !isGenerating && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg mb-2">Ready to Generate Competitive Intelligence Analysis</p>
              <p className="text-sm">
                Click "Generate Report" to create a comprehensive 2,000-2,500 word competitive analysis 
                with detailed competitor profiles, pricing strategies, and market positioning insights.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-lg font-medium">Generating Competitive Intelligence Analysis...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing 5-7 key competitors with detailed profiles, pricing strategies, and market positioning...
              </p>
            </div>
          )}

          {report && !isGenerating && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border"
                style={{ fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
              >
                {report}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
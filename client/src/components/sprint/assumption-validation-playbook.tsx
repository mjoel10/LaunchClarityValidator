import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Target, Copy, CheckCircle } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AssumptionValidationPlaybookProps {
  sprintId: number;
  intakeData?: any;
}

export default function AssumptionValidationPlaybook({ sprintId, intakeData }: AssumptionValidationPlaybookProps) {
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
      const assumptionModule = modules.find((m: any) => m.moduleType === 'assumption_tracker');
      if (assumptionModule?.aiAnalysis?.playbook) {
        setReport(assumptionModule.aiAnalysis.playbook);
      }
    }
  }, [modules]);

  const generateReport = async () => {
    if (!intakeData?.companyName) {
      toast({
        title: "Missing Information",
        description: "Please complete the Initial Intake first to generate assumption validation playbook.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/sprints/${sprintId}/generate-assumption-playbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate assumption validation playbook');
      }

      const data = await response.json();
      setReport(data.playbook);
      
      // Invalidate queries to refresh the module data
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
      
      toast({
        title: "Assumption Validation Playbook Generated",
        description: "Comprehensive assumption validation playbook generated successfully.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed", 
        description: "Unable to generate assumption validation playbook. Please try again.",
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
        description: "Assumption validation playbook copied. Paste into Google Docs for client delivery.",
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
              <Target className="w-5 h-5 text-orange-600" />
              Assumption Validation Playbook
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
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
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
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-lg mb-2">Ready to Generate Assumption Validation Playbook</p>
              <p className="text-sm">
                Click "Generate Report" to create a comprehensive validation playbook 
                with specific testing methods and success criteria for each critical assumption.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-lg font-medium">Generating Assumption Validation Playbook...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Creating detailed validation strategies for critical business assumptions...
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
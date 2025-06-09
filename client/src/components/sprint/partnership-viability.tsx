import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Handshake, Copy, CheckCircle, Loader2 } from 'lucide-react';

interface PartnershipViabilityProps {
  sprintId: number;
  intakeData?: any;
}

export default function PartnershipViability({ sprintId, intakeData }: PartnershipViabilityProps) {
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
      const partnershipModule = modules.find((m: any) => m.moduleType === 'partnership_viability');
      if (partnershipModule?.aiAnalysis?.report) {
        setReport(partnershipModule.aiAnalysis.report);
      }
    }
  }, [modules]);

  // Check if this is a partnership evaluation
  const isPartnershipEvaluation = intakeData?.isPartnershipEvaluation;

  const generateReport = async () => {
    if (!intakeData?.companyName) {
      toast({
        title: "Missing Information",
        description: "Please complete the Initial Intake first to generate partnership viability analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!isPartnershipEvaluation) {
      toast({
        title: "Partnership Mode Required",
        description: "Partnership viability analysis is only available for partnership evaluations. Please enable partnership mode in Initial Intake.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/sprints/${sprintId}/modules/partnership_viability/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate partnership viability analysis');
      }

      const data = await response.json();
      setReport(data.report);
      
      // Invalidate queries to refresh the module data
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/modules`] });
      
      toast({
        title: "Partnership Viability Analysis Generated",
        description: "Comprehensive partnership analysis generated successfully.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed", 
        description: "Unable to generate partnership viability analysis. Please try again.",
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
        description: "Partnership viability analysis copied. Paste into Google Docs for client delivery.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  // Show placeholder for non-partnership evaluations
  if (!isPartnershipEvaluation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-purple-600" />
                Partnership Viability Analysis
              </div>
              <Button
                disabled
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                Partnership Mode Required
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg mb-2">Partnership Viability Analysis</p>
              <p className="text-sm">
                This module analyzes partnership opportunities and strategic alliances for your business model.
                Available when partnership evaluation is enabled in Initial Intake.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-purple-600" />
              Partnership Viability Analysis
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
                <Handshake className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg mb-2">Ready to Generate Partnership Viability Analysis</p>
              <p className="text-sm">
                Click "Generate Report" to create comprehensive partnership analysis with fit assessment, 
                financial projections, and implementation roadmap for strategic alliances.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-lg font-medium">Generating Partnership Viability Analysis...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Creating partnership fit assessment, financial projections, and implementation roadmap...
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
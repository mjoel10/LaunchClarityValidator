import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Loader2, FileText, Copy } from 'lucide-react';

interface AssumptionTrackerReportProps {
  sprintId: number;
  intakeData?: any;
}

export default function AssumptionTrackerReport({ sprintId, intakeData }: AssumptionTrackerReportProps) {
  const [reportContent, setReportContent] = useState<string>('');
  const { toast } = useToast();

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/generate-assumption-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intakeData || {})
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.report) {
        setReportContent(data.report);
        toast({
          title: "Report Generated",
          description: "Your assumption validation report is ready to copy."
        });
      }
    },
    onError: () => {
      toast({
        title: "Generation Failed", 
        description: "Unable to generate report. Please try again.",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = async () => {
    try {
      // Create a temporary div to convert HTML to text with proper formatting
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = reportContent;
      
      // Get the text content while preserving basic formatting
      const textContent = tempDiv.innerText || tempDiv.textContent || '';
      
      await navigator.clipboard.writeText(textContent);
      toast({
        title: "Copied to Clipboard",
        description: "Report copied. Paste into your Google Doc."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually select and copy the text.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assumption Tracker
          </CardTitle>
          <CardDescription>
            Generate a comprehensive assumption validation report for your sprint planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={() => generateReportMutation.mutate()}
              disabled={generateReportMutation.isPending}
              className="flex items-center gap-2"
            >
              {generateReportMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {generateReportMutation.isPending ? 'Generating...' : 'Run Analysis'}
            </Button>
            
            {reportContent && (
              <Button 
                variant="outline"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {!reportContent && !generateReportMutation.isPending && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Report</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Click "Run Analysis" to generate your assumption validation report. 
              The output will be formatted for easy copying into Google Docs.
            </p>
          </CardContent>
        </Card>
      )}

      {reportContent && (
        <Card>
          <CardHeader>
            <CardTitle>Assumption Validation Report</CardTitle>
            <CardDescription>
              Copy and paste this report into your Google Doc for client delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none bg-gray-50 p-6 rounded-lg border font-mono text-sm leading-relaxed"
              style={{ 
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                whiteSpace: 'pre-wrap',
                userSelect: 'all'
              }}
              dangerouslySetInnerHTML={{ __html: reportContent }}
            />
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Copy Instructions:</strong> Use the "Copy Report" button above or select all text and copy (Ctrl+A, Ctrl+C). 
                Paste directly into Google Docs to maintain formatting.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
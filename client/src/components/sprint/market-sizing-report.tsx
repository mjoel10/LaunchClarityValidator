import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface MarketSizingReportProps {
  sprintId: number;
  intakeData?: any;
}

export default function MarketSizingReport({ sprintId, intakeData }: MarketSizingReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    if (!intakeData?.companyName) {
      toast({
        title: "Missing Information",
        description: "Please complete the Initial Intake first to generate market sizing analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', `/api/sprints/${sprintId}/generate-market-sizing-report`);
      const data = await response.json();
      setReport(data.report);
      toast({
        title: "Report Generated",
        description: "Market sizing analysis is ready. You can now copy it to your deliverable.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed", 
        description: "Unable to generate market sizing report. Please try again.",
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
        description: "Market sizing report copied. Paste into Google Docs for client delivery.",
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
            Market Sizing Analysis
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
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Run Analysis'
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!report && !isGenerating && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Ready to Generate Market Sizing Analysis</p>
              <p className="text-sm">
                Click "Run Analysis" to generate a comprehensive 4-5 page market sizing report 
                with TAM/SAM/SOM calculations, competitive analysis, and partnership opportunities.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Generating Market Sizing Analysis...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Creating comprehensive TAM/SAM/SOM analysis with specific calculations and data points.
                This may take 30-45 seconds to ensure premium consulting quality.
              </p>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Report Ready for Client Delivery</h4>
                <p className="text-sm text-blue-700">
                  This comprehensive market sizing analysis is formatted for copy/paste into Google Docs. 
                  The report includes specific calculations, data points, and strategic insights worth the premium sprint pricing.
                </p>
              </div>
              
              <div 
                className="prose max-w-none bg-white border rounded-lg p-6"
                dangerouslySetInnerHTML={{ __html: report }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
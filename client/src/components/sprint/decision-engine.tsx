import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle2, AlertTriangle, XCircle, RotateCcw, FileText, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DecisionEngineProps {
  sprintId: number;
  tier: string;
  modules: any[];
  intakeData?: any;
}

export default function DecisionEngine({ sprintId, tier, modules, intakeData }: DecisionEngineProps) {
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [modulesAnalyzed, setModulesAnalyzed] = useState<number>(0);
  const { toast } = useToast();

  const completedModules = modules?.filter(m => m.isCompleted) || [];
  const totalModules = modules?.length || 1;
  const completionRate = (completedModules.length / totalModules) * 100;

  // Generate comprehensive decision analysis
  const generateAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/sprints/${sprintId}/generate-decision`);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisReport(data.report);
      setRecommendation(data.recommendation);
      setConfidence(data.confidence);
      setModulesAnalyzed(data.modulesAnalyzed);
      toast({
        title: "Analysis Complete",
        description: `Generated comprehensive ${data.recommendation} recommendation based on ${data.modulesAnalyzed} modules.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate decision analysis",
        variant: "destructive",
      });
    },
  });

  const copyReport = () => {
    if (analysisReport) {
      navigator.clipboard.writeText(analysisReport);
      toast({
        title: "Report Copied",
        description: "The decision analysis report has been copied to your clipboard.",
      });
    }
  };

  const getRecommendationIcon = () => {
    if (!recommendation) return <Target className="h-6 w-6 text-gray-600" />;
    if (recommendation === 'GO') return <CheckCircle2 className="h-6 w-6 text-green-600" />;
    if (recommendation === 'PIVOT') return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    if (recommendation === 'KILL') return <XCircle className="h-6 w-6 text-red-600" />;
    return <RotateCcw className="h-6 w-6 text-gray-600" />;
  };

  const getRecommendationColor = () => {
    if (!recommendation) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (recommendation === 'GO') return 'bg-green-100 text-green-800 border-green-200';
    if (recommendation === 'PIVOT') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (recommendation === 'KILL') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canGenerateAnalysis = completedModules.length >= 3;

  return (
    <Card className="rounded-xl shadow-sm border-2 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-600" />
          Strategic Decision Engine
        </CardTitle>
        <CardDescription>
          Comprehensive GO/PIVOT/KILL analysis based on completed validation modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Validation Progress</div>
              <div className="font-semibold">{completedModules.length} of {totalModules} modules completed</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Ready for Analysis</div>
              <div className={`font-semibold ${canGenerateAnalysis ? 'text-green-600' : 'text-yellow-600'}`}>
                {canGenerateAnalysis ? 'Yes' : 'Need 3+ modules'}
              </div>
            </div>
          </div>

          {/* Analysis Generation or Display */}
          {!analysisReport ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generate Strategic Decision Analysis
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Analyze all completed validation modules to generate a comprehensive 7-10 page 
                  GO/PIVOT/KILL recommendation with cross-module insights and implementation roadmap.
                </p>
              </div>
              
              {!canGenerateAnalysis ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                  <p className="text-yellow-800 text-sm">
                    Complete at least 3 validation modules to generate comprehensive decision analysis.
                    Currently have {completedModules.length} completed modules.
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={() => generateAnalysisMutation.mutate()}
                  disabled={generateAnalysisMutation.isPending}
                  className="px-8 py-3"
                >
                  {generateAnalysisMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing {modulesAnalyzed} modules...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Generate Decision Analysis
                    </div>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recommendation Summary */}
              <div className={`p-6 rounded-lg border-2 ${getRecommendationColor()}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getRecommendationIcon()}
                    <div>
                      <h3 className="text-xl font-bold">{recommendation}</h3>
                      <p className="text-sm opacity-80">
                        Based on analysis of {modulesAnalyzed} validation modules
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{confidence}%</div>
                    <div className="text-sm opacity-80">Confidence</div>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Button onClick={copyReport} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Report
                  </Button>
                  <Button 
                    onClick={() => generateAnalysisMutation.mutate()}
                    variant="outline" 
                    size="sm"
                    disabled={generateAnalysisMutation.isPending}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Regenerate Analysis
                  </Button>
                </div>
              </div>

              {/* Full Analysis Report */}
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Complete Strategic Analysis Report
                  </h4>
                </div>
                <div className="p-6">
                  <div 
                    className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
                    style={{ fontFamily: 'Monaco, "Lucida Console", monospace' }}
                  >
                    {analysisReport}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
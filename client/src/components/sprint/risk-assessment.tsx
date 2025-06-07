import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle,
  XCircle,
  Target,
  BarChart3,
  FileText,
  Download,
  Eye,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RiskAssessmentProps {
  sprintId: number;
  intakeData?: any;
}

interface RiskCategory {
  score: number;
  level: string;
  factors: string[];
  mitigation: string;
}

interface RiskAnalysis {
  riskAssessment: {
    technical: RiskCategory;
    market: RiskCategory;
    competitive: RiskCategory;
    execution: RiskCategory;
    financial: RiskCategory;
  };
  overallRisk: string;
  keyMitigationPriorities: string[];
}

export default function RiskAssessment({ sprintId, intakeData }: RiskAssessmentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: module } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'modules'],
    select: (modules: any[]) => modules?.find((m: any) => m.moduleType === 'risk_assessment')
  });

  const generateAnalysisMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("POST", `/api/sprints/${sprintId}/modules/risk_assessment/generate`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sprints', sprintId, 'modules'] });
      toast({
        title: "Risk Assessment Generated",
        description: "Comprehensive risk analysis is ready for review."
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate risk assessment.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  const analysis: RiskAnalysis = module?.aiAnalysis;
  const isCompleted = module?.isCompleted;

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium-high': return 'bg-yellow-600';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium-high': 
      case 'medium': return <Eye className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Zap className="h-5 w-5" />;
      case 'market': return <Users className="h-5 w-5" />;
      case 'competitive': return <Target className="h-5 w-5" />;
      case 'execution': return <BarChart3 className="h-5 w-5" />;
      case 'financial': return <DollarSign className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  if (!isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <CardTitle>Risk Assessment Analysis</CardTitle>
          </div>
          <CardDescription>
            Generate comprehensive risk analysis across technical, market, competitive, execution, and financial dimensions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Analysis Will Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-orange-800 dark:text-orange-200">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Technical Risk Assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Market & Demand Risk Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Competitive Threat Evaluation</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Execution Risk Factors</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Financial Risk & Mitigation</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Strategic Risk Priorities</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => generateAnalysisMutation.mutate()} 
            disabled={isGenerating || !intakeData}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Risk Factors...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Generate Risk Assessment
              </>
            )}
          </Button>

          {!intakeData && (
            <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              Complete the intake form first to enable risk assessment generation.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Loading risk assessment analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <CardTitle>Risk Assessment Analysis</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Analysis Complete
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Copy Analysis
              </Button>
            </div>
          </div>
          <CardDescription>
            Comprehensive risk analysis for {intakeData?.companyName || 'your company'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Overall Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-2xl font-bold text-orange-600">{analysis.overallRisk}</div>
              <div className="text-sm text-gray-600">Overall Risk Level</div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getRiskColor(analysis.overallRisk)} text-white px-4 py-2`}
            >
              {getRiskIcon(analysis.overallRisk)}
              <span className="ml-2">{analysis.overallRisk} Risk</span>
            </Badge>
          </div>
          
          {analysis.keyMitigationPriorities && (
            <div className="space-y-2">
              <h4 className="font-semibold">Key Mitigation Priorities:</h4>
              <ul className="space-y-2">
                {analysis.keyMitigationPriorities.map((priority: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 font-medium text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{priority}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="categories">Risk Categories</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.riskAssessment).map(([category, risk]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <CardTitle className="text-base capitalize">{category} Risk</CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getRiskColor(risk.level)} text-white`}
                    >
                      {risk.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{risk.score}/100</span>
                      </div>
                      <Progress value={risk.score} className="h-2" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Key Factors:</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        {risk.factors.map((factor: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {Object.entries(analysis.riskAssessment).map(([category, risk]) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <CardTitle className="capitalize">{category} Risk Analysis</CardTitle>
                      <CardDescription>Score: {risk.score}/100 • Level: {risk.level}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getRiskColor(risk.level)} text-white`}
                  >
                    {getRiskIcon(risk.level)}
                    <span className="ml-1">{risk.level}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Risk Factors
                    </h4>
                    <div className="space-y-2">
                      {risk.factors.map((factor: string, idx: number) => (
                        <div key={idx} className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                          <div className="text-sm text-red-800 dark:text-red-200">{factor}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Mitigation Strategy
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <div className="text-sm text-blue-800 dark:text-blue-200">{risk.mitigation}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mitigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Risk Mitigation Framework</CardTitle>
              <CardDescription>Priority actions to reduce overall risk exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.keyMitigationPriorities.map((priority: string, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{priority}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Priority Level: {index === 0 ? 'Critical' : index === 1 ? 'High' : 'Medium'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
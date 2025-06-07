import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  TrendingUp, 
  Target, 
  Shield, 
  Zap, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  ArrowRight,
  Eye,
  BarChart3,
  FileText,
  Download
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CompetitiveIntelligenceProps {
  sprintId: number;
  intakeData?: any;
}

interface CompetitorAnalysis {
  competitor: {
    name: string;
    type: string;
    marketPosition: string;
    foundedYear: number;
    headquarters: string;
    employeeCount: string;
    funding: string;
    valuation: string;
  };
  strengths: Array<{
    category: string;
    description: string;
    impact: string;
  }>;
  weaknesses: Array<{
    category: string;
    description: string;
    opportunity: string;
  }>;
  pricing: {
    model: string;
    tiers: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
    value_proposition: string;
  };
  market_share: {
    percentage: string;
    growth_rate: string;
    customer_segments: string[];
  };
  competitive_advantages: string[];
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  strategic_recommendations: string[];
}

export default function CompetitiveIntelligence({ sprintId, intakeData }: CompetitiveIntelligenceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: module } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'modules'],
    select: (modules: any[]) => modules?.find((m: any) => m.moduleType === 'competitive_intelligence')
  });

  const generateAnalysisMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("POST", `/api/sprints/${sprintId}/modules/competitive_intelligence/generate`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sprints', sprintId, 'modules'] });
      toast({
        title: "Competitive Intelligence Generated",
        description: "Comprehensive competitor analysis is ready for review."
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate competitive intelligence.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  const analysis: CompetitorAnalysis[] = module?.aiAnalysis?.analysis || [];
  const summary = module?.aiAnalysis?.summary || {};
  const isCompleted = module?.isCompleted;

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Eye className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Competitive Intelligence Analysis</CardTitle>
          </div>
          <CardDescription>
            Generate comprehensive competitor analysis with market positioning, strengths, weaknesses, and strategic recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Analysis Will Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Direct & Indirect Competitor Mapping</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Market Share & Positioning Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Pricing Strategy Comparison</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Competitive Advantages Assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Threat Level Evaluation</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Strategic Recommendations</span>
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
                Analyzing Competitive Landscape...
              </>
            ) : (
              <>
                <Building2 className="mr-2 h-4 w-4" />
                Generate Competitive Intelligence
              </>
            )}
          </Button>

          {!intakeData && (
            <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              Complete the intake form first to enable competitive analysis generation.
            </p>
          )}
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
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Competitive Intelligence Analysis</CardTitle>
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
            Comprehensive competitive landscape analysis for {intakeData?.companyName || 'your company'}
          </CardDescription>
        </CardHeader>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Executive Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.total_competitors || 0}</div>
                <div className="text-sm text-blue-800 dark:text-blue-200">Competitors Analyzed</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{summary.high_threat_count || 0}</div>
                <div className="text-sm text-orange-800 dark:text-orange-200">High Threat Competitors</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.market_opportunities || 0}</div>
                <div className="text-sm text-green-800 dark:text-green-200">Market Opportunities</div>
              </div>
            </div>
            {summary.key_insights && (
              <div className="space-y-2">
                <h4 className="font-semibold">Key Strategic Insights:</h4>
                <ul className="space-y-1">
                  {summary.key_insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="competitors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="positioning">Market Positioning</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-4">
          {analysis.map((competitor, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {competitor.competitor.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle>{competitor.competitor.name}</CardTitle>
                      <CardDescription>{competitor.competitor.type} • {competitor.competitor.marketPosition}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`${getThreatColor(competitor.threat_level)} text-white`}>
                      {getThreatIcon(competitor.threat_level)}
                      <span className="ml-1 capitalize">{competitor.threat_level} Threat</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {competitor.strengths.map((strength, idx) => (
                        <div key={idx} className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                          <div className="font-medium text-sm">{strength.category}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{strength.description}</div>
                          <Badge variant="secondary" className="mt-1 text-xs">{strength.impact}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Weaknesses
                    </h4>
                    <div className="space-y-2">
                      {competitor.weaknesses.map((weakness, idx) => (
                        <div key={idx} className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                          <div className="font-medium text-sm">{weakness.category}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{weakness.description}</div>
                          <div className="text-xs text-blue-600 mt-1 font-medium">Opportunity: {weakness.opportunity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Market Share:</span> {competitor.market_share.percentage}
                    </div>
                    <div>
                      <span className="font-medium">Growth Rate:</span> {competitor.market_share.growth_rate}
                    </div>
                    <div>
                      <span className="font-medium">Founded:</span> {competitor.competitor.foundedYear}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="positioning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Positioning Map</CardTitle>
              <CardDescription>Competitive positioning across key market dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.map((competitor, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{competitor.competitor.name}</h4>
                      <Badge>{competitor.competitor.marketPosition}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Market Share</span>
                        <span className="font-medium">{competitor.market_share.percentage}</span>
                      </div>
                      <Progress value={parseInt(competitor.market_share.percentage)} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Customer Segments</span>
                        <span className="font-medium">{competitor.market_share.customer_segments.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          {analysis.map((competitor, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{competitor.competitor.name} Pricing Strategy</span>
                </CardTitle>
                <CardDescription>{competitor.pricing.value_proposition}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {competitor.pricing.tiers.map((tier, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <div className="text-2xl font-bold text-blue-600">{tier.price}</div>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {tier.features.map((feature, featureIdx) => (
                          <li key={featureIdx} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Strategic Recommendations</span>
              </CardTitle>
              <CardDescription>Actionable insights based on competitive analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysis.map((competitor, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">Against {competitor.competitor.name}</h4>
                    <ul className="space-y-2">
                      {competitor.strategic_recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
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
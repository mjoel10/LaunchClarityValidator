import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus,
  BarChart3,
  Lightbulb,
  Users,
  Calendar,
  Sparkles,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  DollarSign,
  Zap
} from 'lucide-react';

interface AIAssumptionTrackerProps {
  sprintId: number;
  intakeData?: any;
}

interface Assumption {
  id: string;
  assumption_text: string;
  category: string;
  risk_level: string;
  confidence_level: string;
  validation_approach_discovery: string;
  validation_approach_feasibility: string;
  validation_approach_validation: string;
  success_criteria: string;
  status: string;
  evidence: string;
  custom: boolean;
}

export default function AIAssumptionTracker({ sprintId, intakeData }: AIAssumptionTrackerProps) {
  const [selectedAssumption, setSelectedAssumption] = useState<string | null>(null);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newAssumption, setNewAssumption] = useState('');
  const [editingAssumption, setEditingAssumption] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch existing assumptions from sprint module data
  const { data: moduleData } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
  });

  // Get sprint data to determine tier
  const { data: sprint } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
  });

  const assumptionsModule = moduleData ? moduleData.find((m: any) => m.moduleType === 'assumptions') : null;
  const tier = (sprint as any)?.tier || 'discovery';

  // Generate assumptions using AI
  const generateAssumptionsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/generate-assumptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to generate assumptions');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.assumptions) {
        const processedAssumptions = data.assumptions.map((assumption: any, index: number) => ({
          ...assumption,
          id: `ai-${index}`,
          status: 'untested',
          evidence: '',
          custom: false
        }));
        setAssumptions(processedAssumptions);
        toast({
          title: "LaunchClarity Analysis Complete",
          description: `Generated ${processedAssumptions.length} critical assumptions for validation.`
        });
      }
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate assumptions. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Load existing assumptions on component mount
  useEffect(() => {
    if (assumptionsModule?.aiAnalysis?.assumptions) {
      setAssumptions(assumptionsModule.aiAnalysis.assumptions);
    }
  }, [assumptionsModule]);

  // Save assumptions to module data when they change
  const saveAssumptions = async (updatedAssumptions: Assumption[]) => {
    try {
      await fetch(`/api/sprints/${sprintId}/modules`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: 'assumptions',
          aiAnalysis: { assumptions: updatedAssumptions }
        })
      });
    } catch (error) {
      console.error('Failed to save assumptions:', error);
    }
  };

  // Only auto-generate if user explicitly requests it - removed automatic generation

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800 border-green-200';
      case 'invalidated': return 'bg-red-100 text-red-800 border-red-200';
      case 'testing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_more_data': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'market': return <Users className="w-4 h-4" />;
      case 'technical': return <Zap className="w-4 h-4" />;
      case 'operational': return <BarChart3 className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'customer': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getConfidenceLevel = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 80;
      case 'medium': return 50;
      case 'low': return 20;
      default: return 0;
    }
  };

  const addCustomAssumption = () => {
    if (!newAssumption.trim()) return;
    
    const customAssumption: Assumption = {
      id: `custom-${Date.now()}`,
      assumption_text: newAssumption,
      category: 'Custom',
      risk_level: 'Medium',
      confidence_level: 'Low',
      validation_approach_discovery: 'Manual research and analysis',
      validation_approach_feasibility: 'Customer interviews and surveys',
      validation_approach_validation: 'Market testing and experiments',
      success_criteria: 'To be defined based on validation approach',
      status: 'untested',
      evidence: '',
      custom: true
    };

    setAssumptions(prev => [...prev, customAssumption]);
    setNewAssumption('');
    toast({
      title: "Custom Assumption Added",
      description: "Your assumption has been added to the tracker."
    });
  };

  const updateAssumptionStatus = (id: string, status: string) => {
    const updatedAssumptions = assumptions.map(assumption => 
      assumption.id === id ? { ...assumption, status } : assumption
    );
    setAssumptions(updatedAssumptions);
    saveAssumptions(updatedAssumptions);
  };

  const updateAssumptionEvidence = (id: string, evidence: string) => {
    const updatedAssumptions = assumptions.map(assumption => 
      assumption.id === id ? { ...assumption, evidence } : assumption
    );
    setAssumptions(updatedAssumptions);
    saveAssumptions(updatedAssumptions);
  };

  const deleteAssumption = (id: string) => {
    setAssumptions(prev => prev.filter(assumption => assumption.id !== id));
    toast({
      title: "Assumption Removed",
      description: "The assumption has been deleted from your tracker."
    });
  };

  const getTierRequirements = () => {
    const highRiskCount = assumptions.filter(a => a.risk_level.toLowerCase() === 'high').length;
    const mediumRiskCount = assumptions.filter(a => a.risk_level.toLowerCase() === 'medium').length;
    const validatedCount = assumptions.filter(a => a.status === 'validated').length;
    const needsInterviews = assumptions.filter(a => 
      a.validation_approach_feasibility.toLowerCase().includes('interview') && 
      a.status === 'untested'
    ).length;
    const needsMarketTests = assumptions.filter(a => 
      a.validation_approach_validation.toLowerCase().includes('test') && 
      a.status === 'untested'
    ).length;

    return {
      highRiskCount,
      mediumRiskCount,
      validatedCount,
      needsInterviews,
      needsMarketTests,
      totalAssumptions: assumptions.length
    };
  };

  const requirements = getTierRequirements();

  if (isGenerating || generateAssumptionsMutation.isPending) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium">LaunchClarity Analysis</h3>
          <p className="text-gray-600">Analyzing your business context and generating critical assumptions...</p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Generate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            LaunchClarity Assumption Analysis
          </h2>
          <p className="text-gray-600 mt-1">Advanced validation roadmap for your critical business assumptions</p>
        </div>
        {assumptions.length === 0 && (
          <Button onClick={() => generateAssumptionsMutation.mutate()} disabled={generateAssumptionsMutation.isPending}>
            <Sparkles className="w-4 h-4 mr-2" />
            Run Analysis
          </Button>
        )}
        {assumptions.length > 0 && (
          <Button variant="outline" onClick={() => generateAssumptionsMutation.mutate()} disabled={generateAssumptionsMutation.isPending}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        )}
      </div>

      {assumptions.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{assumptions.length}</div>
                <div className="text-xs text-gray-500">identified for validation</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">High Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{requirements.highRiskCount}</div>
                <div className="text-xs text-gray-500">business-critical assumptions</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Validated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{requirements.validatedCount}</div>
                <div className="text-xs text-gray-500">of {assumptions.length} assumptions</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((requirements.validatedCount / assumptions.length) * 100)}%
                </div>
                <div className="text-xs text-gray-500">validation complete</div>
              </CardContent>
            </Card>
          </div>

          {/* Upsell View for Discovery Tier */}
          {tier === 'discovery' && requirements.validatedCount > 0 && (
            <Card className="rounded-xl shadow-sm border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-900">
                  <TrendingUp className="w-6 h-6" />
                  Validation Progress & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{requirements.validatedCount} of {assumptions.length} assumptions validated via desk research</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{assumptions.length - requirements.validatedCount} assumptions require direct validation:</p>
                    <div className="ml-4 space-y-1">
                      {requirements.needsInterviews > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Lock className="w-4 h-4 text-orange-600" />
                            <span>{requirements.needsInterviews} need customer interviews</span>
                          </div>
                          <Badge variant="outline" className="text-orange-700 border-orange-300">
                            Feasibility Sprint
                          </Badge>
                        </div>
                      )}
                      {requirements.needsMarketTests > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Lock className="w-4 h-4 text-purple-600" />
                            <span>{requirements.needsMarketTests} need market testing</span>
                          </div>
                          <Badge variant="outline" className="text-purple-700 border-purple-300">
                            Validation Sprint
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Recommendation:</strong> Upgrade to higher-tier sprints to access customer interview tools, market testing frameworks, and advanced validation methods.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assumptions List */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Assumption Validation Tracker</CardTitle>
              <CardDescription>
                Monitor and validate each critical business assumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assumptions.map((assumption) => (
                  <div key={assumption.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(assumption.category)}
                            <Badge variant="outline" className="text-xs">
                              {assumption.category}
                            </Badge>
                          </div>
                          <Badge className={getRiskColor(assumption.risk_level)}>
                            {assumption.risk_level} Risk
                          </Badge>
                          <Badge className={getStatusColor(assumption.status)}>
                            {(assumption.status || 'untested').replace('_', ' ')}
                          </Badge>
                          {assumption.custom && (
                            <Badge variant="secondary">Custom</Badge>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-3">{assumption.assumption_text}</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                              <span className="text-sm font-medium text-gray-900">{assumption.confidence_level}</span>
                            </div>
                            <Progress value={getConfidenceLevel(assumption.confidence_level)} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedAssumption(selectedAssumption === assumption.id ? null : assumption.id)}
                        >
                          {selectedAssumption === assumption.id ? 'Hide Details' : 'View Details'}
                        </Button>
                        {assumption.custom && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteAssumption(assumption.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>

                    {selectedAssumption === assumption.id && (
                      <div className="border-t pt-4 space-y-4">
                        {/* Validation Approach by Tier */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Validation Approach by Sprint Tier</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {tier === 'discovery' ? <Unlock className="w-4 h-4 text-green-600" /> : <Eye className="w-4 h-4 text-blue-600" />}
                                <span className="text-sm font-medium">Discovery Sprint</span>
                                {tier === 'discovery' && <Badge variant="default" className="text-xs">Current</Badge>}
                              </div>
                              <p className="text-sm text-gray-700 flex-1">{assumption.validation_approach_discovery}</p>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {tier === 'feasibility' ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-orange-600" />}
                                <span className="text-sm font-medium">Feasibility Sprint</span>
                                {tier === 'feasibility' && <Badge variant="default" className="text-xs">Current</Badge>}
                                {tier === 'discovery' && <Badge variant="outline" className="text-orange-700 border-orange-300 text-xs">Upgrade Required</Badge>}
                              </div>
                              <p className="text-sm text-gray-700 flex-1">{assumption.validation_approach_feasibility}</p>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {tier === 'validation' ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-purple-600" />}
                                <span className="text-sm font-medium">Validation Sprint</span>
                                {tier === 'validation' && <Badge variant="default" className="text-xs">Current</Badge>}
                                {tier !== 'validation' && <Badge variant="outline" className="text-purple-700 border-purple-300 text-xs">Upgrade Required</Badge>}
                              </div>
                              <p className="text-sm text-gray-700 flex-1">{assumption.validation_approach_validation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Success Criteria */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Success Criteria</h4>
                          <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{assumption.success_criteria}</p>
                        </div>

                        {/* Status Update */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`status-${assumption.id}`}>Update Status</Label>
                            <Select 
                              value={assumption.status} 
                              onValueChange={(value) => updateAssumptionStatus(assumption.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="untested">Untested</SelectItem>
                                <SelectItem value="testing">Testing</SelectItem>
                                <SelectItem value="validated">Validated</SelectItem>
                                <SelectItem value="invalidated">Invalidated</SelectItem>
                                <SelectItem value="needs_more_data">Needs More Data</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Evidence Field */}
                        <div>
                          <Label htmlFor={`evidence-${assumption.id}`}>Evidence & Notes</Label>
                          <Textarea 
                            id={`evidence-${assumption.id}`}
                            value={assumption.evidence}
                            onChange={(e) => updateAssumptionEvidence(assumption.id, e.target.value)}
                            placeholder="Record your findings, test results, and evidence here..."
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Custom Assumption */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Custom Assumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-assumption">Custom Assumption</Label>
                  <Textarea 
                    id="new-assumption"
                    value={newAssumption}
                    onChange={(e) => setNewAssumption(e.target.value)}
                    placeholder="Enter a specific, testable assumption about your business..."
                    className="min-h-[80px]"
                  />
                </div>
                <Button onClick={addCustomAssumption} disabled={!newAssumption.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assumption
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
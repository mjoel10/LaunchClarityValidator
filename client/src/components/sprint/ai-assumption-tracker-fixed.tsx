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
  Zap,
  Search
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
  sprint_tier: 'discovery' | 'feasibility' | 'validation';
  validation_method: string;
  validation_approach_discovery: string;
  validation_approach_feasibility: string;
  validation_approach_validation: string;
  success_criteria: string;
  timeframe: string;
  status: string;
  evidence: string;
  custom: boolean;
}

export default function AIAssumptionTracker({ sprintId, intakeData }: AIAssumptionTrackerProps) {
  const [selectedAssumption, setSelectedAssumption] = useState<string | null>(null);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [newAssumption, setNewAssumption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current sprint data to determine tier
  const { data: sprint } = useQuery({
    queryKey: ['/api/sprints', sprintId],
    enabled: !!sprintId
  });

  const tier = sprint?.tier || 'discovery';

  // Get existing module data
  const { data: moduleData } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'modules'],
    enabled: !!sprintId
  });

  // Find the assumption tracker module
  const assumptionModule = moduleData?.find((m: any) => m.moduleType === 'ai_assumption_tracker');

  // Load saved assumptions from module data
  useEffect(() => {
    if (assumptionModule?.moduleData?.assumptions) {
      setAssumptions(assumptionModule.moduleData.assumptions);
    }
  }, [assumptionModule]);

  // Generate assumptions mutation
  const generateAssumptionsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/sprints/${sprintId}/generate-assumptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intakeData || {})
      });
      
      if (!response.ok) throw new Error('Failed to generate assumptions');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.assumptions) {
        setAssumptions(data.assumptions);
        toast({
          title: "Analysis Complete",
          description: `Generated ${data.assumptions.length} tier-specific assumptions for validation.`
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

  const saveAssumptions = async (assumptionsToSave: Assumption[]) => {
    try {
      await fetch(`/api/sprints/${sprintId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: 'ai_assumption_tracker',
          moduleData: { assumptions: assumptionsToSave }
        })
      });
    } catch (error) {
      console.error('Failed to save assumptions:', error);
    }
  };

  const addCustomAssumption = (sprintTier: 'discovery' | 'feasibility' | 'validation') => {
    if (!newAssumption.trim()) return;
    
    const customAssumption: Assumption = {
      id: `custom-${Date.now()}`,
      assumption_text: newAssumption,
      category: 'Custom',
      risk_level: 'Medium',
      confidence_level: 'Low',
      sprint_tier: sprintTier,
      validation_method: `${sprintTier} validation method`,
      validation_approach_discovery: 'Manual research and analysis',
      validation_approach_feasibility: 'Customer interviews and surveys',
      validation_approach_validation: 'Market testing and experiments',
      success_criteria: 'To be defined based on validation approach',
      timeframe: sprintTier === 'discovery' ? '1 week' : sprintTier === 'feasibility' ? '2 weeks' : '4 weeks',
      status: 'untested',
      evidence: '',
      custom: true
    };

    const updatedAssumptions = [...assumptions, customAssumption];
    setAssumptions(updatedAssumptions);
    saveAssumptions(updatedAssumptions);
    setNewAssumption('');
    toast({
      title: "Custom Assumption Added",
      description: "Your assumption has been added to the tracker."
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'disproven': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate progress metrics
  const validatedCount = assumptions.filter(a => a.status === 'validated').length;
  const discoveryAssumptions = assumptions.filter(a => a.sprint_tier === 'discovery');
  const feasibilityAssumptions = assumptions.filter(a => a.sprint_tier === 'feasibility');
  const validationAssumptions = assumptions.filter(a => a.sprint_tier === 'validation');

  const getTierProgress = (tierAssumptions: Assumption[]) => {
    if (tierAssumptions.length === 0) return 0;
    const validated = tierAssumptions.filter(a => a.status === 'validated').length;
    return Math.round((validated / tierAssumptions.length) * 100);
  };

  if (generateAssumptionsMutation.isPending) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium">Generating Analysis</h3>
          <p className="text-gray-600">Analyzing your business context and generating critical assumptions...</p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            Assumption Tracker
          </h2>
          <p className="text-gray-600 mt-1">Systematic validation roadmap organized by sprint tier and timeframe</p>
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
          {/* Sprint Tier Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className={`rounded-xl shadow-sm ${tier === 'discovery' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Discovery Sprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {discoveryAssumptions.filter(a => a.status === 'validated').length} of {discoveryAssumptions.length}
                </div>
                <div className="text-xs text-gray-500">1 week • Desk research</div>
                <Progress value={getTierProgress(discoveryAssumptions)} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className={`rounded-xl shadow-sm ${tier === 'feasibility' ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Feasibility Sprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {feasibilityAssumptions.filter(a => a.status === 'validated').length} of {feasibilityAssumptions.length}
                </div>
                <div className="text-xs text-gray-500">2 weeks • Customer interviews</div>
                <Progress value={getTierProgress(feasibilityAssumptions)} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className={`rounded-xl shadow-sm ${tier === 'validation' ? 'ring-2 ring-purple-500 bg-purple-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Validation Sprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {validationAssumptions.filter(a => a.status === 'validated').length} of {validationAssumptions.length}
                </div>
                <div className="text-xs text-gray-500">4 weeks • Market tests</div>
                <Progress value={getTierProgress(validationAssumptions)} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {validatedCount} of {assumptions.length}
                </div>
                <div className="text-xs text-gray-500">{Math.round((validatedCount / Math.max(assumptions.length, 1)) * 100)}% complete</div>
                <Progress value={(validatedCount / Math.max(assumptions.length, 1)) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Discovery Sprint Assumptions */}
          <div className="space-y-6">
            <Card className={`rounded-xl shadow-sm ${tier === 'discovery' ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-600">
                  <Search className="w-5 h-5" />
                  Discovery Sprint Assumptions
                  <Badge className="bg-blue-100 text-blue-800">1 Week • Desk Research</Badge>
                </CardTitle>
                <CardDescription>
                  Validate through competitor analysis, API documentation, support ticket analysis, and forum research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discoveryAssumptions.map((assumption) => (
                    <div key={assumption.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">{assumption.category}</Badge>
                            <Badge className={getRiskColor(assumption.risk_level)}>
                              {assumption.risk_level} Risk
                            </Badge>
                            <Badge className={getStatusColor(assumption.status)}>
                              {(assumption.status || 'untested').replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-2">{assumption.assumption_text}</h4>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Research Method:</strong> {assumption.validation_approach_discovery}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Success Criteria:</strong> {assumption.success_criteria}
                          </div>
                          
                          <div className="text-sm text-blue-600">
                            <strong>Timeframe:</strong> {assumption.timeframe || '1 week'}
                          </div>
                        </div>
                        
                        <Select value={assumption.status || 'untested'} onValueChange={(value) => updateAssumptionStatus(assumption.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="untested">Untested</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="validated">Validated</SelectItem>
                            <SelectItem value="disproven">Disproven</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  {discoveryAssumptions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No discovery assumptions generated yet. Click "Run Analysis" to generate tier-specific assumptions.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feasibility Sprint Assumptions */}
            <Card className={`rounded-xl shadow-sm ${tier === 'feasibility' ? 'ring-2 ring-green-500' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600">
                  <Users className="w-5 h-5" />
                  Feasibility Sprint Assumptions
                  <Badge className="bg-green-100 text-green-800">2 Weeks • Customer Interviews</Badge>
                </CardTitle>
                <CardDescription>
                  Validate through 5-7 customer interviews focusing on pain points, willingness to pay, and behavior data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feasibilityAssumptions.map((assumption) => (
                    <div key={assumption.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">{assumption.category}</Badge>
                            <Badge className={getRiskColor(assumption.risk_level)}>
                              {assumption.risk_level} Risk
                            </Badge>
                            <Badge className={getStatusColor(assumption.status)}>
                              {(assumption.status || 'untested').replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-2">{assumption.assumption_text}</h4>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Interview Question:</strong> {assumption.validation_approach_feasibility}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Success Criteria:</strong> {assumption.success_criteria}
                          </div>
                          
                          <div className="text-sm text-green-600">
                            <strong>Timeframe:</strong> {assumption.timeframe || '2 weeks'}
                          </div>
                        </div>
                        
                        <Select value={assumption.status || 'untested'} onValueChange={(value) => updateAssumptionStatus(assumption.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="untested">Untested</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="validated">Validated</SelectItem>
                            <SelectItem value="disproven">Disproven</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  {feasibilityAssumptions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No feasibility assumptions generated yet. Click "Run Analysis" to generate tier-specific assumptions.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Validation Sprint Assumptions */}
            <Card className={`rounded-xl shadow-sm ${tier === 'validation' ? 'ring-2 ring-purple-500' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-600">
                  <Target className="w-5 h-5" />
                  Validation Sprint Assumptions
                  <Badge className="bg-purple-100 text-purple-800">4 Weeks • Market Tests</Badge>
                </CardTitle>
                <CardDescription>
                  Validate through market tests, beta programs, and leading indicators like conversion rates and user engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validationAssumptions.map((assumption) => (
                    <div key={assumption.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">{assumption.category}</Badge>
                            <Badge className={getRiskColor(assumption.risk_level)}>
                              {assumption.risk_level} Risk
                            </Badge>
                            <Badge className={getStatusColor(assumption.status)}>
                              {(assumption.status || 'untested').replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-2">{assumption.assumption_text}</h4>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Test Method:</strong> {assumption.validation_approach_validation}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Success Criteria:</strong> {assumption.success_criteria}
                          </div>
                          
                          <div className="text-sm text-purple-600">
                            <strong>Timeframe:</strong> {assumption.timeframe || '4 weeks'}
                          </div>
                        </div>
                        
                        <Select value={assumption.status || 'untested'} onValueChange={(value) => updateAssumptionStatus(assumption.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="untested">Untested</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="validated">Validated</SelectItem>
                            <SelectItem value="disproven">Disproven</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  {validationAssumptions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No validation assumptions generated yet. Click "Run Analysis" to generate tier-specific assumptions.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
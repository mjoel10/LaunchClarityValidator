import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Search,
  Users,
  CheckCircle2, 
  Clock, 
  Plus,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface AIAssumptionTrackerProps {
  sprintId: number;
  intakeData?: any;
}

interface Assumption {
  id: string;
  assumption_text: string;
  category: string;
  sprint_tier: 'discovery' | 'feasibility' | 'validation';
  risk_level: string;
  status?: string;
  confidence_level: string;
  validation_method: string;
  validation_approach_discovery: string;
  validation_approach_feasibility: string;
  validation_approach_validation: string;
  success_criteria: string;
  timeframe: string;
  evidence?: string;
  custom?: boolean;
}

export default function AIAssumptionTracker({ sprintId, intakeData }: AIAssumptionTrackerProps) {
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    discovery: true,
    feasibility: true,
    validation: true
  });
  const { toast } = useToast();

  // Get current sprint data
  const { data: sprint } = useQuery({
    queryKey: ['/api/sprints', sprintId],
    enabled: !!sprintId
  });

  // Get existing module data
  const { data: moduleData } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'modules'],
    enabled: !!sprintId
  });

  const tier = sprint?.tier || 'discovery';
  const assumptionModule = moduleData?.find((m: any) => m.moduleType === 'ai_assumption_tracker');

  // Load saved assumptions
  useEffect(() => {
    if (assumptionModule?.moduleData?.assumptions) {
      const savedAssumptions = assumptionModule.moduleData.assumptions;
      // Handle both old array format and new object format
      if (Array.isArray(savedAssumptions)) {
        setAssumptions(savedAssumptions);
      } else if (savedAssumptions && typeof savedAssumptions === 'object') {
        // Flatten the tier-specific assumptions into a single array
        const allAssumptions = [
          ...(savedAssumptions.discovery || []),
          ...(savedAssumptions.feasibility || []),
          ...(savedAssumptions.validation || [])
        ];
        setAssumptions(allAssumptions);
      }
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
        let allAssumptions: Assumption[] = [];
        
        // Handle new object structure with tier-specific arrays
        if (data.assumptions.discovery || data.assumptions.feasibility || data.assumptions.validation) {
          allAssumptions = [
            ...(data.assumptions.discovery || []),
            ...(data.assumptions.feasibility || []),
            ...(data.assumptions.validation || [])
          ];
        } 
        // Handle legacy array structure
        else if (Array.isArray(data.assumptions)) {
          allAssumptions = data.assumptions;
        }
        
        setAssumptions(allAssumptions);
        toast({
          title: "LaunchClarity Analysis Complete",
          description: `Generated ${allAssumptions.length} tier-specific assumptions for validation.`
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

  const safeGetStatus = (assumption: Assumption): string => {
    return assumption.status || 'untested';
  };

  const updateAssumptionStatus = (id: string, status: string) => {
    const updatedAssumptions = assumptions.map(assumption => 
      assumption.id === id ? { ...assumption, status } : assumption
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  // Group assumptions by tier
  const discoveryAssumptions = assumptions.filter(a => a.sprint_tier === 'discovery');
  const feasibilityAssumptions = assumptions.filter(a => a.sprint_tier === 'feasibility');
  const validationAssumptions = assumptions.filter(a => a.sprint_tier === 'validation');

  // Calculate progress
  const getValidatedCount = (tierAssumptions: Assumption[]) => 
    tierAssumptions.filter(a => safeGetStatus(a) === 'validated').length;

  const getTierProgress = (tierAssumptions: Assumption[]) => {
    if (tierAssumptions.length === 0) return 0;
    return Math.round((getValidatedCount(tierAssumptions) / tierAssumptions.length) * 100);
  };

  const totalValidated = assumptions.filter(a => safeGetStatus(a) === 'validated').length;
  const overallProgress = assumptions.length > 0 ? Math.round((totalValidated / assumptions.length) * 100) : 0;

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

  const renderAssumption = (assumption: Assumption) => (
    <div key={assumption.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-xs">{assumption.category}</Badge>
            <Badge className={getRiskColor(assumption.risk_level)}>
              {assumption.risk_level} Risk
            </Badge>
            <Badge className={getStatusColor(safeGetStatus(assumption))}>
              {safeGetStatus(assumption).replace('_', ' ')}
            </Badge>
          </div>
          
          <h4 className="font-medium text-gray-900 mb-2">{assumption.assumption_text}</h4>
          
          <div className="text-sm text-gray-600 mb-2">
            <strong>Method:</strong> {
              assumption.sprint_tier === 'discovery' ? assumption.validation_approach_discovery :
              assumption.sprint_tier === 'feasibility' ? assumption.validation_approach_feasibility :
              assumption.validation_approach_validation
            }
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <strong>Success Criteria:</strong> {assumption.success_criteria}
          </div>
          
          <div className="text-sm text-blue-600">
            <strong>Timeframe:</strong> {assumption.timeframe || 
              (assumption.sprint_tier === 'discovery' ? '1 week' :
               assumption.sprint_tier === 'feasibility' ? '2 weeks' : '4 weeks')}
          </div>
        </div>
        
        <Select value={safeGetStatus(assumption)} onValueChange={(value) => updateAssumptionStatus(assumption.id, value)}>
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
  );

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
          {/* Progress Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className={`rounded-xl shadow-sm ${tier === 'discovery' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {getValidatedCount(discoveryAssumptions)} of {discoveryAssumptions.length}
                </div>
                <div className="text-xs text-gray-500 mb-2">1 week • Desk research</div>
                <Progress value={getTierProgress(discoveryAssumptions)} className="h-2" />
              </CardContent>
            </Card>

            <Card className={`rounded-xl shadow-sm ${tier === 'feasibility' ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Feasibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {getValidatedCount(feasibilityAssumptions)} of {feasibilityAssumptions.length}
                </div>
                <div className="text-xs text-gray-500 mb-2">2 weeks • Customer interviews</div>
                <Progress value={getTierProgress(feasibilityAssumptions)} className="h-2" />
              </CardContent>
            </Card>

            <Card className={`rounded-xl shadow-sm ${tier === 'validation' ? 'ring-2 ring-purple-500 bg-purple-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {getValidatedCount(validationAssumptions)} of {validationAssumptions.length}
                </div>
                <div className="text-xs text-gray-500 mb-2">4 weeks • Market tests</div>
                <Progress value={getTierProgress(validationAssumptions)} className="h-2" />
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalValidated} of {assumptions.length}
                </div>
                <div className="text-xs text-gray-500 mb-2">{overallProgress}% complete</div>
                <Progress value={overallProgress} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Tier Sections */}
          <div className="space-y-6">
            {/* Discovery Sprint */}
            <Card className={`rounded-xl shadow-sm ${tier === 'discovery' ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader 
                className="cursor-pointer" 
                onClick={() => toggleSection('discovery')}
              >
                <CardTitle className="flex items-center justify-between text-blue-600">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5" />
                    Discovery Sprint Assumptions
                    <Badge className="bg-blue-100 text-blue-800">1 Week • Desk Research</Badge>
                  </div>
                  {expandedSections.discovery ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </CardTitle>
                <CardDescription>
                  Validate through competitor analysis, API documentation, support ticket analysis, and forum research
                </CardDescription>
              </CardHeader>
              
              {expandedSections.discovery && (
                <CardContent>
                  <div className="space-y-4">
                    {discoveryAssumptions.map((assumption) => renderAssumption(assumption))}
                    {discoveryAssumptions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No discovery assumptions generated yet. Click "Run Analysis" to generate tier-specific assumptions.</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Feasibility Sprint */}
            <Card className={`rounded-xl shadow-sm ${tier === 'feasibility' ? 'ring-2 ring-green-500' : ''}`}>
              <CardHeader 
                className="cursor-pointer" 
                onClick={() => toggleSection('feasibility')}
              >
                <CardTitle className="flex items-center justify-between text-green-600">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    Feasibility Sprint Assumptions
                    <Badge className="bg-green-100 text-green-800">2 Weeks • Customer Interviews</Badge>
                  </div>
                  {expandedSections.feasibility ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </CardTitle>
                <CardDescription>
                  Validate through 5-7 customer interviews focusing on pain points, willingness to pay, and behavior data
                </CardDescription>
              </CardHeader>
              
              {expandedSections.feasibility && (
                <CardContent>
                  <div className="space-y-4">
                    {feasibilityAssumptions.map((assumption) => renderAssumption(assumption))}
                    {feasibilityAssumptions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No feasibility assumptions generated yet. Click "Run Analysis" to generate tier-specific assumptions.</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Validation Sprint */}
            <Card className={`rounded-xl shadow-sm ${tier === 'validation' ? 'ring-2 ring-purple-500' : ''}`}>
              <CardHeader 
                className="cursor-pointer" 
                onClick={() => toggleSection('validation')}
              >
                <CardTitle className="flex items-center justify-between text-purple-600">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    Validation Sprint Assumptions
                    <Badge className="bg-purple-100 text-purple-800">4 Weeks • Market Tests</Badge>
                  </div>
                  {expandedSections.validation ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </CardTitle>
                <CardDescription>
                  Validate through market tests, beta programs, and leading indicators like conversion rates and user engagement
                </CardDescription>
              </CardHeader>
              
              {expandedSections.validation && (
                <CardContent>
                  <div className="space-y-4">
                    {validationAssumptions.map((assumption) => renderAssumption(assumption))}
                    {validationAssumptions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No validation assumptions generated yet. Click "Run Analysis" to generate tier-specific assumptions.</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
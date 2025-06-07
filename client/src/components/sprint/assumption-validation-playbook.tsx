import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, CheckCircle, Target, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AssumptionValidationPlaybookProps {
  sprintId: number;
  intakeData?: any;
}

export default function AssumptionValidationPlaybook({ sprintId, intakeData }: AssumptionValidationPlaybookProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modules, refetch } = useQuery({
    queryKey: ['/api/sprints', sprintId, 'modules'],
    staleTime: 0,
    gcTime: 0
  });
  
  const module = modules?.find((m: any) => m.moduleType === 'assumptions');

  const generateMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("POST", `/api/sprints/${sprintId}/generate-assumption-playbook`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sprints', sprintId, 'modules'] });
      refetch();
      toast({
        title: "Assumption Playbook Generated",
        description: "Comprehensive validation strategies ready for each sprint tier."
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate assumption validation playbook.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  const playbook = module?.aiAnalysis?.playbook || '';
  const isCompleted = module?.isCompleted;
  
  // Debug logging
  console.log('AssumptionValidationPlaybook debug:', {
    modulesArray: modules,
    modulesLength: modules?.length,
    moduleExists: !!module,
    aiAnalysisExists: !!module?.aiAnalysis,
    playbookExists: !!playbook,
    playbookLength: playbook?.length,
    isCompleted,
    moduleType: module?.moduleType,
    allModuleTypes: modules?.map(m => m.moduleType)
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(playbook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Assumption validation playbook copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const hasRequiredData = intakeData && 
    intakeData.assumption1 && intakeData.assumption2 && intakeData.assumption3 &&
    intakeData.partnershipRisk1 && intakeData.partnershipRisk2 && intakeData.partnershipRisk3 && 
    intakeData.partnershipRisk4 && intakeData.partnershipRisk5;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Assumption & Risk Validation Playbook
            <div className="flex gap-2">
              {playbook && (
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
                      Copy Playbook
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={isGenerating || !hasRequiredData}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Playbook'
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasRequiredData && !isGenerating && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Ready to Generate Validation Playbook</p>
              <p className="text-sm mb-4">
                Requires 3 assumptions and 5 risks from Initial Intake to create comprehensive validation strategies.
              </p>
              {intakeData?.assumptions?.length < 3 && (
                <p className="text-sm text-orange-600">
                  Missing assumptions: {intakeData?.assumptions?.length || 0}/3 provided
                </p>
              )}
              {intakeData?.risks?.length < 5 && (
                <p className="text-sm text-orange-600">
                  Missing risks: {intakeData?.risks?.length || 0}/5 provided
                </p>
              )}
            </div>
          )}

          {hasRequiredData && !playbook && !isGenerating && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Ready to Generate Validation Playbook</p>
              <p className="text-sm">
                Click "Generate Playbook" to create detailed validation strategies for each assumption and risk, 
                with specific approaches for Discovery ($5K), Feasibility ($15K), and Validation ($35K) sprint tiers.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Generating Assumption Validation Playbook...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Creating validation strategies for {intakeData?.assumptions?.length} assumptions and {intakeData?.risks?.length} risks 
                across Discovery, Feasibility, and Validation sprint tiers. This may take 30-45 seconds.
              </p>
            </div>
          )}

          {playbook && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Validation Playbook Ready</h4>
                <p className="text-sm text-green-700">
                  Comprehensive 1,800+ word validation playbook with specific testing strategies for each sprint tier. 
                  Includes desk research approaches, interview guides, and decision criteria.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-900 overflow-x-auto">
                  {playbook}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Download, MessageSquare } from 'lucide-react';
import ResponseDistribution from './response-distribution';
import KeyInsights from './key-insights';
import ObjectionsFeedback from './objections-feedback';
import PersonaAnalysis from './persona-analysis';
import AIRecommendations from './ai-recommendations';
import CommentsSection from './comments-section';

interface MarketSimulationProps {
  sprintId: number;
}

export default function MarketSimulation({ sprintId }: MarketSimulationProps) {
  const { data: modules, isLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
  });

  const module = modules?.find((m: any) => m.moduleType === 'market_simulation');

  if (isLoading || !module?.aiAnalysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-text">Market Simulation Results</h1>
            <p className="text-gray-600 mt-1">LaunchClarity Analysis Engine insights</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const analysisData = module.aiAnalysis;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-text">Market Simulation Results</h1>
          <p className="text-gray-600 mt-1">LaunchClarity Analysis Engine insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </Button>
          <Button className="bg-primary hover:bg-primary-dark flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Add Comment</span>
          </Button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResponseDistribution data={analysisData.responseDistribution} />
        </div>
        <div>
          <KeyInsights data={analysisData.keyInsights} />
        </div>
      </div>

      {/* Detailed Feedback */}
      <ObjectionsFeedback 
        objections={analysisData.topObjections}
        positiveSignals={analysisData.positiveSignals}
      />

      {/* Persona Analysis */}
      <PersonaAnalysis data={analysisData.personaAnalysis} />

      {/* AI Recommendations */}
      <AIRecommendations data={analysisData.recommendations} />

      {/* Comments Section */}
      <CommentsSection sprintId={sprintId} moduleId={module.id} />
    </div>
  );
}

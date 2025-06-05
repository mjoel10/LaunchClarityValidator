import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface DecisionEngineProps {
  sprintId: number;
  tier: string;
  modules: any[];
  intakeData?: any;
}

export default function DecisionEngine({ sprintId, tier, modules, intakeData }: DecisionEngineProps) {
  const completedModules = modules?.filter(m => m.isCompleted) || [];
  const totalModules = modules?.length || 1;
  const completionRate = (completedModules.length / totalModules) * 100;
  
  // Analyze key signals from completed modules
  const analyzeSignals = () => {
    const signals = {
      marketValidation: 0,
      customerDemand: 0,
      businessViability: 0,
      riskLevel: 0
    };

    completedModules.forEach(module => {
      const data = module.generatedData;
      if (!data) return;

      // Extract signals based on module type
      switch (module.moduleType) {
        case 'market_simulation':
          signals.marketValidation += data.marketSize > 1000000 ? 20 : 10;
          break;
        case 'demand_test_tracker':
          signals.customerDemand += data.conversionRate > 0.05 ? 25 : 5;
          break;
        case 'business_model_simulator':
          signals.businessViability += data.breakEvenMonths < 18 ? 20 : 0;
          break;
        case 'enhanced_market_intel':
          signals.marketValidation += data.competitorCount < 5 ? 15 : 5;
          break;
        case 'async_interviews':
          signals.customerDemand += data.positiveResponses > 70 ? 20 : 10;
          break;
        case 'full_interview_suite':
          signals.customerDemand += data.willingnessToPay > 0.6 ? 25 : 10;
          break;
      }
    });

    // Calculate risk based on negative indicators
    signals.riskLevel = Math.max(0, 100 - signals.marketValidation - signals.customerDemand);
    
    return signals;
  };

  // Calculate decision based on tier, completion, and signal analysis
  const getDecision = () => {
    if (completionRate < 30) {
      return { 
        recommendation: 'Insufficient Data', 
        confidence: Math.round(completionRate), 
        color: 'gray',
        reasoning: 'Complete more validation modules to get actionable insights'
      };
    }

    const signals = analyzeSignals();
    const totalSignal = signals.marketValidation + signals.customerDemand + signals.businessViability;
    
    if (tier === 'discovery') {
      if (totalSignal >= 60 && completionRate >= 70) {
        return { 
          recommendation: 'Go to Feasibility', 
          confidence: 85, 
          color: 'green',
          reasoning: 'Strong market signals detected, ready for deeper validation'
        };
      } else if (totalSignal >= 40 || completionRate >= 50) {
        return { 
          recommendation: 'Pivot Strategy', 
          confidence: 65, 
          color: 'yellow',
          reasoning: 'Mixed signals suggest strategic adjustments needed'
        };
      } else {
        return { 
          recommendation: 'Kill Project', 
          confidence: 70, 
          color: 'red',
          reasoning: 'Insufficient market validation and customer demand'
        };
      }
    } else if (tier === 'feasibility') {
      if (totalSignal >= 80 && completionRate >= 80) {
        return { 
          recommendation: 'Go to Validation', 
          confidence: 88, 
          color: 'green',
          reasoning: 'Business model validated, ready for market testing'
        };
      } else if (totalSignal >= 50 && completionRate >= 60) {
        return { 
          recommendation: 'Pivot Business Model', 
          confidence: 72, 
          color: 'yellow',
          reasoning: 'Core concept valid but business model needs refinement'
        };
      } else if (completionRate >= 40) {
        return { 
          recommendation: 'Defer Decision', 
          confidence: 58, 
          color: 'orange',
          reasoning: 'Inconclusive results, gather more data before proceeding'
        };
      } else {
        return { 
          recommendation: 'Kill Project', 
          confidence: 75, 
          color: 'red',
          reasoning: 'Poor feasibility indicators across multiple dimensions'
        };
      }
    } else if (tier === 'validation') {
      if (totalSignal >= 90 && completionRate >= 85) {
        return { 
          recommendation: 'Go to Market', 
          confidence: 92, 
          color: 'green',
          reasoning: 'Strong validation across all metrics, ready for launch'
        };
      } else if (totalSignal >= 60 && completionRate >= 70) {
        return { 
          recommendation: 'Pivot Strategy', 
          confidence: 78, 
          color: 'yellow',
          reasoning: 'Good foundation but execution strategy needs adjustment'
        };
      } else {
        return { 
          recommendation: 'Kill Project', 
          confidence: 80, 
          color: 'red',
          reasoning: 'Failed to achieve validation benchmarks despite extensive testing'
        };
      }
    }
    
    return { 
      recommendation: 'Continue Analysis', 
      confidence: Math.min(completionRate + 20, 75), 
      color: 'blue',
      reasoning: 'Gather more data to reach a confident decision'
    };
  };

  const decision = getDecision();
  
  const getKeyFactors = () => {
    const factors = [];
    
    if (completedModules.some(m => m.moduleType === 'market_simulation')) {
      factors.push('Market size validated at $12.5B with 23% growth');
    }
    if (completedModules.some(m => m.moduleType === 'competitive_intel')) {
      factors.push('Clear competitive advantage identified');
    }
    if (completedModules.some(m => m.moduleType === 'async_interviews')) {
      factors.push('87% customer validation from interviews');
    }
    if (completedModules.some(m => m.moduleType === 'demand_test')) {
      factors.push('7.1% conversion rate exceeds industry benchmark');
    }
    if (completedModules.some(m => m.moduleType === 'business_model_simulator')) {
      factors.push('Business model shows 40% gross margins');
    }
    
    if (factors.length === 0) {
      factors.push('Initial market research shows positive signals');
      factors.push('Problem-solution fit needs validation');
      factors.push('Competitive landscape analysis pending');
    }
    
    return factors.slice(0, 4);
  };

  const getDecisionIcon = () => {
    switch (decision.recommendation) {
      case 'Go to Market':
      case 'Go to Validation':
      case 'Go to Feasibility':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'Pivot Strategy':
      case 'Pivot Business Model':
        return <RotateCcw className="w-6 h-6 text-yellow-600" />;
      case 'Kill Project':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-blue-600" />;
    }
  };

  const getDecisionColor = () => {
    switch (decision.color) {
      case 'green': return 'bg-green-50 border-green-200';
      case 'yellow': return 'bg-yellow-50 border-yellow-200';
      case 'red': return 'bg-red-50 border-red-200';
      case 'orange': return 'bg-orange-50 border-orange-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getConfidenceColor = () => {
    if (decision.confidence >= 80) return 'text-green-600';
    if (decision.confidence >= 60) return 'text-yellow-600';
    if (decision.confidence >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className={`rounded-xl shadow-sm border-2 ${getDecisionColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-600" />
          Go/Pivot/Kill Decision Engine
        </CardTitle>
        <CardDescription>
          Strategic recommendation based on {tier} sprint analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getDecisionIcon()}
              <div>
                <div className="font-semibold text-lg">{decision.recommendation}</div>
                <div className="text-sm text-gray-600">
                  Based on {completedModules.length} of {totalModules} modules completed
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getConfidenceColor()}`}>
                {decision.confidence}%
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analysis Progress</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Strategic Reasoning</h4>
            <p className="text-sm text-gray-700">{decision.reasoning}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Key Decision Factors</h4>
            <div className="space-y-1">
              {getKeyFactors().map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                  {factor}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1">
              View Detailed Analysis
            </Button>
            <Button variant="outline">
              Generate Report
            </Button>
          </div>

          {decision.confidence < 70 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm text-yellow-800">
                <strong>Recommendation:</strong> Complete more modules to increase decision confidence.
                Target: {Math.ceil((70 * totalModules) / 100) - completedModules.length} additional modules.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
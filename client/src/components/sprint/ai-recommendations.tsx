import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb, Bot } from 'lucide-react';

interface AIRecommendationsProps {
  data: {
    immediateActions: string[];
    strategicPivots: string[];
  };
}

export default function AIRecommendations({ data }: AIRecommendationsProps) {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold mb-2">
              LaunchClarity Analysis Engine Recommendations
            </CardTitle>
            <p className="text-blue-100 text-sm">
              Based on 127 synthetic market responses and validation data
            </p>
          </div>
          <Bot className="w-6 h-6 text-blue-200" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Immediate Actions</h4>
            <ul className="space-y-2">
              {data.immediateActions.map((action, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-blue-200 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Strategic Pivots</h4>
            <ul className="space-y-2">
              {data.strategicPivots.map((pivot, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-blue-200 flex-shrink-0" />
                  <span>{pivot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

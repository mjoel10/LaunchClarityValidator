import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, TriangleAlert, Lightbulb } from 'lucide-react';

interface KeyInsightsProps {
  data: Array<{
    type: 'positive' | 'warning' | 'insight';
    title: string;
    description: string;
  }>;
}

export default function KeyInsights({ data }: KeyInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <TriangleAlert className="w-4 h-4 text-warning" />;
      case 'insight':
        return <Lightbulb className="w-4 h-4 text-info" />;
      default:
        return <Lightbulb className="w-4 h-4 text-info" />;
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'insight':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextStyle = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'insight':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  const getDescriptionStyle = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'insight':
        return 'text-blue-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((insight, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${getInsightStyle(insight.type)}`}
            >
              <div className="flex items-start space-x-2">
                {getInsightIcon(insight.type)}
                <div>
                  <p className={`text-sm font-medium ${getTextStyle(insight.type)}`}>
                    {insight.title}
                  </p>
                  <p className={`text-xs mt-1 ${getDescriptionStyle(insight.type)}`}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

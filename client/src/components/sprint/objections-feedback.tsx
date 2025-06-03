import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ObjectionsFeedbackProps {
  objections: Array<{
    text: string;
    persona: string;
    category: string;
  }>;
  positiveSignals: Array<{
    text: string;
    persona: string;
    category: string;
  }>;
}

export default function ObjectionsFeedback({ objections, positiveSignals }: ObjectionsFeedbackProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Price': 'bg-red-100 text-red-700',
      'Competition': 'bg-red-100 text-red-700',
      'Usability': 'bg-yellow-100 text-yellow-700',
      'Pain Point': 'bg-green-100 text-green-700',
      'Value': 'bg-green-100 text-green-700',
      'Technical': 'bg-blue-100 text-blue-700',
    } as const;
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Objections */}
      <Card>
        <CardHeader>
          <CardTitle>Top Objections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objections.map((objection, index) => (
              <div key={index} className="border-l-4 border-error pl-4 py-2">
                <p className="text-sm font-medium text-gray-800">
                  "{objection.text}"
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{objection.persona}</span>
                  <Badge variant="outline" className={getCategoryColor(objection.category)}>
                    {objection.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Positive Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Positive Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positiveSignals.map((signal, index) => (
              <div key={index} className="border-l-4 border-success pl-4 py-2">
                <p className="text-sm font-medium text-gray-800">
                  "{signal.text}"
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{signal.persona}</span>
                  <Badge variant="outline" className={getCategoryColor(signal.category)}>
                    {signal.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResponseDistributionProps {
  data: {
    negative: number;
    skeptical: number;
    interested: number;
    enthusiastic: number;
    totalResponses: number;
  };
}

export default function ResponseDistribution({ data }: ResponseDistributionProps) {
  const responses = [
    { 
      label: 'Negative', 
      percentage: data.negative, 
      color: 'bg-error',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    { 
      label: 'Skeptical', 
      percentage: data.skeptical, 
      color: 'bg-warning',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    { 
      label: 'Interested', 
      percentage: data.interested, 
      color: 'bg-info',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    { 
      label: 'Enthusiastic', 
      percentage: data.enthusiastic, 
      color: 'bg-success',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Response Distribution</span>
          <span className="text-sm text-gray-500 font-normal">
            {data.totalResponses} synthetic responses
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {responses.map((response) => (
            <div key={response.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${response.color} rounded`} />
                <span className="text-sm font-medium">{response.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={response.percentage} className="w-32 h-2" />
                <span className="text-sm font-semibold w-10 text-right">
                  {response.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

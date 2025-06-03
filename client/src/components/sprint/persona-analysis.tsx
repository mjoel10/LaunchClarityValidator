import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface PersonaAnalysisProps {
  data: Array<{
    name: string;
    description: string;
    interestLevel: number;
    priceSensitivity: 'High' | 'Medium' | 'Low' | 'N/A';
    quote: string;
    color: string;
  }>;
}

export default function PersonaAnalysis({ data }: PersonaAnalysisProps) {
  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInterestLevelLabel = (level: number) => {
    if (level >= 75) return 'High';
    if (level >= 50) return 'Medium';
    return 'Low';
  };

  const getInterestLevelColor = (level: number) => {
    if (level >= 75) return 'bg-success';
    if (level >= 50) return 'bg-warning';
    return 'bg-info';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persona Response Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((persona, index) => (
            <div key={index} className="border border-neutral-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 ${persona.color} rounded-full flex items-center justify-center`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">{persona.name}</h4>
                  <p className="text-sm text-gray-500">{persona.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interest Level</span>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={persona.interestLevel} 
                      className="w-16 h-2"
                    />
                    <span className="text-xs w-12">
                      {getInterestLevelLabel(persona.interestLevel)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price Sensitivity</span>
                  <Badge 
                    variant="outline" 
                    className={getSensitivityColor(persona.priceSensitivity)}
                  >
                    {persona.priceSensitivity}
                  </Badge>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-gray-600 italic">
                    "{persona.quote}"
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

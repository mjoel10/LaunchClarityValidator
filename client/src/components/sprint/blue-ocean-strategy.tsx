import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Waves, Target, Lightbulb, TrendingUp } from 'lucide-react';

interface BlueOceanStrategyProps {
  sprintId: number;
  intakeData?: any;
}

export default function BlueOceanStrategy({ sprintId, intakeData }: BlueOceanStrategyProps) {
  const framework = {
    eliminate: [
      'Complex onboarding processes',
      'Excessive feature bloat',
      'Manual configuration requirements',
      'Platform-specific limitations'
    ],
    reduce: [
      'Implementation time from weeks to days',
      'Learning curve through intuitive design',
      'Cost per user by 40%',
      'Support tickets via self-service'
    ],
    raise: [
      'Integration capabilities beyond competitors',
      'User experience standards',
      'Automation and AI features',
      'Security and compliance measures'
    ],
    create: [
      'No-code workflow builder',
      'Real-time collaboration features',
      'Predictive analytics dashboard',
      'Industry-specific templates'
    ]
  };

  const opportunities = [
    {
      title: 'Untapped SMB Market',
      description: 'Enterprise-grade features at SMB prices',
      potential: 'High',
      timeline: '6-9 months'
    },
    {
      title: 'Industry-Specific Solutions',
      description: 'Vertical-specific workflow templates',
      potential: 'Medium',
      timeline: '9-12 months'
    },
    {
      title: 'AI-First Approach',
      description: 'Built-in intelligence vs bolt-on AI',
      potential: 'High',
      timeline: '12-18 months'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Waves className="w-6 h-6 text-blue-600" />
            Blue Ocean Strategy Canvas
          </CardTitle>
          <CardDescription>
            Strategic framework to create uncontested market space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Eliminate
                </h4>
                <div className="space-y-2">
                  {framework.eliminate.map((item, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-800">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 rotate-180" />
                  Reduce
                </h4>
                <div className="space-y-2">
                  {framework.reduce.map((item, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-sm text-orange-800">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Raise
                </h4>
                <div className="space-y-2">
                  {framework.raise.map((item, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Create
                </h4>
                <div className="space-y-2">
                  {framework.create.map((item, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Blue Ocean Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{opportunity.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      opportunity.potential === 'High' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {opportunity.potential} Potential
                    </Badge>
                    <Badge variant="outline">{opportunity.timeline}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{opportunity.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Primary Focus: SMB Market Entry</h4>
              <p className="text-sm text-blue-700 mt-1">Target underserved SMB segment with enterprise-grade features at accessible pricing</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Differentiation Strategy</h4>
              <p className="text-sm text-green-700 mt-1">Lead with no-code capabilities and AI-first approach to create clear market separation</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900">Value Innovation</h4>
              <p className="text-sm text-purple-700 mt-1">Combine cost reduction with feature enhancement to break value-cost trade-off</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
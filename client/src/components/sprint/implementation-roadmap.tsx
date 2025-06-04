import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImplementationRoadmapProps {
  sprintId: number;
  intakeData?: any;
}

export default function ImplementationRoadmap({ sprintId, intakeData }: ImplementationRoadmapProps) {
  const phases = [
    {
      phase: 'Phase 1: Foundation',
      duration: '4-6 weeks',
      status: 'ready',
      progress: 0,
      milestones: [
        'MVP development and testing',
        'Core team hiring (3-4 people)',
        'Initial customer validation',
        'Basic infrastructure setup'
      ],
      resources: ['2 developers', '1 designer', '1 PM'],
      budget: '$150k'
    },
    {
      phase: 'Phase 2: Market Entry',
      duration: '8-10 weeks',
      status: 'planned',
      progress: 0,
      milestones: [
        'Beta customer onboarding',
        'Marketing website launch',
        'Sales process optimization',
        'Customer feedback integration'
      ],
      resources: ['4 developers', '2 marketers', '1 sales'],
      budget: '$280k'
    },
    {
      phase: 'Phase 3: Scale',
      duration: '12-16 weeks',
      status: 'planned',
      progress: 0,
      milestones: [
        'Enterprise features development',
        'Partnership program launch',
        'International expansion prep',
        'Series A fundraising'
      ],
      resources: ['8 developers', '3 marketers', '2 sales'],
      budget: '$650k'
    }
  ];

  const risks = [
    {
      risk: 'Key talent acquisition delays',
      impact: 'High',
      probability: 'Medium',
      mitigation: 'Start recruiting immediately, consider contractors'
    },
    {
      risk: 'Technical complexity underestimated',
      impact: 'High',
      probability: 'Low',
      mitigation: 'Detailed technical planning, phased approach'
    },
    {
      risk: 'Market timing shifts',
      impact: 'Medium',
      probability: 'Medium',
      mitigation: 'Agile development, regular market checks'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            Implementation Roadmap
          </CardTitle>
          <CardDescription>
            Strategic execution plan with timelines, milestones, and resource allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div key={index} className="p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{phase.phase}</h4>
                    <Badge className={
                      phase.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {phase.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {phase.duration}
                    </div>
                    <div className="font-medium">{phase.budget}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h5>
                    <div className="space-y-1">
                      {phase.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-3 h-3 text-gray-400" />
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Required Resources</h5>
                    <div className="space-y-1">
                      {phase.resources.map((resource, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Users className="w-3 h-3 text-gray-400" />
                          {resource}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Progress value={phase.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            Risk Assessment & Mitigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className="p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{risk.risk}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {risk.impact} Impact
                    </Badge>
                    <Badge variant="outline">{risk.probability} Probability</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Mitigation: </span>
                  {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Key Success Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Phase 1 Goals</h4>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• 10 beta customers</li>
                <li>• $50k MRR</li>
                <li>• 4.5+ NPS score</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Phase 2 Goals</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• 100 paying customers</li>
                <li>• $250k MRR</li>
                <li>• 15% market penetration</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900">Phase 3 Goals</h4>
              <ul className="text-sm text-purple-700 mt-2 space-y-1">
                <li>• 500+ customers</li>
                <li>• $1M+ ARR</li>
                <li>• Series A ready</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
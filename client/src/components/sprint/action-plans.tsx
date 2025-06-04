import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Clock, Users, Target } from 'lucide-react';

interface ActionPlansProps {
  sprintId: number;
  intakeData?: any;
}

export default function ActionPlans({ sprintId, intakeData }: ActionPlansProps) {
  const actionPlan = {
    days0to30: [
      {
        task: 'Finalize MVP feature set and development plan',
        owner: 'Product Team',
        status: 'in_progress',
        priority: 'high',
        deadline: '2024-07-15'
      },
      {
        task: 'Hire 2 senior developers and 1 designer',
        owner: 'HR Team',
        status: 'pending',
        priority: 'high',
        deadline: '2024-07-20'
      },
      {
        task: 'Set up development infrastructure and CI/CD',
        owner: 'Engineering',
        status: 'pending',
        priority: 'medium',
        deadline: '2024-07-25'
      },
      {
        task: 'Create detailed user personas and journey maps',
        owner: 'Marketing',
        status: 'pending',
        priority: 'medium',
        deadline: '2024-07-30'
      }
    ],
    days31to60: [
      {
        task: 'Complete MVP development and internal testing',
        owner: 'Engineering',
        status: 'planned',
        priority: 'high',
        deadline: '2024-08-15'
      },
      {
        task: 'Launch beta program with 10 target customers',
        owner: 'Sales Team',
        status: 'planned',
        priority: 'high',
        deadline: '2024-08-20'
      },
      {
        task: 'Develop marketing website and content strategy',
        owner: 'Marketing',
        status: 'planned',
        priority: 'medium',
        deadline: '2024-08-25'
      },
      {
        task: 'Establish customer feedback collection process',
        owner: 'Product Team',
        status: 'planned',
        priority: 'medium',
        deadline: '2024-08-30'
      }
    ],
    days61to90: [
      {
        task: 'Analyze beta feedback and iterate on product',
        owner: 'Product Team',
        status: 'planned',
        priority: 'high',
        deadline: '2024-09-10'
      },
      {
        task: 'Launch public marketing campaigns',
        owner: 'Marketing',
        status: 'planned',
        priority: 'high',
        deadline: '2024-09-15'
      },
      {
        task: 'Onboard first 25 paying customers',
        owner: 'Sales Team',
        status: 'planned',
        priority: 'high',
        deadline: '2024-09-25'
      },
      {
        task: 'Prepare Series A fundraising materials',
        owner: 'Executive Team',
        status: 'planned',
        priority: 'medium',
        deadline: '2024-09-30'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderActionItems = (items: any[], title: string) => (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{item.task}</h4>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {item.owner}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.deadline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            90-Day Action Plan
          </CardTitle>
          <CardDescription>
            Detailed execution roadmap with specific tasks, owners, and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Total Actions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-green-700">High Priority</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-orange-700">Key Teams</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {renderActionItems(actionPlan.days0to30, 'Days 1-30: Foundation')}
      {renderActionItems(actionPlan.days31to60, 'Days 31-60: Development')}
      {renderActionItems(actionPlan.days61to90, 'Days 61-90: Launch')}

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Success Metrics & KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">30-Day Targets</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Team hired</span>
                  <span className="font-medium">3 people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>MVP progress</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Infrastructure setup</span>
                  <span className="font-medium">100%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">60-Day Targets</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>MVP completion</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Beta customers</span>
                  <span className="font-medium">10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Website launch</span>
                  <span className="font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Risk Mitigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900">Hiring Delays</h4>
              <p className="text-sm text-yellow-700 mt-1">Backup plan: Engage freelancers and contractors for critical roles</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900">Technical Challenges</h4>
              <p className="text-sm text-red-700 mt-1">Mitigation: Detailed technical planning and regular architecture reviews</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Market Changes</h4>
              <p className="text-sm text-blue-700 mt-1">Strategy: Weekly market monitoring and flexible feature prioritization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
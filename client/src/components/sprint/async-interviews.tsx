import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Play, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

interface AsyncInterviewsProps {
  sprintId: number;
  intakeData?: any;
}

export default function AsyncInterviews({ sprintId, intakeData }: AsyncInterviewsProps) {
  const interviews = [
    { id: 1, participant: 'Sarah M.', status: 'completed', responses: 12, insights: 'High interest in automation features' },
    { id: 2, participant: 'Mike J.', status: 'completed', responses: 10, insights: 'Price sensitivity concerns' },
    { id: 3, participant: 'Lisa K.', status: 'in_progress', responses: 7, insights: 'Loves the user interface' },
    { id: 4, participant: 'David R.', status: 'pending', responses: 0, insights: '' },
    { id: 5, participant: 'Amy T.', status: 'pending', responses: 0, insights: '' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <Play className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {interviews.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-500">of 7 target interviews</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-xs text-gray-500">average completion rate</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-xs text-gray-500">major themes identified</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            Interview Progress
          </CardTitle>
          <CardDescription>
            Async interviews with 5-7 target customers via User Interviews platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(interview.status)}
                    <span className="font-medium">{interview.participant}</span>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    {interview.responses} responses
                  </div>
                  {interview.insights && (
                    <div className="text-sm text-blue-600 max-w-xs truncate">
                      {interview.insights}
                    </div>
                  )}
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Strong Product-Market Fit Signals</h4>
              <p className="text-sm text-green-700 mt-1">87% of participants showed high interest and would recommend to others</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900">Pricing Concerns</h4>
              <p className="text-sm text-yellow-700 mt-1">40% mentioned price as a potential barrier, suggesting tiered pricing</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Feature Requests</h4>
              <p className="text-sm text-blue-700 mt-1">Top requested features: mobile app, integrations, advanced analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
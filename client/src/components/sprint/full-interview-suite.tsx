import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Video, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

interface FullInterviewSuiteProps {
  sprintId: number;
  intakeData?: any;
}

export default function FullInterviewSuite({ sprintId, intakeData }: FullInterviewSuiteProps) {
  const interviews = [
    { id: 1, type: 'Customer Discovery', participant: 'Current Customer A', status: 'completed', duration: 45, insights: 8 },
    { id: 2, type: 'Customer Discovery', participant: 'Current Customer B', status: 'completed', duration: 38, insights: 6 },
    { id: 3, type: 'Customer Discovery', participant: 'Prospect A', status: 'completed', duration: 42, insights: 7 },
    { id: 4, type: 'Expert Interview', participant: 'Industry Expert 1', status: 'completed', duration: 60, insights: 12 },
    { id: 5, type: 'Expert Interview', participant: 'Industry Expert 2', status: 'scheduled', duration: 0, insights: 0 },
    { id: 6, type: 'Competitor Analysis', participant: 'Former Employee', status: 'scheduled', duration: 0, insights: 0 },
    { id: 7, type: 'Customer Discovery', participant: 'Lost Deal Analysis', status: 'pending', duration: 0, insights: 0 },
  ];

  const completedInterviews = interviews.filter(i => i.status === 'completed').length;
  const totalInsights = interviews.reduce((sum, i) => sum + i.insights, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedInterviews}</div>
            <div className="text-xs text-gray-500">of 15 planned interviews</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalInsights}</div>
            <div className="text-xs text-gray-500">key findings captured</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(interviews.filter(i => i.duration > 0).reduce((sum, i) => sum + i.duration, 0) / completedInterviews)}m
            </div>
            <div className="text-xs text-gray-500">per interview</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{Math.round((completedInterviews / 15) * 100)}%</div>
            <div className="text-xs text-gray-500">completion rate</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            Full Interview Suite (15+ Interviews)
          </CardTitle>
          <CardDescription>
            Comprehensive interviews across customers, prospects, experts, and competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {interview.status === 'completed' ? (
                      <Video className="w-4 h-4 text-green-600" />
                    ) : interview.status === 'scheduled' ? (
                      <Calendar className="w-4 h-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">{interview.participant}</div>
                      <div className="text-sm text-gray-600">{interview.type}</div>
                    </div>
                  </div>
                  <Badge className={
                    interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                    interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {interview.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  {interview.duration > 0 && (
                    <div className="text-sm text-gray-600">
                      {interview.duration}min
                    </div>
                  )}
                  {interview.insights > 0 && (
                    <div className="text-sm text-blue-600">
                      {interview.insights} insights
                    </div>
                  )}
                  <Button size="sm" variant="outline">
                    {interview.status === 'completed' ? 'View Notes' : 'Schedule'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Key Themes & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Strong Market Validation</h4>
              <p className="text-sm text-green-700 mt-1">All customers confirmed this is a high-priority problem worth paying for</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Feature Prioritization</h4>
              <p className="text-sm text-blue-700 mt-1">Integration capabilities ranked as most important feature by 80% of interviewees</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900">Competitive Advantage</h4>
              <p className="text-sm text-purple-700 mt-1">Unique approach to user experience provides clear differentiation from competitors</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900">Implementation Considerations</h4>
              <p className="text-sm text-yellow-700 mt-1">Enterprise customers require specific compliance features for adoption</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
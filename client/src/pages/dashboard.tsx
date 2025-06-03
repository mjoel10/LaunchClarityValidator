import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import TopNav from '@/components/navigation/top-nav';
import { CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: sprints, isLoading } = useQuery({
    queryKey: ['/api/sprints', user?.id, user?.isConsultant],
    enabled: !!user,
  });

  if (!user) {
    setLocation('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <TopNav />
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'active':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      payment_pending: 'destructive',
      draft: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTierPrice = (tier: string) => {
    const prices = {
      discovery: '$5,000',
      feasibility: '$15,000',
      validation: '$35,000',
    } as const;
    return prices[tier as keyof typeof prices] || '';
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-text">
              {user.isConsultant ? 'Sprint Dashboard' : 'My Sprints'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user.isConsultant 
                ? 'Manage all active validation sprints' 
                : 'Track your validation sprint progress'}
            </p>
          </div>
          {user.isConsultant && (
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Sprint
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints?.map((sprint: any) => (
            <Card 
              key={sprint.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation(`/sprints/${sprint.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sprint.companyName}</CardTitle>
                  {getStatusIcon(sprint.status)}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {sprint.tier} Sprint
                  </Badge>
                  <span className="text-sm font-medium text-primary">
                    {getTierPrice(sprint.tier)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(sprint.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{sprint.progress}%</span>
                  </div>
                  <Progress value={sprint.progress} className="h-2" />
                </div>

                {sprint.client && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Client</span>
                    <span className="text-sm font-medium">{sprint.client.name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(sprint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!sprints || sprints.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No sprints yet</h3>
              <p className="text-muted-foreground mb-4">
                {user.isConsultant 
                  ? 'Create your first sprint to get started with client validation.' 
                  : 'Your validation sprints will appear here once created.'}
              </p>
              {user.isConsultant && (
                <Button className="bg-primary hover:bg-primary-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Sprint
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

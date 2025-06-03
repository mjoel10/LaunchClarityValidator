import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SprintInfoCardProps {
  sprint: any;
}

export default function SprintInfoCard({ sprint }: SprintInfoCardProps) {
  const getTierPrice = (tier: string) => {
    const prices = {
      discovery: '$5,000',
      feasibility: '$15,000',
      validation: '$35,000',
    } as const;
    return prices[tier as keyof typeof prices] || '';
  };

  const getTierDuration = (tier: string) => {
    const durations = {
      discovery: '1 Week',
      feasibility: '2 Weeks',
      validation: '4 Weeks',
    } as const;
    return durations[tier as keyof typeof durations] || '';
  };

  const getNextMilestone = () => {
    // This would be calculated based on current module progress
    return "Interview Analysis";
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Sprint Type</h3>
            <p className="text-lg font-semibold text-primary capitalize">
              {sprint.tier} Sprint
            </p>
            <Badge variant="outline" className="mt-1">
              {getTierPrice(sprint.tier)}
            </Badge>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Timeline</h3>
            <p className="text-lg font-semibold">{getTierDuration(sprint.tier)}</p>
            <span className="text-xs text-gray-500">
              Started {new Date(sprint.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Progress</h3>
            <p className="text-lg font-semibold text-secondary">{sprint.progress}% Complete</p>
            <span className="text-xs text-gray-500">4 of 6 modules</span>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Next Milestone</h3>
            <p className="text-lg font-semibold">{getNextMilestone()}</p>
            <span className="text-xs text-warning">Due in 3 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

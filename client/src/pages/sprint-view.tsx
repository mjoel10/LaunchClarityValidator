import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import TopNav from '@/components/navigation/top-nav';
import Sidebar from '@/components/navigation/sidebar';
import MarketSimulation from '@/components/sprint/market-simulation';
import SprintInfoCard from '@/components/sprint/sprint-info-card';

export default function SprintView() {
  const params = useParams();
  const { user } = useAuth();
  const sprintId = Number(params.id);

  const { data: sprint, isLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
    enabled: !!sprintId,
  });

  const { data: modules } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/modules`],
    enabled: !!sprintId,
  });

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

  if (!sprint) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <TopNav />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Sprint not found</h2>
            <p className="text-muted-foreground">The requested sprint could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <TopNav selectedSprint={sprint} />
      
      <div className="flex">
        <Sidebar sprint={sprint} modules={modules || []} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <SprintInfoCard sprint={sprint} />
            
            {/* Main content area - currently showing Market Simulation */}
            <MarketSimulation sprintId={sprintId} />
          </div>
        </main>
      </div>
    </div>
  );
}

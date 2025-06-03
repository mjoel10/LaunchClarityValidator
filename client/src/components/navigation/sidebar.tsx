import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Lock, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  sprint: any;
  modules: any[];
}

const moduleConfig = {
  discovery: [
    { key: 'intake', title: 'Intake Form', icon: '📋', section: 'Setup' },
    { key: 'market_simulation', title: 'Market Simulation', icon: '👥', section: 'Discovery' },
    { key: 'assumptions', title: 'Assumptions', icon: '🎯', section: 'Discovery' },
    { key: 'competitive_intel', title: 'Competitive Intel', icon: '♟', section: 'Discovery' },
    { key: 'market_sizing', title: 'Market Sizing', icon: '📊', section: 'Discovery' },
    { key: 'risk_assessment', title: 'Risk Assessment', icon: '🛡', section: 'Discovery' },
    { key: 'go_defer_decision', title: 'Go/Defer Decision', icon: '⚖', section: 'Decision' },
  ],
  feasibility: [
    { key: 'intake', title: 'Intake Form', icon: '📋', section: 'Setup' },
    { key: 'market_simulation', title: 'Market Simulation', icon: '👥', section: 'Discovery' },
    { key: 'assumptions', title: 'Assumptions', icon: '🎯', section: 'Discovery' },
    { key: 'competitive_intel', title: 'Competitive Intel', icon: '♟', section: 'Discovery' },
    { key: 'market_sizing', title: 'Market Sizing', icon: '📊', section: 'Discovery' },
    { key: 'risk_assessment', title: 'Risk Assessment', icon: '🛡', section: 'Discovery' },
    { key: 'async_interviews', title: 'Async Interviews', icon: '🎤', section: 'Validation' },
    { key: 'demand_test', title: 'Demand Test', icon: '🧪', section: 'Validation' },
    { key: 'business_model', title: 'Business Model', icon: '🧮', section: 'Validation' },
    { key: 'channel_recommender', title: 'Channel Recommender', icon: '📤', section: 'Validation' },
    { key: 'go_pivot_defer', title: 'Go/Pivot/Defer', icon: '⚖', section: 'Decision' },
  ],
  validation: [
    { key: 'intake', title: 'Intake Form', icon: '📋', section: 'Setup' },
    { key: 'market_simulation', title: 'Market Simulation', icon: '👥', section: 'Discovery' },
    { key: 'assumptions', title: 'Assumptions', icon: '🎯', section: 'Discovery' },
    { key: 'competitive_intel', title: 'Competitive Intel', icon: '♟', section: 'Discovery' },
    { key: 'market_sizing', title: 'Market Sizing', icon: '📊', section: 'Discovery' },
    { key: 'risk_assessment', title: 'Risk Assessment', icon: '🛡', section: 'Discovery' },
    { key: 'full_interviews', title: 'Full Interview Suite', icon: '🎤', section: 'Validation' },
    { key: 'multi_channel_tests', title: 'Multi-Channel Tests', icon: '🧪', section: 'Validation' },
    { key: 'enhanced_market_intel', title: 'Enhanced Market Intel', icon: '📈', section: 'Validation' },
    { key: 'strategic_analysis', title: 'Strategic Analysis', icon: '🧠', section: 'Validation' },
    { key: 'go_pivot_kill', title: 'Go/Pivot/Kill Engine', icon: '⚖', section: 'Decision' },
  ],
};

export default function Sidebar({ sprint, modules }: SidebarProps) {
  const tierModules = moduleConfig[sprint.tier as keyof typeof moduleConfig] || [];
  
  const getModuleStatus = (moduleKey: string) => {
    const module = modules.find(m => m.moduleType === moduleKey);
    if (!module) return 'locked';
    if (module.isCompleted) return 'completed';
    if (module.isLocked) return 'locked';
    return 'in_progress';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress':
        return <TriangleAlert className="w-4 h-4 text-warning" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-accent" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const completedModules = modules.filter(m => m.isCompleted).length;
  const totalModules = tierModules.length;
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const groupedModules = tierModules.reduce((acc, module) => {
    const section = module.section;
    if (!acc[section]) acc[section] = [];
    acc[section].push(module);
    return acc;
  }, {} as Record<string, typeof tierModules>);

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-neutral-border">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Sprint Progress
            </h3>
            <Badge variant={sprint.status === 'active' ? 'default' : 'secondary'}>
              {sprint.status === 'active' ? 'Active' : sprint.status}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {completedModules} of {totalModules} modules completed
          </p>
        </div>

        <nav className="space-y-4">
          {Object.entries(groupedModules).map(([section, sectionModules]) => (
            <div key={section} className="mb-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section}
              </h4>
              <div className="space-y-1">
                {sectionModules.map((module) => {
                  const status = getModuleStatus(module.key);
                  const isActive = status === 'in_progress';
                  const isLocked = status === 'locked';
                  
                  return (
                    <button
                      key={module.key}
                      className={cn(
                        "flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-left transition-colors",
                        isActive && "text-primary bg-blue-50",
                        !isActive && !isLocked && "text-gray-700 hover:text-primary hover:bg-blue-50",
                        isLocked && "text-gray-400 cursor-not-allowed"
                      )}
                      disabled={isLocked}
                    >
                      <span className="w-4 h-4 text-center">{module.icon}</span>
                      <span className="text-sm font-medium flex-1">{module.title}</span>
                      {getStatusIcon(status)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Lock, TriangleAlert, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  sprint: any;
  modules: any[];
}

const moduleConfig = {
  discovery: [
    // Setup Section
    { key: 'intake', title: 'Initial Intake', icon: '📋', section: 'Setup', tier: 'discovery' },
    { key: 'assumptions', title: 'Assumption Tracker', icon: '🎯', section: 'Setup', tier: 'discovery' },
    
    // Discovery Section (Core AI Analysis)
    { key: 'market_sizing', title: 'Market Sizing Analysis', icon: '📊', section: 'Discovery', tier: 'discovery' },
    { key: 'competitive_intel', title: 'Competitive Intelligence', icon: '♟', section: 'Discovery', tier: 'discovery' },
    { key: 'risk_assessment', title: 'Risk Assessment', icon: '🛡', section: 'Discovery', tier: 'discovery' },
    { key: 'market_simulation', title: 'AI Market Simulation', icon: '👥', section: 'Discovery', tier: 'discovery' },
    { key: 'swot_analysis', title: 'SWOT Analysis', icon: '⚖', section: 'Discovery', tier: 'discovery' },
    
    // Locked Features (Visible but disabled)
    { key: 'async_interviews', title: 'Async Interviews', icon: '🎤', section: 'Validation', tier: 'feasibility', locked: true },
    { key: 'demand_test', title: 'Demand Test', icon: '🧪', section: 'Validation', tier: 'feasibility', locked: true },
    { key: 'business_model_simulator', title: 'Business Model Simulator', icon: '🧮', section: 'Strategic', tier: 'feasibility', locked: true },
    { key: 'channel_recommender', title: 'Channel Recommender', icon: '📤', section: 'Strategic', tier: 'feasibility', locked: true },
    { key: 'full_interviews', title: 'Full Interview Suite', icon: '🎯', section: 'Validation', tier: 'validation', locked: true },
    { key: 'multi_channel_tests', title: 'Multi-Channel Tests', icon: '🔬', section: 'Validation', tier: 'validation', locked: true },
    { key: 'strategic_analysis', title: 'Strategic Analysis Tools', icon: '🧠', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'battlecards', title: 'Competitive Battlecards', icon: '⚔', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'implementation_roadmap', title: 'Implementation Roadmap', icon: '🗺', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'action_plans', title: '90-Day Action Plan', icon: '📝', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'partnership_evaluation', title: 'Partnership Evaluation', icon: '🤝', section: 'Strategic', tier: 'validation', locked: true },
    
    // Decision Section
    { key: 'go_defer_decision', title: 'Go/Defer Decision', icon: '🚦', section: 'Decision', tier: 'discovery' },
  ],
  feasibility: [
    // Setup Section
    { key: 'intake', title: 'Initial Intake', icon: '📋', section: 'Setup', tier: 'discovery' },
    { key: 'assumptions', title: 'Assumption Tracker', icon: '🎯', section: 'Setup', tier: 'discovery' },
    
    // Discovery Section (All unlocked)
    { key: 'market_simulation', title: 'AI Market Simulation', icon: '👥', section: 'Discovery', tier: 'discovery' },
    { key: 'competitive_intel', title: 'Competitive Intel', icon: '♟', section: 'Discovery', tier: 'discovery' },
    { key: 'market_sizing', title: 'Market Sizing', icon: '📊', section: 'Discovery', tier: 'discovery' },
    { key: 'risk_assessment', title: 'Risk Assessment', icon: '🛡', section: 'Discovery', tier: 'discovery' },
    { key: 'swot_analysis', title: 'SWOT Analysis', icon: '⚖', section: 'Discovery', tier: 'discovery' },
    
    // Validation Section (Feasibility Level)
    { key: 'async_interviews', title: 'Async Interviews', icon: '🎤', section: 'Validation', tier: 'feasibility' },
    { key: 'demand_test', title: 'Demand Test', icon: '🧪', section: 'Validation', tier: 'feasibility' },
    
    // Strategic Section (Feasibility Level)
    { key: 'business_model_simulator', title: 'Business Model Simulator', icon: '🧮', section: 'Strategic', tier: 'feasibility' },
    { key: 'channel_recommender', title: 'Channel Recommender', icon: '📤', section: 'Strategic', tier: 'feasibility' },
    
    // Locked Premium Features
    { key: 'full_interviews', title: 'Full Interview Suite', icon: '🎯', section: 'Validation', tier: 'validation', locked: true },
    { key: 'multi_channel_tests', title: 'Multi-Channel Tests', icon: '🔬', section: 'Validation', tier: 'validation', locked: true },
    { key: 'strategic_analysis', title: 'Strategic Analysis Tools', icon: '🧠', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'battlecards', title: 'Competitive Battlecards', icon: '⚔', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'implementation_roadmap', title: 'Implementation Roadmap', icon: '🗺', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'action_plans', title: '90-Day Action Plan', icon: '📝', section: 'Strategic', tier: 'validation', locked: true },
    { key: 'partnership_evaluation', title: 'Partnership Evaluation', icon: '🤝', section: 'Strategic', tier: 'validation', locked: true },
    
    // Decision Section
    { key: 'go_pivot_defer', title: 'Go/Pivot/Defer', icon: '🚦', section: 'Decision', tier: 'feasibility' },
  ],
  validation: [
    // Setup Section
    { key: 'intake', title: 'Initial Intake', icon: '📋', section: 'Setup', tier: 'discovery' },
    { key: 'assumptions', title: 'Assumption Tracker', icon: '🎯', section: 'Setup', tier: 'discovery' },
    
    // Discovery Section (All unlocked)
    { key: 'market_simulation', title: 'AI Market Simulation', icon: '👥', section: 'Discovery', tier: 'discovery' },
    { key: 'competitive_intel', title: 'Competitive Intel', icon: '♟', section: 'Discovery', tier: 'discovery' },
    { key: 'market_sizing', title: 'Market Sizing', icon: '📊', section: 'Discovery', tier: 'discovery' },
    { key: 'risk_assessment', title: 'Risk Assessment', icon: '🛡', section: 'Discovery', tier: 'discovery' },
    { key: 'swot_analysis', title: 'SWOT Analysis', icon: '⚖', section: 'Discovery', tier: 'discovery' },
    
    // Validation Section (Full Suite)
    { key: 'full_interviews', title: 'Full Interview Suite', icon: '🎯', section: 'Validation', tier: 'validation' },
    { key: 'multi_channel_tests', title: 'Multi-Channel Tests', icon: '🔬', section: 'Validation', tier: 'validation' },
    { key: 'async_interviews', title: 'Async Interviews', icon: '🎤', section: 'Validation', tier: 'feasibility' },
    { key: 'demand_test', title: 'Demand Test', icon: '🧪', section: 'Validation', tier: 'feasibility' },
    
    // Strategic Section (Premium Features)
    { key: 'strategic_analysis', title: 'Strategic Analysis Tools', icon: '🧠', section: 'Strategic', tier: 'validation' },
    { key: 'battlecards', title: 'Competitive Battlecards', icon: '⚔', section: 'Strategic', tier: 'validation' },
    { key: 'implementation_roadmap', title: 'Implementation Roadmap', icon: '🗺', section: 'Strategic', tier: 'validation' },
    { key: 'action_plans', title: '90-Day Action Plan', icon: '📝', section: 'Strategic', tier: 'validation' },
    { key: 'partnership_evaluation', title: 'Partnership Evaluation', icon: '🤝', section: 'Strategic', tier: 'validation' },
    { key: 'business_model_simulator', title: 'Business Model Simulator', icon: '🧮', section: 'Strategic', tier: 'feasibility' },
    { key: 'channel_recommender', title: 'Channel Recommender', icon: '📤', section: 'Strategic', tier: 'feasibility' },
    
    // Decision Section
    { key: 'go_pivot_kill', title: 'Go/Pivot/Kill Engine', icon: '🚦', section: 'Decision', tier: 'validation' },
  ],
};

export default function Sidebar({ sprint, modules }: SidebarProps) {
  const tierModules = moduleConfig[sprint.tier as keyof typeof moduleConfig] || [];
  
  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'discovery':
        return { label: 'Discovery', color: 'bg-blue-100 text-blue-800', icon: null };
      case 'feasibility':
        return { label: 'Feasibility', color: 'bg-orange-100 text-orange-800', icon: <Zap className="w-3 h-3" /> };
      case 'validation':
        return { label: 'Validation', color: 'bg-purple-100 text-purple-800', icon: <Crown className="w-3 h-3" /> };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const getModuleStatus = (module: any) => {
    const dbModule = modules.find(m => m.moduleType === module.key);
    
    // Check if feature is locked due to tier restrictions
    if (module.locked) return 'tier_locked';
    
    if (!dbModule) return 'available';
    if (dbModule.isCompleted) return 'completed';
    if (dbModule.isLocked) return 'locked';
    return 'in_progress';
  };

  const getStatusIcon = (status: string, module: any) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <TriangleAlert className="w-4 h-4 text-yellow-600" />;
      case 'tier_locked':
        const tierInfo = getTierLabel(module.tier);
        return (
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <div className={cn("px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1", tierInfo.color)}>
              {tierInfo.icon}
              {tierInfo.label}
            </div>
          </div>
        );
      case 'locked':
        return <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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
                  const status = getModuleStatus(module);
                  const isActive = status === 'in_progress';
                  const isLocked = status === 'locked' || status === 'tier_locked';
                  const isTierLocked = status === 'tier_locked';
                  
                  return (
                    <div key={module.key} className="relative">
                      <button
                        className={cn(
                          "flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-left transition-colors",
                          isActive && "text-primary bg-blue-50 border-l-4 border-blue-500",
                          !isActive && !isLocked && "text-gray-700 hover:text-primary hover:bg-blue-50",
                          isLocked && !isTierLocked && "text-gray-400 cursor-not-allowed opacity-60",
                          isTierLocked && "text-gray-400 cursor-not-allowed opacity-40 bg-gray-50"
                        )}
                        disabled={isLocked}
                        title={isTierLocked ? `This feature requires ${module.tier} tier or higher` : undefined}
                      >
                        <span className={cn(
                          "w-4 h-4 text-center transition-all",
                          isTierLocked && "grayscale opacity-50"
                        )}>
                          {module.icon}
                        </span>
                        <span className={cn(
                          "text-sm font-medium flex-1",
                          isTierLocked && "line-through"
                        )}>
                          {module.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status, module)}
                        </div>
                      </button>
                      
                      {isTierLocked && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none rounded-lg" />
                      )}
                    </div>
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

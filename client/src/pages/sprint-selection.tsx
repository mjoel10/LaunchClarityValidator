import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Crown, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPRINT_TIERS = {
  discovery: {
    name: 'Discovery Sprint',
    price: '$5,000',
    duration: '2-3 weeks',
    description: 'Essential market validation for early-stage ideas',
    badge: { icon: null, label: 'Basic', color: 'bg-blue-100 text-blue-800' },
    features: [
      { name: 'Intake Form & Setup', included: true },
      { name: 'AI Market Simulation', included: true },
      { name: 'Assumptions Analysis', included: true },
      { name: 'Competitive Intelligence', included: true },
      { name: 'Market Sizing Analysis', included: true },
      { name: 'Risk Assessment', included: true },
      { name: 'SWOT Analysis', included: true },
      { name: 'Go/Defer Decision Framework', included: true },
      
      // Locked features
      { name: 'Async Interviews', included: false, requiresTier: 'feasibility' },
      { name: 'Demand Testing', included: false, requiresTier: 'feasibility' },
      { name: 'Business Model Simulator', included: false, requiresTier: 'feasibility' },
      { name: 'Channel Recommender', included: false, requiresTier: 'feasibility' },
      { name: 'Full Interview Suite', included: false, requiresTier: 'validation' },
      { name: 'Multi-Channel Testing', included: false, requiresTier: 'validation' },
      { name: 'Strategic Analysis Tools', included: false, requiresTier: 'validation' },
      { name: 'Competitive Battlecards', included: false, requiresTier: 'validation' },
      { name: 'Action Plans Generator', included: false, requiresTier: 'validation' },
    ]
  },
  feasibility: {
    name: 'Feasibility Sprint',
    price: '$15,000',
    duration: '4-6 weeks',
    description: 'Comprehensive validation with customer interviews and demand testing',
    badge: { icon: <Zap className="w-3 h-3" />, label: 'Advanced', color: 'bg-orange-100 text-orange-800' },
    features: [
      // All Discovery features
      { name: 'Intake Form & Setup', included: true },
      { name: 'AI Market Simulation', included: true },
      { name: 'Assumptions Analysis', included: true },
      { name: 'Competitive Intelligence', included: true },
      { name: 'Market Sizing Analysis', included: true },
      { name: 'Risk Assessment', included: true },
      { name: 'SWOT Analysis', included: true },
      
      // Feasibility-specific features
      { name: 'Async Interviews (10-15 participants)', included: true },
      { name: 'Demand Testing & Landing Pages', included: true },
      { name: 'Business Model Simulator', included: true },
      { name: 'Channel Recommender', included: true },
      { name: 'Go/Pivot/Defer Decision', included: true },
      
      // Locked premium features
      { name: 'Full Interview Suite (25+ participants)', included: false, requiresTier: 'validation' },
      { name: 'Multi-Channel Testing', included: false, requiresTier: 'validation' },
      { name: 'Strategic Analysis Tools', included: false, requiresTier: 'validation' },
      { name: 'Competitive Battlecards', included: false, requiresTier: 'validation' },
      { name: 'Action Plans Generator', included: false, requiresTier: 'validation' },
    ]
  },
  validation: {
    name: 'Validation Sprint',
    price: '$35,000',
    duration: '6-8 weeks',
    description: 'Full-scale validation with comprehensive testing and strategic analysis',
    badge: { icon: <Crown className="w-3 h-3" />, label: 'Premium', color: 'bg-purple-100 text-purple-800' },
    features: [
      // All previous features
      { name: 'Intake Form & Setup', included: true },
      { name: 'AI Market Simulation', included: true },
      { name: 'Assumptions Analysis', included: true },
      { name: 'Competitive Intelligence', included: true },
      { name: 'Market Sizing Analysis', included: true },
      { name: 'Risk Assessment', included: true },
      { name: 'SWOT Analysis', included: true },
      { name: 'Async Interviews', included: true },
      { name: 'Demand Testing', included: true },
      { name: 'Business Model Simulator', included: true },
      { name: 'Channel Recommender', included: true },
      
      // Premium features
      { name: 'Full Interview Suite (25+ participants)', included: true },
      { name: 'Multi-Channel Testing (A/B/C variants)', included: true },
      { name: 'Strategic Analysis Tools', included: true },
      { name: 'Competitive Battlecards', included: true },
      { name: 'Action Plans Generator', included: true },
      { name: 'Go/Pivot/Kill Decision Engine', included: true },
    ]
  }
};

const FeatureItem = ({ feature, currentTier }: { feature: any, currentTier: string }) => {
  const isIncluded = feature.included;
  const isLocked = !isIncluded && feature.requiresTier;
  
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'feasibility':
        return { icon: <Zap className="w-2 h-2" />, label: 'Advanced', color: 'bg-orange-100 text-orange-700' };
      case 'validation':
        return { icon: <Crown className="w-2 h-2" />, label: 'Premium', color: 'bg-purple-100 text-purple-700' };
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between py-2 px-3 rounded-lg transition-colors",
      isIncluded && "bg-green-50",
      isLocked && "bg-gray-50 opacity-60"
    )}>
      <div className="flex items-center space-x-3">
        {isIncluded ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <Lock className="w-4 h-4 text-gray-400" />
        )}
        <span className={cn(
          "text-sm",
          isIncluded ? "text-gray-900 font-medium" : "text-gray-500",
          isLocked && "line-through"
        )}>
          {feature.name}
        </span>
      </div>
      
      {isLocked && feature.requiresTier && (
        <div className="flex items-center">
          {(() => {
            const badge = getTierBadge(feature.requiresTier);
            return badge ? (
              <div className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", badge.color)}>
                {badge.icon}
                {badge.label}
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

type TierKey = keyof typeof SPRINT_TIERS;

export default function SprintSelection() {
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Validation Sprint
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the right level of validation for your business idea. Each tier builds upon the previous with more comprehensive analysis and testing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {Object.entries(SPRINT_TIERS).map(([tierKey, tier]) => (
            <Card 
              key={tierKey}
              className={cn(
                "relative transition-all duration-300 cursor-pointer",
                selectedTier === tierKey ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md",
                tierKey === 'feasibility' && "border-orange-200",
                tierKey === 'validation' && "border-purple-200"
              )}
              onClick={() => setSelectedTier(tierKey as TierKey)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", tier.badge.color)}>
                    {tier.badge.icon}
                    {tier.badge.label}
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-sm text-gray-500">{tier.duration}</span>
                </div>
                <CardDescription className="text-sm">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-1">
                  {tier.features.map((feature, index) => (
                    <FeatureItem 
                      key={index} 
                      feature={feature} 
                      currentTier={tierKey}
                    />
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className={cn(
                    "w-full",
                    selectedTier === tierKey && "bg-blue-600 hover:bg-blue-700"
                  )}
                  variant={selectedTier === tierKey ? "default" : "outline"}
                >
                  {selectedTier === tierKey ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>

              {tierKey === 'feasibility' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500">Most Popular</Badge>
                </div>
              )}
            </Card>
          ))}
        </div>

        {selectedTier && (
          <div className="bg-white rounded-lg shadow-lg p-8 border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Ready to start your {SPRINT_TIERS[selectedTier].name}?
                </h3>
                <p className="text-gray-600 mt-2">
                  Complete your intake form and begin the validation process
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {SPRINT_TIERS[selectedTier].price}
                </div>
                <div className="text-sm text-gray-500">
                  {SPRINT_TIERS[selectedTier].duration}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex items-center space-x-2">
                <span>Start Sprint</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SPRINT_TIERS[selectedTier].features
                  .filter(f => f.included)
                  .map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
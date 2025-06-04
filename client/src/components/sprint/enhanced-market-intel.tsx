import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Zap, Eye } from 'lucide-react';

interface EnhancedMarketIntelProps {
  sprintId: number;
  intakeData?: any;
}

export default function EnhancedMarketIntel({ sprintId, intakeData }: EnhancedMarketIntelProps) {
  const marketData = {
    marketSize: 12.5,
    growth: 23.4,
    segments: 5,
    competitors: 12,
    opportunities: 8
  };

  const segments = [
    { name: 'Enterprise', size: 45, growth: 18, potential: 'high' },
    { name: 'Mid-Market', size: 30, growth: 25, potential: 'high' },
    { name: 'SMB', size: 15, growth: 35, potential: 'medium' },
    { name: 'Startup', size: 8, growth: 45, potential: 'medium' },
    { name: 'Government', size: 2, growth: 5, potential: 'low' }
  ];

  const trends = [
    'AI adoption accelerating across all segments',
    'Remote work driving demand for collaboration tools',
    'Increased focus on data privacy and security',
    'Integration capabilities becoming table stakes',
    'Mobile-first approach gaining importance'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Market Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${marketData.marketSize}B</div>
            <div className="text-xs text-gray-500">total addressable</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{marketData.growth}%</div>
            <div className="text-xs text-gray-500">annual growth</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{marketData.segments}</div>
            <div className="text-xs text-gray-500">target segments</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Competitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{marketData.competitors}</div>
            <div className="text-xs text-gray-500">direct competitors</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{marketData.opportunities}</div>
            <div className="text-xs text-gray-500">market gaps identified</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Enhanced Market Intelligence
          </CardTitle>
          <CardDescription>
            Deep market analysis with AI-powered insights and competitive intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Market Segments Analysis</h4>
              <div className="space-y-3">
                {segments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{segment.name}</span>
                      <Badge className={
                        segment.potential === 'high' ? 'bg-green-100 text-green-800' :
                        segment.potential === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {segment.potential} potential
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Size: </span>
                        <span className="font-medium">{segment.size}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Growth: </span>
                        <span className="font-medium text-green-600">{segment.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Key Market Trends</h4>
              <div className="space-y-2">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-blue-900">{trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-600" />
            Strategic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">High-Growth Opportunity</h4>
              <p className="text-sm text-green-700 mt-1">Mid-market segment showing 25% growth with limited competition - prime target for expansion</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Technology Trend Alignment</h4>
              <p className="text-sm text-blue-700 mt-1">AI adoption trend aligns perfectly with product capabilities, creating natural market pull</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900">Competitive Advantage</h4>
              <p className="text-sm text-purple-700 mt-1">Integration capabilities provide clear differentiation in fragmented market landscape</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
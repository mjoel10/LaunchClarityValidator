import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, DollarSign, ExternalLink } from 'lucide-react';

interface DemandTestTrackerProps {
  sprintId: number;
  intakeData?: any;
}

export default function DemandTestTracker({ sprintId, intakeData }: DemandTestTrackerProps) {
  const tests = [
    {
      id: 1,
      name: 'Landing Page A/B Test',
      type: 'Landing Page',
      status: 'active',
      visitors: 1247,
      conversions: 89,
      conversionRate: 7.1,
      spend: 450
    },
    {
      id: 2,
      name: 'Facebook Ad Campaign',
      type: 'Paid Social',
      status: 'active',
      visitors: 2156,
      conversions: 124,
      conversionRate: 5.8,
      spend: 680
    },
    {
      id: 3,
      name: 'Google Ads Test',
      type: 'Search',
      status: 'completed',
      visitors: 892,
      conversions: 67,
      conversionRate: 7.5,
      spend: 320
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSpend = tests.reduce((sum, test) => sum + test.spend, 0);
  const totalConversions = tests.reduce((sum, test) => sum + test.conversions, 0);
  const avgConversionRate = tests.reduce((sum, test) => sum + test.conversionRate, 0) / tests.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalSpend}</div>
            <div className="text-xs text-gray-500">across all tests</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalConversions}</div>
            <div className="text-xs text-gray-500">total signups/leads</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgConversionRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">across channels</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Cost per Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${(totalSpend / totalConversions).toFixed(2)}</div>
            <div className="text-xs text-gray-500">blended average</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Active Demand Tests
          </CardTitle>
          <CardDescription>
            Validate market demand through controlled testing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{test.name}</h4>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                    <Badge variant="outline">{test.type}</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Visitors</div>
                    <div className="font-medium">{test.visitors.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Conversions</div>
                    <div className="font-medium">{test.conversions}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Conv. Rate</div>
                    <div className="font-medium text-green-600">{test.conversionRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Spend</div>
                    <div className="font-medium">${test.spend}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Strong Demand Validated</h4>
              <p className="text-sm text-green-700 mt-1">Google Ads showing highest conversion rate at 7.5%, indicating strong search intent</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Channel Performance</h4>
              <p className="text-sm text-blue-700 mt-1">Search campaigns outperforming social by 1.7x, recommend budget reallocation</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900">Optimization Opportunity</h4>
              <p className="text-sm text-yellow-700 mt-1">Landing page A/B test showing potential for 2x improvement with revised messaging</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
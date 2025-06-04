import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Target, TrendingUp, Users, DollarSign } from 'lucide-react';

interface MultiChannelTestingProps {
  sprintId: number;
  intakeData?: any;
}

export default function MultiChannelTesting({ sprintId, intakeData }: MultiChannelTestingProps) {
  const channels = [
    {
      name: 'Google Ads',
      status: 'active',
      budget: 2500,
      spent: 1847,
      leads: 89,
      cpl: 20.76,
      conversionRate: 4.2,
      quality: 'high'
    },
    {
      name: 'Facebook Ads',
      status: 'active',
      budget: 2000,
      spent: 1654,
      leads: 67,
      cpl: 24.69,
      conversionRate: 3.1,
      quality: 'medium'
    },
    {
      name: 'LinkedIn Ads',
      status: 'active',
      budget: 3000,
      spent: 2890,
      leads: 45,
      cpl: 64.22,
      conversionRate: 8.7,
      quality: 'high'
    },
    {
      name: 'Content Marketing',
      status: 'active',
      budget: 1500,
      spent: 890,
      leads: 34,
      cpl: 26.18,
      conversionRate: 2.8,
      quality: 'medium'
    },
    {
      name: 'Email Campaign',
      status: 'completed',
      budget: 500,
      spent: 500,
      leads: 156,
      cpl: 3.21,
      conversionRate: 12.4,
      quality: 'high'
    }
  ];

  const totalSpent = channels.reduce((sum, ch) => sum + ch.spent, 0);
  const totalLeads = channels.reduce((sum, ch) => sum + ch.leads, 0);
  const avgCPL = totalSpent / totalLeads;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalSpent.toLocaleString()}</div>
            <div className="text-xs text-gray-500">across all channels</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalLeads}</div>
            <div className="text-xs text-gray-500">qualified prospects</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg CPL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${avgCPL.toFixed(2)}</div>
            <div className="text-xs text-gray-500">cost per lead</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {channels.filter(ch => ch.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500">running tests</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            Multi-Channel Testing Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive testing across multiple acquisition channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel, index) => (
              <div key={index} className="p-4 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{channel.name}</h4>
                    <Badge className={
                      channel.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {channel.status}
                    </Badge>
                    <Badge variant="outline" className={
                      channel.quality === 'high' ? 'border-green-500 text-green-700' :
                      channel.quality === 'medium' ? 'border-yellow-500 text-yellow-700' :
                      'border-red-500 text-red-700'
                    }>
                      {channel.quality} quality
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round((channel.spent / channel.budget) * 100)}% of budget used
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-gray-600">Budget</div>
                    <div className="font-medium">${channel.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Spent</div>
                    <div className="font-medium">${channel.spent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Leads</div>
                    <div className="font-medium">{channel.leads}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">CPL</div>
                    <div className="font-medium">${channel.cpl.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Conv. Rate</div>
                    <div className="font-medium text-green-600">{channel.conversionRate}%</div>
                  </div>
                </div>

                <Progress value={(channel.spent / channel.budget) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Channel Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Top Performer: Email Campaign</h4>
              <p className="text-sm text-green-700 mt-1">Highest conversion rate at 12.4% and lowest CPL at $3.21 - recommend scaling</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">High Quality Channels</h4>
              <p className="text-sm text-blue-700 mt-1">Google Ads and LinkedIn showing high-quality leads with good conversion rates</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900">Optimization Opportunity</h4>
              <p className="text-sm text-yellow-700 mt-1">Facebook Ads underperforming - consider audience refinement or creative refresh</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900">Scale Recommendation</h4>
              <p className="text-sm text-purple-700 mt-1">Allocate 60% of budget to top 3 performing channels for optimal ROI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
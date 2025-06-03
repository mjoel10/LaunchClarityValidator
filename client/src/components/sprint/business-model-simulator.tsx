import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface BusinessModelSimulatorProps {
  sprintId: number;
  data?: any;
}

export default function BusinessModelSimulator({ sprintId, data }: BusinessModelSimulatorProps) {
  const [model, setModel] = useState({
    revenueModel: 'subscription',
    customerAcquisitionCost: 150,
    customerLifetimeValue: 2400,
    churnRate: 5,
    monthlyGrowthRate: 15,
    pricingTier: 99,
    marketSize: 1000000,
    marketPenetration: 0.1,
  });

  const [scenarios, setScenarios] = useState([
    { name: 'Conservative', growth: 5, churn: 8, cac: 200 },
    { name: 'Realistic', growth: 15, churn: 5, cac: 150 },
    { name: 'Optimistic', growth: 25, churn: 3, cac: 100 },
  ]);

  // Calculate key metrics
  const ltv = model.customerLifetimeValue;
  const cac = model.customerAcquisitionCost;
  const ltvCacRatio = ltv / cac;
  const paybackPeriod = cac / (model.pricingTier * (1 - model.churnRate / 100));

  // Generate revenue projections
  const generateProjections = (scenario: any) => {
    const months = [];
    let customers = 100;
    let mrr = customers * model.pricingTier;
    
    for (let i = 0; i < 24; i++) {
      const newCustomers = customers * (scenario.growth / 100);
      const churnedCustomers = customers * (scenario.churn / 100);
      customers = customers + newCustomers - churnedCustomers;
      mrr = customers * model.pricingTier;
      
      months.push({
        month: i + 1,
        customers: Math.round(customers),
        mrr: Math.round(mrr),
        arr: Math.round(mrr * 12),
        cac: scenario.cac,
        ltv: ltv,
      });
    }
    return months;
  };

  const realisticProjections = generateProjections(scenarios[1]);

  // Unit economics data
  const unitEconomics = [
    { name: 'CAC', value: cac, color: '#ef4444' },
    { name: 'LTV', value: ltv, color: '#10b981' },
    { name: 'Gross Margin', value: ltv - cac, color: '#3b82f6' },
  ];

  const COLORS = ['#ef4444', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Business Model Simulator
          </CardTitle>
          <CardDescription>
            Model your unit economics and revenue projections across different scenarios
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Revenue Model</Label>
                  <Select value={model.revenueModel} onValueChange={(value) => setModel({...model, revenueModel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">Subscription (SaaS)</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="one-time">One-time Purchase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Price Point ($)</Label>
                  <Input
                    type="number"
                    value={model.pricingTier}
                    onChange={(e) => setModel({...model, pricingTier: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Market Size (TAM)</Label>
                  <Input
                    type="number"
                    value={model.marketSize}
                    onChange={(e) => setModel({...model, marketSize: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Market Penetration (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={model.marketPenetration}
                    onChange={(e) => setModel({...model, marketPenetration: Number(e.target.value)})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unit Economics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Acquisition Cost ($)</Label>
                  <Input
                    type="number"
                    value={model.customerAcquisitionCost}
                    onChange={(e) => setModel({...model, customerAcquisitionCost: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Customer Lifetime Value ($)</Label>
                  <Input
                    type="number"
                    value={model.customerLifetimeValue}
                    onChange={(e) => setModel({...model, customerLifetimeValue: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Churn Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={model.churnRate}
                    onChange={(e) => setModel({...model, churnRate: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Growth Rate (%)</Label>
                  <Input
                    type="number"
                    value={model.monthlyGrowthRate}
                    onChange={(e) => setModel({...model, monthlyGrowthRate: Number(e.target.value)})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">LTV:CAC Ratio</p>
                    <p className="text-2xl font-bold">{ltvCacRatio.toFixed(1)}:1</p>
                  </div>
                  <div className={`p-2 rounded-full ${ltvCacRatio >= 3 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {ltvCacRatio >= 3 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {ltvCacRatio >= 3 ? 'Healthy' : 'Needs improvement'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Payback Period</p>
                    <p className="text-2xl font-bold">{paybackPeriod.toFixed(1)}m</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Months to recover CAC</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Addressable Market</p>
                    <p className="text-2xl font-bold">${(model.marketSize / 1000000).toFixed(1)}M</p>
                  </div>
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: {model.marketPenetration}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Churn</p>
                    <p className="text-2xl font-bold">{model.churnRate}%</p>
                  </div>
                  <div className={`p-2 rounded-full ${model.churnRate <= 5 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {model.churnRate <= 5 ? 'Good retention' : 'High churn'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections">
          <Card>
            <CardHeader>
              <CardTitle>24-Month Revenue Projections</CardTitle>
              <CardDescription>Based on current model parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realisticProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        typeof value === 'number' ? value.toLocaleString() : value,
                        name === 'mrr' ? 'Monthly Recurring Revenue' :
                        name === 'customers' ? 'Total Customers' :
                        name === 'arr' ? 'Annual Recurring Revenue' : name
                      ]}
                    />
                    <Line type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={2} name="MRR ($)" />
                    <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Year 1 ARR</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${realisticProjections[11]?.arr.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Year 2 ARR</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${realisticProjections[23]?.arr.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Customer Count (24m)</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {realisticProjections[23]?.customers.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <div className="space-y-6">
            {scenarios.map((scenario, index) => {
              const projections = generateProjections(scenario);
              const year2Revenue = projections[23]?.arr || 0;
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{scenario.name} Scenario</CardTitle>
                        <CardDescription>
                          Growth: {scenario.growth}% • Churn: {scenario.churn}% • CAC: ${scenario.cac}
                        </CardDescription>
                      </div>
                      <Badge variant={index === 1 ? 'default' : 'secondary'}>
                        Year 2 ARR: ${year2Revenue.toLocaleString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projections.slice(0, 12)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Unit Economics Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={unitEconomics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {unitEconomics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ltvCacRatio < 3 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Improve LTV:CAC Ratio</p>
                      <p className="text-sm text-red-600">
                        Your ratio is {ltvCacRatio.toFixed(1)}:1. Target 3:1 or higher by reducing CAC or increasing LTV.
                      </p>
                    </div>
                  </div>
                )}

                {model.churnRate > 5 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Reduce Churn Rate</p>
                      <p className="text-sm text-yellow-600">
                        {model.churnRate}% monthly churn is high. Focus on customer success and product stickiness.
                      </p>
                    </div>
                  </div>
                )}

                {paybackPeriod > 12 && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">Long Payback Period</p>
                      <p className="text-sm text-orange-600">
                        {paybackPeriod.toFixed(1)} months is lengthy. Consider increasing pricing or reducing CAC.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Growth Opportunity</p>
                    <p className="text-sm text-blue-600">
                      At {model.marketPenetration}% penetration, you could reach ${((model.marketSize * model.marketPenetration / 100) * model.pricingTier * 12 / 1000000).toFixed(1)}M ARR.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
  intakeData?: any;
}

export default function BusinessModelSimulator({ sprintId, intakeData }: BusinessModelSimulatorProps) {
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
        <CardContent>
          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="model">Model</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="economics">Unit Economics</TabsTrigger>
            </TabsList>

            <TabsContent value="model" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <Label htmlFor="revenue-model">Revenue Model</Label>
                  <Select value={model.revenueModel} onValueChange={(value) => 
                    setModel({ ...model, revenueModel: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="one-time">One-time Payment</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="pricing-tier">Pricing Tier ($)</Label>
                  <Input
                    id="pricing-tier"
                    type="number"
                    value={model.pricingTier}
                    onChange={(e) => setModel({ ...model, pricingTier: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="cac">Customer Acquisition Cost ($)</Label>
                  <Input
                    id="cac"
                    type="number"
                    value={model.customerAcquisitionCost}
                    onChange={(e) => setModel({ ...model, customerAcquisitionCost: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="ltv">Customer Lifetime Value ($)</Label>
                  <Input
                    id="ltv"
                    type="number"
                    value={model.customerLifetimeValue}
                    onChange={(e) => setModel({ ...model, customerLifetimeValue: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="churn">Monthly Churn Rate (%)</Label>
                  <Input
                    id="churn"
                    type="number"
                    value={model.churnRate}
                    onChange={(e) => setModel({ ...model, churnRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="growth">Monthly Growth Rate (%)</Label>
                  <Input
                    id="growth"
                    type="number"
                    value={model.monthlyGrowthRate}
                    onChange={(e) => setModel({ ...model, monthlyGrowthRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="market-size">Total Market Size ($)</Label>
                  <Input
                    id="market-size"
                    type="number"
                    value={model.marketSize}
                    onChange={(e) => setModel({ ...model, marketSize: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Key Metrics Display */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">LTV:CAC Ratio</p>
                        <p className="text-2xl font-bold">{ltvCacRatio.toFixed(1)}:1</p>
                        <p className="text-xs text-muted-foreground">
                          {ltvCacRatio >= 3 ? '✅ Healthy' : ltvCacRatio >= 2 ? '⚠️ Moderate' : '❌ Poor'}
                        </p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payback Period</p>
                        <p className="text-2xl font-bold">{paybackPeriod.toFixed(1)} months</p>
                        <p className="text-xs text-muted-foreground">
                          {paybackPeriod <= 12 ? '✅ Good' : paybackPeriod <= 18 ? '⚠️ Fair' : '❌ Poor'}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Market Penetration</p>
                        <p className="text-2xl font-bold">{(model.marketPenetration * 100).toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">Of ${(model.marketSize / 1000000).toFixed(0)}M market</p>
                      </div>
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Churn</p>
                        <p className="text-2xl font-bold">{model.churnRate}%</p>
                        <p className="text-xs text-muted-foreground">Annual: {(model.churnRate * 12).toFixed(1)}%</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projections" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>24-Month Revenue Projections</CardTitle>
                  <CardDescription>Based on realistic scenario parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realisticProjections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        `$${value?.toLocaleString()}`,
                        name === 'mrr' ? 'MRR' : name === 'arr' ? 'ARR' : name
                      ]} />
                      <Line type="monotone" dataKey="mrr" stroke="#8884d8" name="MRR" />
                      <Line type="monotone" dataKey="arr" stroke="#82ca9d" name="ARR" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Key Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">${realisticProjections[23]?.mrr.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Final MRR (Month 24)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">${realisticProjections[23]?.arr.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Final ARR (Month 24)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{realisticProjections[23]?.customers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total Customers (Month 24)</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              {scenarios.map((scenario, index) => {
                const projections = generateProjections(scenario);
                const finalMrr = projections[23].mrr;
                
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {scenario.name} Scenario
                        <Badge variant={
                          scenario.name === 'Conservative' ? 'destructive' :
                          scenario.name === 'Realistic' ? 'default' : 'default'
                        }>
                          {scenario.growth}% growth, {scenario.churn}% churn
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={projections}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="mrr" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-4 text-center">
                        <div className="text-2xl font-bold">${finalMrr.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">Final MRR after 24 months</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="economics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Economics Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
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
                </CardContent>
              </Card>

              {/* Alerts and Recommendations */}
              <div className="grid gap-4">
                {ltvCacRatio < 3 && (
                  <Card className="border-destructive">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium">Low LTV:CAC Ratio</p>
                          <p className="text-sm text-muted-foreground">
                            Your ratio of {ltvCacRatio.toFixed(1)}:1 is below the recommended 3:1. Consider increasing pricing or reducing acquisition costs.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {model.churnRate > 5 && (
                  <Card className="border-destructive">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium">High Churn Rate</p>
                          <p className="text-sm text-muted-foreground">
                            Monthly churn of {model.churnRate}% is concerning. Focus on customer retention and product-market fit.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paybackPeriod > 18 && (
                  <Card className="border-destructive">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium">Long Payback Period</p>
                          <p className="text-sm text-muted-foreground">
                            Payback period of {paybackPeriod.toFixed(1)} months is too long. Consider reducing CAC or increasing pricing.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Business Model Health Score</p>
                        <p className="text-sm text-muted-foreground">
                          Based on LTV:CAC ratio, churn rate, and payback period: {
                            (ltvCacRatio >= 3 && model.churnRate <= 5 && paybackPeriod <= 12) ? '🟢 Excellent' :
                            (ltvCacRatio >= 2 && model.churnRate <= 8 && paybackPeriod <= 18) ? '🟡 Good' : '🔴 Needs Work'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
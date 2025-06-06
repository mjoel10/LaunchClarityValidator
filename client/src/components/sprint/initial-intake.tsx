import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  Lightbulb,
  Handshake,
  CheckCircle2
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Manufacturing',
  'Real Estate', 'Food & Beverage', 'Transportation', 'Energy', 'Entertainment',
  'Consulting', 'Marketing', 'Legal Services', 'Construction', 'Agriculture',
  'Retail', 'Tourism', 'Non-Profit', 'Government', 'Other'
];

const GEOGRAPHIC_MARKETS = [
  'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East', 'Africa'
];

const VALIDATION_GOALS = [
  'Problem Fit', 'Solution Fit', 'Pricing', 'Channel Fit', 'Business Model'
];

interface InitialIntakeProps {
  sprintId: number;
}

export default function InitialIntake({ sprintId }: InitialIntakeProps) {
  const [formData, setFormData] = useState({
    // Partnership Mode
    isPartnershipEvaluation: false,
    
    // Business Overview
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    businessModel: '',
    productType: '',
    currentStage: '',
    industry: '',
    geographicMarkets: [] as string[],

    // Operational Complexity
    salesComplexity: '',
    salesMotion: '',
    deliveryComplexity: '',
    deliveryModel: '',

    // Customer & Value Proposition
    targetCustomerDescription: '',
    coreProblem: '',
    valueProposition: '',
    estimatedPricePoint: '',
    pricingModel: 'Monthly',
    currency: 'USD',

    // Competitive Landscape
    competitor1Name: '',
    competitor1Differentiator: '',
    competitor2Name: '',
    competitor2Differentiator: '',
    competitor3Name: '',
    competitor3Differentiator: '',
    uniqueAdvantage: '',

    // Validation Intent
    assumption1: '',
    assumption2: '',
    assumption3: '',
    validationGoals: [] as string[],
    criticalQuestion: '',
    hasBeenTested: 'No',
    testingDescription: '',
    hasAudience: 'No',

    // Partnership Evaluation
    evaluatedPartner: '',
    partnerType: '',
    relationshipStatus: '',
    integrationType: '',
    partnershipGoal: '',
    partnershipRisk1: '',
    partnershipRisk2: '',
    partnershipRisk3: '',
    partnershipRisk4: '',
    partnershipRisk5: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch existing intake data
  const { data: existingData, isLoading } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/intake`],
  });

  // Fetch sprint data for company name
  const { data: sprint } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
  });

  // Pre-populate form with existing data
  useEffect(() => {
    if (existingData && Object.keys(existingData).length > 0) {
      // Map competitors data
      const competitors = existingData.competitors || [];
      const competitorData = {
        competitor1Name: competitors[0]?.name || '',
        competitor1Differentiator: competitors[0]?.differentiator || '',
        competitor2Name: competitors[1]?.name || '',
        competitor2Differentiator: competitors[1]?.differentiator || '',
        competitor3Name: competitors[2]?.name || '',
        competitor3Differentiator: competitors[2]?.differentiator || '',
      };

      setFormData(prev => ({
        ...prev,
        ...existingData,
        ...competitorData,
        companyName: sprint?.companyName || existingData.companyName || prev.companyName,
        geographicMarkets: Array.isArray(existingData.geographicMarkets) ? existingData.geographicMarkets : prev.geographicMarkets,
        validationGoals: Array.isArray(existingData.primaryValidationGoals) ? existingData.primaryValidationGoals : prev.validationGoals,
        pricingModel: existingData.pricingModel || prev.pricingModel,
        // Map legacy assumptions field to new separate fields if they exist
        assumption1: existingData.assumption1 || (existingData.assumptionsToValidate && existingData.assumptionsToValidate[0]) || '',
        assumption2: existingData.assumption2 || (existingData.assumptionsToValidate && existingData.assumptionsToValidate[1]) || '',
        assumption3: existingData.assumption3 || (existingData.assumptionsToValidate && existingData.assumptionsToValidate[2]) || '',
      }));
    } else if (sprint?.companyName && !formData.companyName) {
      setFormData(prev => ({
        ...prev,
        companyName: sprint.companyName
      }));
    }
  }, [existingData, sprint]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/sprints/${sprintId}/intake`, data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Initial intake form saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}/intake`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save intake form",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Transform form data to match backend schema
    const transformedData = {
      ...formData,
      // Transform competitor data into array format
      competitors: [
        { name: formData.competitor1Name, differentiator: formData.competitor1Differentiator },
        { name: formData.competitor2Name, differentiator: formData.competitor2Differentiator },
        { name: formData.competitor3Name, differentiator: formData.competitor3Differentiator }
      ].filter(comp => comp.name.trim() !== ''), // Only include competitors with names
      
      // Remove individual competitor fields
      competitor1Name: undefined,
      competitor1Differentiator: undefined,
      competitor2Name: undefined,
      competitor2Differentiator: undefined,
      competitor3Name: undefined,
      competitor3Differentiator: undefined,
    };
    
    saveMutation.mutate(transformedData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Initial Intake</h1>
        <p className="text-gray-600">Comprehensive business and validation assessment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Partnership Mode Toggle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                Partnership Evaluation Mode
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPartnershipEvaluation}
                  onCheckedChange={(checked) => handleInputChange('isPartnershipEvaluation', checked)}
                />
                <Label className="text-sm font-medium">
                  Evaluating a Partnership
                </Label>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Business Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your company name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="contact@company.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessModel">Business Model *</Label>
                <Select value={formData.businessModel} onValueChange={(value) => handleInputChange('businessModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="B2B2C">B2B2C</SelectItem>
                    <SelectItem value="B2G">B2G</SelectItem>
                    <SelectItem value="Marketplace">Marketplace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <Select value={formData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Physical">Physical Product</SelectItem>
                    <SelectItem value="Marketplace">Marketplace</SelectItem>
                    <SelectItem value="App">Mobile/Web App</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currentStage">Current Stage *</Label>
                <Select value={formData.currentStage} onValueChange={(value) => handleInputChange('currentStage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Idea">Idea</SelectItem>
                    <SelectItem value="Pre-launch">Pre-launch</SelectItem>
                    <SelectItem value="MVP">MVP</SelectItem>
                    <SelectItem value="Revenue < $100K">Revenue &lt; $100K</SelectItem>
                    <SelectItem value="Revenue $100K - $1M">Revenue $100K - $1M</SelectItem>
                    <SelectItem value="Revenue $1M - $10M">Revenue $1M - $10M</SelectItem>
                    <SelectItem value="Revenue $10M - $50M+">Revenue $10M - $50M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Geographic Markets *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {GEOGRAPHIC_MARKETS.map((market) => (
                  <div key={market} className="flex items-center space-x-2">
                    <Checkbox
                      id={market}
                      checked={formData.geographicMarkets.includes(market)}
                      onCheckedChange={(checked) => handleCheckboxChange('geographicMarkets', market, checked as boolean)}
                    />
                    <Label htmlFor={market} className="text-sm font-normal">
                      {market}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Complexity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Operational Complexity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="salesComplexity">Sales Complexity *</Label>
                <Select value={formData.salesComplexity} onValueChange={(value) => handleInputChange('salesComplexity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salesMotion">Sales Motion *</Label>
                <Select value={formData.salesMotion} onValueChange={(value) => handleInputChange('salesMotion', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales motion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self-serve">Self-serve</SelectItem>
                    <SelectItem value="Inside Sales">Inside Sales</SelectItem>
                    <SelectItem value="Field Sales">Field Sales</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deliveryComplexity">Delivery Complexity *</Label>
                <Select value={formData.deliveryComplexity} onValueChange={(value) => handleInputChange('deliveryComplexity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deliveryModel">Primary Delivery Model *</Label>
                <Select value={formData.deliveryModel} onValueChange={(value) => handleInputChange('deliveryModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Service-heavy">Service-heavy</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Value Proposition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer & Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="targetCustomerDescription">Target Customer Description *</Label>
              <Textarea 
                id="targetCustomerDescription"
                value={formData.targetCustomerDescription}
                onChange={(e) => handleInputChange('targetCustomerDescription', e.target.value)}
                placeholder="Describe your ideal customer in detail..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="coreProblem">Core Problem Being Solved *</Label>
              <Textarea 
                id="coreProblem"
                value={formData.coreProblem}
                onChange={(e) => handleInputChange('coreProblem', e.target.value)}
                placeholder="What specific problem does your solution address?"
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="valueProposition">Value Proposition *</Label>
              <Textarea 
                id="valueProposition"
                value={formData.valueProposition}
                onChange={(e) => handleInputChange('valueProposition', e.target.value)}
                placeholder="How do you solve the problem better than alternatives?"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="estimatedPricePoint">Estimated Price Point *</Label>
                <Input 
                  id="estimatedPricePoint"
                  value={formData.estimatedPricePoint}
                  onChange={(e) => handleInputChange('estimatedPricePoint', e.target.value)}
                  placeholder="e.g., 99, 500, 29.99"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pricingModel">Pricing Model *</Label>
                <Select value={formData.pricingModel} onValueChange={(value) => handleInputChange('pricingModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                    <SelectItem value="One-time">One-time</SelectItem>
                    <SelectItem value="Per Unit">Per Unit</SelectItem>
                    <SelectItem value="Per User">Per User (Monthly)</SelectItem>
                    <SelectItem value="Per User Yearly">Per User (Yearly)</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Usage-based">Usage-based</SelectItem>
                    <SelectItem value="Commission">Commission %</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Landscape */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Competitive Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Top 3 Competitors</h4>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor={`competitor${num}Name`}>Competitor {num} Name</Label>
                    <Input 
                      id={`competitor${num}Name`}
                      value={formData[`competitor${num}Name` as keyof typeof formData] as string}
                      onChange={(e) => handleInputChange(`competitor${num}Name`, e.target.value)}
                      placeholder="Competitor name" 
                    />
                  </div>

                  <div>
                    <Label htmlFor={`competitor${num}Differentiator`}>Key Differentiator</Label>
                    <Textarea 
                      id={`competitor${num}Differentiator`}
                      value={formData[`competitor${num}Differentiator` as keyof typeof formData] as string}
                      onChange={(e) => handleInputChange(`competitor${num}Differentiator`, e.target.value)}
                      placeholder="How does this competitor differ from you? What do they offer that you don't?"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="uniqueAdvantage">Your Unique Advantage *</Label>
              <Textarea 
                id="uniqueAdvantage"
                value={formData.uniqueAdvantage}
                onChange={(e) => handleInputChange('uniqueAdvantage', e.target.value)}
                placeholder="What makes you fundamentally different and better?"
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Validation Intent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Validation Intent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Top 3 Assumptions to Validate *</Label>
              
              <div>
                <Label htmlFor="assumption1">1. First Assumption</Label>
                <Textarea 
                  id="assumption1"
                  value={formData.assumption1}
                  onChange={(e) => handleInputChange('assumption1', e.target.value)}
                  placeholder="What is your most critical assumption that needs validation?"
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="assumption2">2. Second Assumption</Label>
                <Textarea 
                  id="assumption2"
                  value={formData.assumption2}
                  onChange={(e) => handleInputChange('assumption2', e.target.value)}
                  placeholder="What is your second most important assumption?"
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="assumption3">3. Third Assumption</Label>
                <Textarea 
                  id="assumption3"
                  value={formData.assumption3}
                  onChange={(e) => handleInputChange('assumption3', e.target.value)}
                  placeholder="What is your third key assumption to validate?"
                  className="min-h-[80px]"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Primary Validation Goals *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {VALIDATION_GOALS.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.validationGoals.includes(goal)}
                      onCheckedChange={(checked) => handleCheckboxChange('validationGoals', goal, checked as boolean)}
                    />
                    <Label htmlFor={goal} className="text-sm font-normal">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="criticalQuestion">#1 Critical Question *</Label>
              <Input 
                id="criticalQuestion"
                value={formData.criticalQuestion}
                onChange={(e) => handleInputChange('criticalQuestion', e.target.value)}
                placeholder="What's the most important question to answer?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Has this been tested before?</Label>
                <RadioGroup 
                  value={formData.hasBeenTested} 
                  onValueChange={(value) => handleInputChange('hasBeenTested', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="tested-yes" name="hasBeenTested" value="Yes" />
                    <Label htmlFor="tested-yes" className="font-normal">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="tested-no" name="hasBeenTested" value="No" />
                    <Label htmlFor="tested-no" className="font-normal">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Do you have an audience to test with?</Label>
                <RadioGroup 
                  value={formData.hasAudience} 
                  onValueChange={(value) => handleInputChange('hasAudience', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="audience-yes" name="hasAudience" value="Yes" />
                    <Label htmlFor="audience-yes" className="font-normal">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="audience-no" name="hasAudience" value="No" />
                    <Label htmlFor="audience-no" className="font-normal">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {formData.hasBeenTested === 'Yes' && (
              <div>
                <Label htmlFor="testingDescription">Testing Description</Label>
                <Textarea 
                  id="testingDescription"
                  value={formData.testingDescription}
                  onChange={(e) => handleInputChange('testingDescription', e.target.value)}
                  placeholder="Describe previous testing efforts..."
                  className="min-h-[80px]"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partnership Evaluation - Only show when toggle is on */}
        {formData.isPartnershipEvaluation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                Partnership Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="evaluatedPartner">Evaluated Partner</Label>
                  <Input
                    id="evaluatedPartner"
                    value={formData.evaluatedPartner}
                    onChange={(e) => handleInputChange('evaluatedPartner', e.target.value)}
                    placeholder="Partner company name"
                  />
                </div>

                <div>
                  <Label htmlFor="partnerType">Partner Type</Label>
                  <Select value={formData.partnerType} onValueChange={(value) => handleInputChange('partnerType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Platform">Platform</SelectItem>
                      <SelectItem value="Reseller">Reseller</SelectItem>
                      <SelectItem value="Tech Integration">Tech Integration</SelectItem>
                      <SelectItem value="Co-Marketing">Co-Marketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="relationshipStatus">Relationship Status</Label>
                  <Select value={formData.relationshipStatus} onValueChange={(value) => handleInputChange('relationshipStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Early Conversations">Early Conversations</SelectItem>
                      <SelectItem value="Signed LOI">Signed LOI</SelectItem>
                      <SelectItem value="Beta/Pilot">Beta/Pilot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="integrationType">Integration Type</Label>
                  <Select value={formData.integrationType} onValueChange={(value) => handleInputChange('integrationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select integration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="API">API</SelectItem>
                      <SelectItem value="White-label">White-label</SelectItem>
                      <SelectItem value="Co-built Product">Co-built Product</SelectItem>
                      <SelectItem value="Bundled Offer">Bundled Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="partnershipGoal">Primary Partnership Goal</Label>
                  <Select value={formData.partnershipGoal} onValueChange={(value) => handleInputChange('partnershipGoal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Revenue">New Revenue</SelectItem>
                      <SelectItem value="Churn Reduction">Churn Reduction</SelectItem>
                      <SelectItem value="Market Entry">Market Entry</SelectItem>
                      <SelectItem value="Strategic Leverage">Strategic Leverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Top 5 Risks or Uncertainties</Label>
                
                <div>
                  <Label htmlFor="partnershipRisk1">1. Primary Risk</Label>
                  <Textarea 
                    id="partnershipRisk1"
                    value={formData.partnershipRisk1}
                    onChange={(e) => handleInputChange('partnershipRisk1', e.target.value)}
                    placeholder="What is the biggest risk or uncertainty with this partnership?"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="partnershipRisk2">2. Second Risk</Label>
                  <Textarea 
                    id="partnershipRisk2"
                    value={formData.partnershipRisk2}
                    onChange={(e) => handleInputChange('partnershipRisk2', e.target.value)}
                    placeholder="What is the second most concerning risk?"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="partnershipRisk3">3. Third Risk</Label>
                  <Textarea 
                    id="partnershipRisk3"
                    value={formData.partnershipRisk3}
                    onChange={(e) => handleInputChange('partnershipRisk3', e.target.value)}
                    placeholder="What is your third key risk or uncertainty?"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="partnershipRisk4">4. Fourth Risk</Label>
                  <Textarea 
                    id="partnershipRisk4"
                    value={formData.partnershipRisk4}
                    onChange={(e) => handleInputChange('partnershipRisk4', e.target.value)}
                    placeholder="What is another important risk to consider?"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="partnershipRisk5">5. Fifth Risk</Label>
                  <Textarea 
                    id="partnershipRisk5"
                    value={formData.partnershipRisk5}
                    onChange={(e) => handleInputChange('partnershipRisk5', e.target.value)}
                    placeholder="What is the fifth risk or uncertainty?"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button 
            type="submit" 
            size="lg"
            disabled={isSubmitting || saveMutation.isPending}
            className="min-w-[200px]"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {isSubmitting || saveMutation.isPending ? 'Saving...' : 'Save Initial Intake'}
          </Button>
        </div>
      </form>
    </div>
  );
}
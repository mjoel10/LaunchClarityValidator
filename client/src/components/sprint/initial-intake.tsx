import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
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
import { cn } from '@/lib/utils';

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

// Form validation schema
const intakeFormSchema = z.object({
  // Partnership Mode
  isPartnershipEvaluation: z.boolean().default(false),
  
  // Business Overview
  companyName: z.string().min(1, 'Company name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(10, 'Phone number is required'),
  businessModel: z.enum(['B2B', 'B2C', 'B2B2C', 'B2G', 'Marketplace']),
  productType: z.enum(['SaaS', 'Service', 'Physical', 'Marketplace', 'App']),
  currentStage: z.enum(['Idea', 'Pre-launch', 'MVP', 'Revenue < $100K', 'Revenue > $100K']),
  industry: z.string().min(1, 'Industry is required'),
  geographicMarkets: z.array(z.string()).min(1, 'Select at least one market'),

  // Operational Complexity
  salesComplexity: z.enum(['Low', 'Medium', 'High']),
  salesMotion: z.enum(['Self-serve', 'Inside Sales', 'Field Sales', 'Hybrid']),
  deliveryComplexity: z.enum(['Low', 'Medium', 'High']),
  deliveryModel: z.enum(['Digital', 'Physical', 'Service-heavy', 'Hybrid']),

  // Customer & Value Proposition
  targetCustomerDescription: z.string().min(1, 'Target customer description is required'),
  coreProblem: z.string().min(1, 'Core problem description is required'),
  valueProposition: z.string().min(1, 'Value proposition is required'),
  estimatedPricePoint: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),

  // Competitive Landscape
  competitor1Name: z.string().optional(),
  competitor1Differentiator: z.string().optional(),
  competitor2Name: z.string().optional(),
  competitor2Differentiator: z.string().optional(),
  competitor3Name: z.string().optional(),
  competitor3Differentiator: z.string().optional(),
  uniqueAdvantage: z.string().min(1, 'Unique advantage is required'),

  // Validation Intent
  assumptionsToValidate: z.string().min(1, 'Assumptions to validate are required'),
  validationGoals: z.array(z.string()).min(1, 'Select at least one validation goal'),
  criticalQuestion: z.string().min(1, 'Critical question is required'),
  hasBeenTested: z.enum(['Yes', 'No']),
  testingDescription: z.string().optional(),
  hasAudience: z.enum(['Yes', 'No']),

  // Partnership Evaluation (conditional)
  evaluatedPartner: z.string().optional(),
  partnerType: z.enum(['Platform', 'Reseller', 'Tech Integration', 'Co-Marketing', 'Other']).optional(),
  relationshipStatus: z.enum(['None', 'Early Conversations', 'Signed LOI', 'Beta/Pilot']).optional(),
  integrationType: z.enum(['API', 'White-label', 'Co-built Product', 'Bundled Offer']).optional(),
  partnershipGoal: z.enum(['New Revenue', 'Churn Reduction', 'Market Entry', 'Strategic Leverage']).optional(),
  partnershipRisks: z.string().optional(),
});

type IntakeFormData = z.infer<typeof intakeFormSchema>;

interface InitialIntakeProps {
  sprintId: number;
}

export default function InitialIntake({ sprintId }: InitialIntakeProps) {
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

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      isPartnershipEvaluation: false,
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      geographicMarkets: [],
      validationGoals: [],
      estimatedPricePoint: 0,
      currency: 'USD',
      hasBeenTested: 'No',
      hasAudience: 'No',
    },
  });

  const isPartnershipMode = form.watch('isPartnershipEvaluation');

  // Pre-populate form with existing data
  useEffect(() => {
    if (existingData) {
      form.reset({
        ...existingData,
        companyName: sprint?.companyName || existingData.companyName || '',
        geographicMarkets: existingData.geographicMarkets || [],
        validationGoals: existingData.validationGoals || [],
      });
    } else if (sprint?.companyName) {
      form.setValue('companyName', sprint.companyName);
    }
  }, [existingData, sprint, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: IntakeFormData) => {
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

  const onSubmit = (data: IntakeFormData) => {
    setIsSubmitting(true);
    saveMutation.mutate(data);
    setIsSubmitting(false);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Partnership Mode Toggle */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  Partnership Evaluation Mode
                </CardTitle>
                <FormField
                  control={form.control}
                  name="isPartnershipEvaluation"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium">
                        Evaluating a Partnership
                      </FormLabel>
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="contact@company.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Model *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="B2B">B2B</SelectItem>
                          <SelectItem value="B2C">B2C</SelectItem>
                          <SelectItem value="B2B2C">B2B2C</SelectItem>
                          <SelectItem value="B2G">B2G</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Physical">Physical Product</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                          <SelectItem value="App">Mobile/Web App</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stage *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Idea">Idea</SelectItem>
                          <SelectItem value="Pre-launch">Pre-launch</SelectItem>
                          <SelectItem value="MVP">MVP</SelectItem>
                          <SelectItem value="Revenue < $100K">Revenue &lt; $100K</SelectItem>
                          <SelectItem value="Revenue > $100K">Revenue &gt; $100K</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="geographicMarkets"
                render={() => (
                  <FormItem>
                    <FormLabel>Geographic Markets *</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {GEOGRAPHIC_MARKETS.map((market) => (
                        <FormField
                          key={market}
                          control={form.control}
                          name="geographicMarkets"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={market}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(market)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, market])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== market
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {market}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormField
                  control={form.control}
                  name="salesComplexity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Complexity *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salesMotion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Motion *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales motion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Self-serve">Self-serve</SelectItem>
                          <SelectItem value="Inside Sales">Inside Sales</SelectItem>
                          <SelectItem value="Field Sales">Field Sales</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryComplexity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Complexity *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Delivery Model *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Digital">Digital</SelectItem>
                          <SelectItem value="Physical">Physical</SelectItem>
                          <SelectItem value="Service-heavy">Service-heavy</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <FormField
                control={form.control}
                name="targetCustomerDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Customer Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your ideal customer in detail..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coreProblem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Core Problem Being Solved *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="What specific problem does your solution address?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valueProposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value Proposition *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="How do you solve the problem better than alternatives?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="estimatedPricePoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Price Point *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    <FormField
                      control={form.control}
                      name={`competitor${num}Name` as keyof IntakeFormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competitor {num} Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Competitor name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`competitor${num}Differentiator` as keyof IntakeFormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Differentiator</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="How do you differ?" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="uniqueAdvantage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Unique Advantage *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="What makes you fundamentally different and better?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="assumptionsToValidate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top 3 Assumptions to Validate *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="List your most critical assumptions that need validation..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validationGoals"
                render={() => (
                  <FormItem>
                    <FormLabel>Primary Validation Goals *</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {VALIDATION_GOALS.map((goal) => (
                        <FormField
                          key={goal}
                          control={form.control}
                          name="validationGoals"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={goal}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(goal)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, goal])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== goal
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {goal}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criticalQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>#1 Critical Question *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="What's the most important question to answer?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hasBeenTested"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Has this been tested before?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Yes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasAudience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Do you have an audience to test with?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Yes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch('hasBeenTested') === 'Yes' && (
                <FormField
                  control={form.control}
                  name="testingDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testing Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe previous testing efforts..."
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Partnership Evaluation - Only show when toggle is on */}
          {isPartnershipMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  Partnership Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="evaluatedPartner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evaluated Partner</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Partner company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partnerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select partner type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Platform">Platform</SelectItem>
                            <SelectItem value="Reseller">Reseller</SelectItem>
                            <SelectItem value="Tech Integration">Tech Integration</SelectItem>
                            <SelectItem value="Co-Marketing">Co-Marketing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relationshipStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Early Conversations">Early Conversations</SelectItem>
                            <SelectItem value="Signed LOI">Signed LOI</SelectItem>
                            <SelectItem value="Beta/Pilot">Beta/Pilot</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="integrationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Integration Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select integration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="White-label">White-label</SelectItem>
                            <SelectItem value="Co-built Product">Co-built Product</SelectItem>
                            <SelectItem value="Bundled Offer">Bundled Offer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partnershipGoal"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Primary Partnership Goal</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New Revenue">New Revenue</SelectItem>
                            <SelectItem value="Churn Reduction">Churn Reduction</SelectItem>
                            <SelectItem value="Market Entry">Market Entry</SelectItem>
                            <SelectItem value="Strategic Leverage">Strategic Leverage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="partnershipRisks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Risks or Uncertainties</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="What are the main risks or uncertainties with this partnership?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
      </Form>
    </div>
  );
}
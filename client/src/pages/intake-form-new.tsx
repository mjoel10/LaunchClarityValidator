import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Minus,
  Building2,
  Users,
  Target,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Form validation schema
const intakeFormSchema = z.object({
  // Section 1: Business Overview
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(10, 'Phone number is required'),
  businessModel: z.enum(['B2B', 'B2C', 'B2B2C', 'B2G', 'Marketplace']),
  productType: z.enum(['SaaS', 'Service', 'Physical', 'Marketplace', 'App']),
  currentStage: z.enum(['Idea', 'Pre-launch', 'MVP', 'Revenue < $100K', 'Revenue > $100K']),
  industry: z.string().min(1, 'Industry is required'),
  geographicMarkets: z.array(z.string()).min(1, 'Select at least one market'),

  // Section 2: Operational Complexity
  salesComplexity: z.enum(['Low', 'Medium', 'High']),
  salesMotion: z.enum(['Self-serve', 'Inside Sales', 'Field Sales', 'Hybrid']),
  deliveryComplexity: z.enum(['Low', 'Medium', 'High']),
  primaryDeliveryModel: z.enum(['Digital', 'Physical', 'Service-heavy', 'Hybrid']),

  // Section 3: Customer & Value Prop
  targetCustomerDescription: z.string().min(50, 'Please provide a detailed description (min 50 characters)'),
  coreProblem: z.string().min(50, 'Please describe the problem in detail (min 50 characters)'),
  valueProposition: z.string().min(50, 'Please provide a detailed value proposition (min 50 characters)'),
  estimatedPricePoint: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),

  // Section 4: Competitive Landscape
  competitors: z.array(z.object({
    name: z.string().min(1, 'Competitor name required'),
    differentiator: z.string().min(1, 'Differentiator required')
  })).min(1, 'Add at least one competitor').max(3, 'Maximum 3 competitors'),
  uniqueAdvantage: z.string().min(50, 'Please describe your unique advantage (min 50 characters)'),

  // Section 5: Validation Intent
  assumptionsToValidate: z.array(z.string().min(1)).min(1, 'Add at least one assumption').max(3, 'Maximum 3 assumptions'),
  primaryValidationGoals: z.array(z.enum(['Problem Fit', 'Solution Fit', 'Pricing', 'Channel', 'Model'])).min(1, 'Select at least one goal'),
  criticalQuestion: z.string().min(20, 'Please provide your most critical question (min 20 characters)'),
  previouslyTested: z.boolean(),
  previousTestingDescription: z.string().optional(),
  hasTestingAudience: z.boolean(),

  // Partnership Evaluation (optional)
  isPartnershipEvaluation: z.boolean().default(false),
  evaluatedPartner: z.string().optional(),
  partnerType: z.enum(['Platform', 'Reseller', 'Tech Integration', 'Co-Marketing', 'Other']).optional(),
  relationshipStatus: z.enum(['None', 'Early Conversations', 'Signed LOI', 'Beta']).optional(),
  integrationType: z.enum(['API', 'White-label', 'Co-built', 'Bundled Offer']).optional(),
  partnershipGoal: z.enum(['New Revenue', 'Churn Reduction', 'Market Entry', 'Strategic Leverage']).optional(),
  keyRisksOrUncertainties: z.string().optional(),
});

type IntakeFormData = z.infer<typeof intakeFormSchema>;

const INDUSTRIES = [
  'Technology/Software', 'Healthcare', 'Financial Services', 'E-commerce/Retail',
  'Education', 'Marketing/Advertising', 'Real Estate', 'Manufacturing',
  'Professional Services', 'Food & Beverage', 'Travel/Hospitality',
  'Entertainment/Media', 'Agriculture', 'Energy', 'Transportation/Logistics',
  'Non-profit', 'Government', 'Other'
];

const GEOGRAPHIC_MARKETS = [
  'North America', 'Europe', 'Asia-Pacific', 'Latin America',
  'Middle East', 'Africa', 'Australia/New Zealand', 'Global'
];

export default function IntakeForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(1);
  const [competitors, setCompetitors] = useState([{ name: '', differentiator: '' }]);
  const [assumptions, setAssumptions] = useState(['']);

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      businessModel: 'B2B',
      productType: 'SaaS',
      currentStage: 'MVP',
      industry: '',
      geographicMarkets: [],
      salesComplexity: 'Medium',
      salesMotion: 'Inside Sales',
      deliveryComplexity: 'Medium',
      primaryDeliveryModel: 'Digital',
      targetCustomerDescription: '',
      coreProblem: '',
      valueProposition: '',
      estimatedPricePoint: 0,
      currency: 'USD',
      competitors: [],
      uniqueAdvantage: '',
      assumptionsToValidate: [],
      primaryValidationGoals: [],
      criticalQuestion: '',
      previouslyTested: false,
      previousTestingDescription: '',
      hasTestingAudience: false,
      isPartnershipEvaluation: false,
    },
  });

  const submitIntakeMutation = useMutation({
    mutationFn: async (data: IntakeFormData) => {
      const response = await apiRequest('POST', `/api/sprints/${id}/intake`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Intake Form Submitted',
        description: 'Your information has been submitted successfully. Your consultant will review it shortly.',
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: IntakeFormData) => {
    const cleanedData = {
      ...data,
      competitors: competitors.filter(c => c.name && c.differentiator),
      assumptionsToValidate: assumptions.filter(a => a.trim()),
    };
    
    submitIntakeMutation.mutate(cleanedData);
  };

  const nextSection = async () => {
    const sectionsToValidate = {
      1: ['companyName', 'contactName', 'contactEmail', 'contactPhone', 'businessModel', 'productType', 'currentStage', 'industry', 'geographicMarkets'],
      2: ['salesComplexity', 'salesMotion', 'deliveryComplexity', 'primaryDeliveryModel'],
      3: ['targetCustomerDescription', 'coreProblem', 'valueProposition', 'estimatedPricePoint'],
      4: ['uniqueAdvantage'],
      5: ['criticalQuestion', 'primaryValidationGoals']
    };

    const fieldsToValidate = sectionsToValidate[currentSection as keyof typeof sectionsToValidate];
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      setCurrentSection(prev => Math.min(prev + 1, 5));
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 1));
  };

  const addCompetitor = () => {
    if (competitors.length < 3) {
      setCompetitors([...competitors, { name: '', differentiator: '' }]);
    }
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((_, i) => i !== index));
    }
  };

  const addAssumption = () => {
    if (assumptions.length < 3) {
      setAssumptions([...assumptions, '']);
    }
  };

  const removeAssumption = (index: number) => {
    if (assumptions.length > 1) {
      setAssumptions(assumptions.filter((_, i) => i !== index));
    }
  };

  const sectionTitles = {
    1: 'Business Overview',
    2: 'Operational Complexity',
    3: 'Customer & Value Proposition',
    4: 'Competitive Landscape',
    5: 'Validation Intent'
  };

  const sectionIcons = {
    1: Building2,
    2: TrendingUp,
    3: Users,
    4: Target,
    5: Lightbulb
  };

  const Icon = sectionIcons[currentSection as keyof typeof sectionIcons];
  const progress = (currentSection / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LaunchClarity
            </h1>
            <Badge variant="secondary">
              Client Intake Form
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Discovery Sprint Intake</h2>
              <p className="text-blue-100 mt-1">
                Section {currentSection} of 5: {sectionTitles[currentSection as keyof typeof sectionTitles]}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8" />
              <span className="text-xl font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-blue-800" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Business Overview */}
            {currentSection === 1 && (
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
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
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
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
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="businessModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Model *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select model" />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SaaS">SaaS</SelectItem>
                                <SelectItem value="Service">Service</SelectItem>
                                <SelectItem value="Physical">Physical</SelectItem>
                                <SelectItem value="Marketplace">Marketplace</SelectItem>
                                <SelectItem value="App">App</SelectItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Idea">Idea</SelectItem>
                                <SelectItem value="Pre-launch">Pre-launch</SelectItem>
                                <SelectItem value="MVP">MVP</SelectItem>
                                <SelectItem value="Revenue < $100K">Revenue < $100K</SelectItem>
                                <SelectItem value="Revenue > $100K">Revenue > $100K</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                    <FormField
                      control={form.control}
                      name="geographicMarkets"
                      render={() => (
                        <FormItem>
                          <FormLabel>Geographic Markets *</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                      <FormLabel className="text-sm font-normal">
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((section) => (
                  <div
                    key={section}
                    className={cn(
                      "w-3 h-3 rounded-full",
                      section === currentSection 
                        ? "bg-blue-600" 
                        : section < currentSection 
                        ? "bg-green-500" 
                        : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              {currentSection === 5 ? (
                <Button
                  type="submit"
                  disabled={submitIntakeMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {submitIntakeMutation.isPending ? 'Submitting...' : 'Submit Intake'}
                  <Check className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
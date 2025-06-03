import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import TopNav from '@/components/navigation/top-nav';

const intakeFormSchema = z.object({
  businessModel: z.string().min(1, "Business model is required"),
  productType: z.string().min(1, "Product type is required"),
  currentStage: z.string().min(1, "Current stage is required"),
  industry: z.string().min(1, "Industry is required"),
  geographicMarkets: z.array(z.string()).min(1, "At least one market is required"),
  salesComplexity: z.string().min(1, "Sales complexity is required"),
  salesMotion: z.string().min(1, "Sales motion is required"),
  deliveryComplexity: z.string().min(1, "Delivery complexity is required"),
  primaryDeliveryModel: z.string().min(1, "Primary delivery model is required"),
  targetCustomerDescription: z.string().min(10, "Target customer description must be at least 10 characters"),
  coreProblem: z.string().min(10, "Core problem must be at least 10 characters"),
  valueProposition: z.string().min(10, "Value proposition must be at least 10 characters"),
  estimatedPricePoint: z.string().min(1, "Estimated price point is required"),
  currency: z.string().default("USD"),
  competitors: z.array(z.object({
    name: z.string().min(1, "Competitor name is required"),
    differentiator: z.string().min(1, "Differentiator is required")
  })).max(3),
  uniqueAdvantage: z.string().min(5, "Unique advantage must be at least 5 characters"),
  assumptionsToValidate: z.array(z.string()).max(3),
  primaryValidationGoals: z.array(z.string()).min(1, "At least one validation goal is required"),
  criticalQuestion: z.string().min(10, "Critical question must be at least 10 characters"),
  previouslyTested: z.boolean(),
  previousTestingDescription: z.string().optional(),
  hasTestingAudience: z.boolean(),
});

type IntakeFormData = z.infer<typeof intakeFormSchema>;

export default function IntakeForm() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const sprintId = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sprint } = useQuery({
    queryKey: [`/api/sprints/${sprintId}`],
    enabled: !!sprintId,
  });

  const { data: existingIntake } = useQuery({
    queryKey: [`/api/sprints/${sprintId}/intake`],
    enabled: !!sprintId,
  });

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      businessModel: "",
      productType: "",
      currentStage: "",
      industry: "",
      geographicMarkets: [],
      salesComplexity: "",
      salesMotion: "",
      deliveryComplexity: "",
      primaryDeliveryModel: "",
      targetCustomerDescription: "",
      coreProblem: "",
      valueProposition: "",
      estimatedPricePoint: "",
      currency: "USD",
      competitors: [{ name: "", differentiator: "" }],
      uniqueAdvantage: "",
      assumptionsToValidate: [""],
      primaryValidationGoals: [],
      criticalQuestion: "",
      previouslyTested: false,
      previousTestingDescription: "",
      hasTestingAudience: false,
    },
  });

  const submitIntakeMutation = useMutation({
    mutationFn: async (data: IntakeFormData) => {
      const response = await apiRequest('POST', `/api/sprints/${sprintId}/intake`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Intake form submitted",
        description: "Your intake data has been saved and analysis is being generated.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/sprints/${sprintId}`] });
      setLocation(`/sprints/${sprintId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: IntakeFormData) => {
    submitIntakeMutation.mutate(data);
  };

  if (!sprint) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <TopNav />
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <TopNav selectedSprint={sprint} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-text">Sprint Intake Form</h1>
          <p className="text-muted-foreground mt-1">
            Complete this comprehensive intake to enable AI-powered analysis for your {sprint.tier} sprint.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Overview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormLabel>Product Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product type" />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Healthcare, Fintech, Education" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer & Value Prop Section */}
            <Card>
              <CardHeader>
                <CardTitle>Customer & Value Proposition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="targetCustomerDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Customer Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your ideal customer in detail..."
                          className="min-h-[100px]"
                          {...field} 
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
                      <FormLabel>Core Problem Being Solved</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What specific problem does your solution address?"
                          className="min-h-[100px]"
                          {...field} 
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
                      <FormLabel>Value Proposition</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do you solve the problem uniquely?"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="estimatedPricePoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Price Point</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 99, 299, 10000" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Validation Intent Section */}
            <Card>
              <CardHeader>
                <CardTitle>Validation Intent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="criticalQuestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>#1 Critical Question</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What is the most important question you need answered?"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="previouslyTested"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Has this been tested before?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasTestingAudience"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you have an audience to test with?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation(`/sprints/${sprintId}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary-dark"
                disabled={submitIntakeMutation.isPending}
              >
                {submitIntakeMutation.isPending ? "Submitting..." : "Submit Intake"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Eye,
  ExternalLink,
  Crown,
  Zap,
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  Building2,
  Target,
  Lightbulb,
  CreditCard,
  Copy,
  Link,
  BarChart3
} from 'lucide-react';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Form schemas
const createSprintSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  companyName: z.string().min(1, 'Company name is required'),
  tier: z.enum(['discovery', 'feasibility', 'validation']),
  isPartnershipEvaluation: z.boolean().default(false),
  notes: z.string().optional(),
});

type CreateSprintForm = z.infer<typeof createSprintSchema>;

export default function UnifiedDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const form = useForm<CreateSprintForm>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      companyName: '',
      tier: 'discovery',
      isPartnershipEvaluation: false,
      notes: '',
    },
  });

  // Query all sprints
  const sprintsQuery = useQuery({
    queryKey: ['/api/sprints'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    refetchInterval: 30000,
  });

  // Create sprint mutation
  const createSprintMutation = useMutation({
    mutationFn: async (data: CreateSprintForm) => {
      const response = await apiRequest('POST', '/api/sprints', data);
      return response.json();
    },
    onSuccess: () => {
      setIsCreateDialogOpen(false);
      form.reset();
      sprintsQuery.refetch();
      toast({
        title: 'Sprint Created',
        description: 'New sprint has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create sprint',
        variant: 'destructive',
      });
    },
  });

  // Generate payment link mutation
  const generatePaymentLinkMutation = useMutation({
    mutationFn: async (sprintId: number) => {
      const response = await apiRequest('POST', `/api/sprints/${sprintId}/payment-link`);
      return response.json();
    },
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.paymentUrl);
      toast({
        title: 'Payment Link Generated',
        description: 'Payment link copied to clipboard. Send this to your client.',
      });
      sprintsQuery.refetch();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate payment link',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CreateSprintForm) => {
    createSprintMutation.mutate(data);
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'discovery':
        return { 
          label: 'Discovery Sprint', 
          price: '$5,000', 
          color: 'bg-blue-100 text-blue-800',
          icon: <Shield className="w-4 h-4" />
        };
      case 'feasibility':
        return { 
          label: 'Feasibility Sprint', 
          price: '$15,000', 
          color: 'bg-orange-100 text-orange-800',
          icon: <Zap className="w-4 h-4" />
        };
      case 'validation':
        return { 
          label: 'Validation Sprint', 
          price: '$35,000', 
          color: 'bg-purple-100 text-purple-800',
          icon: <Crown className="w-4 h-4" />
        };
      default:
        return { label: 'Unknown', price: '$0', color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sprints = Array.isArray(sprintsQuery.data) ? sprintsQuery.data : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LaunchClarity
            </h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Sprint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Sprint</DialogTitle>
                  <DialogDescription>
                    Set up a new validation sprint for your client
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="clientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sprint Tier</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sprint tier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="discovery">Discovery Sprint - $5,000</SelectItem>
                              <SelectItem value="feasibility">Feasibility Sprint - $15,000</SelectItem>
                              <SelectItem value="validation">Validation Sprint - $35,000</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPartnershipEvaluation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Partnership Evaluation Sprint
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes about this sprint..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createSprintMutation.isPending}
                      >
                        {createSprintMutation.isPending ? 'Creating...' : 'Create Sprint'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Sprint Overview</TabsTrigger>
            <TabsTrigger value="intake">Intake Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          </TabsList>

          {/* Sprint Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sprint Dashboard</h2>
                <p className="text-gray-600">Manage your client validation sprints</p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {sprints.length} Active Sprints
              </Badge>
            </div>

            {/* Sprint Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sprints.map((sprint: any) => {
                const tierInfo = getTierInfo(sprint.tier);
                return (
                  <Card key={sprint.id} className="rounded-xl shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={cn("flex items-center gap-1", tierInfo.color)}>
                          {tierInfo.icon}
                          {tierInfo.label}
                        </Badge>
                        <Badge className={getStatusColor(sprint.status)}>
                          {sprint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{sprint.companyName}</CardTitle>
                      <CardDescription>
                        Client: {sprint.client?.name || 'Unknown'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{sprint.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${sprint.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{tierInfo.price}</span>
                        <div className="flex gap-2">
                          {sprint.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => generatePaymentLinkMutation.mutate(sprint.id)}
                              disabled={generatePaymentLinkMutation.isPending}
                              className="flex items-center gap-1"
                            >
                              <CreditCard className="w-3 h-3" />
                              Payment Link
                            </Button>
                          )}
                          
                          {sprint.stripePaymentUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(sprint.stripePaymentUrl);
                                toast({ title: 'Link Copied', description: 'Payment link copied to clipboard' });
                              }}
                              className="flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy Link
                            </Button>
                          )}
                          
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/sprints/${sprint.id}`}>
                              <Eye className="w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {sprints.length === 0 && (
              <Card className="rounded-xl shadow-sm text-center py-12">
                <CardContent>
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sprints Yet</h3>
                  <p className="text-gray-500 mb-6">Create your first sprint to get started</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Sprint
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Intake Management Tab */}
          <TabsContent value="intake" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Intake Management</h2>
              <p className="text-gray-600">Manage client intake forms and data collection</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {sprints
                .filter((sprint: any) => sprint.status !== 'draft')
                .map((sprint: any) => {
                  const tierInfo = getTierInfo(sprint.tier);
                  return (
                    <Card key={sprint.id} className="rounded-xl shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-blue-600" />
                              {sprint.companyName}
                            </CardTitle>
                            <CardDescription>
                              {tierInfo.label} • Client: {sprint.client?.name}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(sprint.status)}>
                              {sprint.status.replace('_', ' ')}
                            </Badge>
                            <Button size="sm" asChild>
                              <a href={`/sprints/${sprint.id}/intake`}>
                                <FileText className="w-4 h-4 mr-2" />
                                {sprint.intakeData ? 'View Intake' : 'Start Intake'}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              <p className="text-gray-600">View sprint analytics and generate client reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${sprints.reduce((total: number, sprint: any) => {
                      return total + (sprint.paidAt ? sprint.price / 100 : 0);
                    }, 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Sprints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sprints.filter((s: any) => s.status === 'active').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sprints.length > 0 
                      ? Math.round((sprints.filter((s: any) => s.status === 'completed').length / sprints.length) * 100)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
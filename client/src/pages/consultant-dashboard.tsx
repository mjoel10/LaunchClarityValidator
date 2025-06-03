import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, ExternalLink, Users, DollarSign, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const createSprintSchema = z.object({
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  tier: z.enum(['discovery', 'feasibility', 'validation'], {
    required_error: 'Please select a sprint tier',
  }),
  isPartnershipEvaluation: z.boolean().default(false),
  notes: z.string().optional(),
});

type CreateSprintForm = z.infer<typeof createSprintSchema>;

const TIER_INFO = {
  discovery: { 
    name: 'Discovery Sprint', 
    price: 5000, 
    duration: '2-3 weeks',
    description: 'Essential market validation and competitive analysis',
    color: 'bg-blue-100 text-blue-800'
  },
  feasibility: { 
    name: 'Feasibility Sprint', 
    price: 15000, 
    duration: '4-6 weeks',
    description: 'Customer interviews, demand testing, and business modeling',
    color: 'bg-orange-100 text-orange-800'
  },
  validation: { 
    name: 'Validation Sprint', 
    price: 35000, 
    duration: '6-8 weeks',
    description: 'Full validation suite with strategic analysis',
    color: 'bg-purple-100 text-purple-800'
  },
};

export default function ConsultantDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateSprintForm>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      isPartnershipEvaluation: false,
    },
  });

  const { data: sprints = [], isLoading } = useQuery({
    queryKey: ['/api/consultant/sprints'],
  });

  const createSprintMutation = useMutation({
    mutationFn: async (data: CreateSprintForm) => {
      const response = await apiRequest('POST', '/api/consultant/create-sprint', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/consultant/sprints'] });
      setShowCreateForm(false);
      form.reset();
      toast({
        title: 'Sprint Created',
        description: `Payment link generated for ${data.companyName}`,
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

  const generatePaymentLinkMutation = useMutation({
    mutationFn: async (sprintId: number) => {
      const response = await apiRequest('POST', `/api/sprints/${sprintId}/payment-link`);
      return response.json();
    },
    onSuccess: (data) => {
      window.open(data.paymentUrl, '_blank');
      toast({
        title: 'Payment Link Generated',
        description: 'Payment link opened in new tab',
      });
    },
  });

  const onSubmit = (data: CreateSprintForm) => {
    createSprintMutation.mutate(data);
  };

  const selectedTier = form.watch('tier');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultant Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage validation sprints and client engagements</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Sprint
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sprints</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sprints.filter((s: any) => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${sprints.filter((s: any) => s.paidAt).reduce((acc: number, s: any) => acc + s.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sprints.filter((s: any) => s.status === 'payment_pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{sprints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Sprint Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Sprint</CardTitle>
            <CardDescription>
              Set up a new validation sprint for your client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    {...form.register('clientName')}
                    placeholder="John Doe"
                  />
                  {form.formState.errors.clientName && (
                    <p className="text-red-500 text-sm">{form.formState.errors.clientName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    {...form.register('clientEmail')}
                    placeholder="john@company.com"
                  />
                  {form.formState.errors.clientEmail && (
                    <p className="text-red-500 text-sm">{form.formState.errors.clientEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    {...form.register('companyName')}
                    placeholder="Acme Inc"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-red-500 text-sm">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier">Sprint Tier</Label>
                  <Select onValueChange={(value) => form.setValue('tier', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery Sprint - $5,000</SelectItem>
                      <SelectItem value="feasibility">Feasibility Sprint - $15,000</SelectItem>
                      <SelectItem value="validation">Validation Sprint - $35,000</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.tier && (
                    <p className="text-red-500 text-sm">{form.formState.errors.tier.message}</p>
                  )}
                </div>
              </div>

              {selectedTier && (
                <Card className="border-l-4 border-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{TIER_INFO[selectedTier].name}</h4>
                        <p className="text-sm text-gray-600">{TIER_INFO[selectedTier].description}</p>
                        <p className="text-sm text-gray-500">{TIER_INFO[selectedTier].duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${TIER_INFO[selectedTier].price.toLocaleString()}</p>
                        <Badge className={TIER_INFO[selectedTier].color}>
                          {TIER_INFO[selectedTier].name}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPartnershipEvaluation"
                  checked={form.watch('isPartnershipEvaluation')}
                  onCheckedChange={(checked) => form.setValue('isPartnershipEvaluation', checked)}
                />
                <Label htmlFor="isPartnershipEvaluation">Partnership Evaluation Mode</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  placeholder="Additional notes about this sprint..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
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
          </CardContent>
        </Card>
      )}

      {/* Sprint List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sprints</CardTitle>
          <CardDescription>Manage your client validation sprints</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading sprints...</div>
          ) : sprints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sprints created yet. Create your first sprint to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {sprints.map((sprint: any) => (
                <div
                  key={sprint.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{sprint.companyName}</h3>
                      <Badge className={TIER_INFO[sprint.tier as keyof typeof TIER_INFO].color}>
                        {TIER_INFO[sprint.tier as keyof typeof TIER_INFO].name}
                      </Badge>
                      <Badge variant={sprint.status === 'active' ? 'default' : 'secondary'}>
                        {sprint.status}
                      </Badge>
                      {sprint.isPartnershipEvaluation && (
                        <Badge variant="outline">Partnership</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Client: {sprint.client?.name} • ${sprint.price.toLocaleString()} • 
                      Progress: {sprint.progress}%
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {sprint.status === 'payment_pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generatePaymentLinkMutation.mutate(sprint.id)}
                        disabled={generatePaymentLinkMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Payment Link
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Sprint
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
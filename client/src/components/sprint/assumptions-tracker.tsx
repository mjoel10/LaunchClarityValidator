import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus,
  BarChart3,
  Lightbulb,
  Users,
  Calendar
} from 'lucide-react';

interface AssumptionsTrackerProps {
  sprintId: number;
  intakeData?: any;
}

export default function AssumptionsTracker({ sprintId, intakeData }: AssumptionsTrackerProps) {
  const [selectedAssumption, setSelectedAssumption] = useState<number | null>(null);
  const [newEvidence, setNewEvidence] = useState('');
  const [evidenceType, setEvidenceType] = useState('interview');

  // Extract assumptions from intake data or use default structure
  const assumptions = [
    {
      id: 1,
      assumption: intakeData?.assumption1 || "Users will pay $15/month for automated accounting integration",
      priority: "high",
      status: "testing",
      confidence: 65,
      riskLevel: "medium",
      evidence: [
        { type: "interview", source: "Customer Interview #1", result: "positive", note: "User expressed willingness to pay $10-20/month" },
        { type: "survey", source: "Price Sensitivity Survey", result: "mixed", note: "40% said too expensive, 60% acceptable" },
        { type: "competitor", source: "Competitor Analysis", result: "positive", note: "Similar tools charge $12-25/month" }
      ],
      tests: [
        { name: "Price Testing Landing Page", status: "active", conversion: "8.2%" },
        { name: "Customer Interviews", status: "completed", responses: 12 }
      ]
    },
    {
      id: 2,
      assumption: intakeData?.assumption2 || "Creative professionals spend 5+ hours monthly on manual bookkeeping",
      priority: "critical",
      status: "validated",
      confidence: 85,
      riskLevel: "low",
      evidence: [
        { type: "interview", source: "Time Tracking Study", result: "positive", note: "Average 6.3 hours/month reported" },
        { type: "survey", source: "Industry Survey (n=147)", result: "positive", note: "73% spend 4-8 hours monthly" },
        { type: "analytics", source: "User Behavior Data", result: "positive", note: "Support tickets about manual exports" }
      ],
      tests: [
        { name: "Time Tracking Study", status: "completed", responses: 25 },
        { name: "Behavioral Analytics", status: "ongoing", insights: 8 }
      ]
    },
    {
      id: 3,
      assumption: intakeData?.assumption3 || "Integration setup will take less than 10 minutes for 80% of users",
      priority: "high",
      status: "invalidated",
      confidence: 25,
      riskLevel: "high",
      evidence: [
        { type: "usability", source: "Setup Flow Testing", result: "negative", note: "Average 18 minutes, 35% needed support" },
        { type: "analytics", source: "Onboarding Funnel", result: "negative", note: "42% drop-off during setup" },
        { type: "support", source: "Support Tickets", result: "negative", note: "60% of tickets about setup issues" }
      ],
      tests: [
        { name: "Setup Flow Usability Test", status: "completed", success_rate: "65%" },
        { name: "A/B Test: Guided vs Self-Service", status: "active", conversion: "improving" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800 border-green-200';
      case 'invalidated': return 'bg-red-100 text-red-800 border-red-200';
      case 'testing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <TrendingUp className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'interview': return <Users className="w-4 h-4" />;
      case 'survey': return <BarChart3 className="w-4 h-4" />;
      case 'analytics': return <TrendingUp className="w-4 h-4" />;
      case 'usability': return <Target className="w-4 h-4" />;
      case 'competitor': return <Lightbulb className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const addEvidence = () => {
    if (!selectedAssumption || !newEvidence.trim()) return;
    // In a real app, this would update the backend
    setNewEvidence('');
  };

  const validatedCount = assumptions.filter(a => a.status === 'validated').length;
  const invalidatedCount = assumptions.filter(a => a.status === 'invalidated').length;
  const testingCount = assumptions.filter(a => a.status === 'testing').length;
  const avgConfidence = Math.round(assumptions.reduce((sum, a) => sum + a.confidence, 0) / assumptions.length);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validatedCount}</div>
            <div className="text-xs text-gray-500">assumptions confirmed</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Invalidated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{invalidatedCount}</div>
            <div className="text-xs text-gray-500">assumptions disproven</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{testingCount}</div>
            <div className="text-xs text-gray-500">currently testing</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgConfidence}%</div>
            <div className="text-xs text-gray-500">across all assumptions</div>
          </CardContent>
        </Card>
      </div>

      {/* Assumptions List */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            Assumption Tracking
          </CardTitle>
          <CardDescription>
            Track validation progress for your key business assumptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {assumptions.map((assumption) => (
              <div key={assumption.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(assumption.priority)}`} />
                      <Badge className={getStatusColor(assumption.status)}>
                        {assumption.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getRiskIcon(assumption.riskLevel)}
                        <span className="text-sm text-gray-600 capitalize">{assumption.riskLevel} Risk</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-3">{assumption.assumption}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                          <span className="text-sm font-medium text-gray-900">{assumption.confidence}%</span>
                        </div>
                        <Progress value={assumption.confidence} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedAssumption(selectedAssumption === assumption.id ? null : assumption.id)}
                  >
                    {selectedAssumption === assumption.id ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>

                {selectedAssumption === assumption.id && (
                  <div className="border-t pt-4 space-y-4">
                    {/* Evidence Section */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Evidence Collected</h4>
                      <div className="space-y-3">
                        {assumption.evidence.map((evidence, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="mt-0.5">
                              {getEvidenceIcon(evidence.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{evidence.source}</span>
                                <Badge variant={evidence.result === 'positive' ? 'default' : evidence.result === 'negative' ? 'destructive' : 'secondary'}>
                                  {evidence.result}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{evidence.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Tests */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Active Tests</h4>
                      <div className="space-y-2">
                        {assumption.tests.map((test, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{test.name}</span>
                              <Badge variant={test.status === 'completed' ? 'default' : 'secondary'}>
                                {test.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {(() => {
                                if ('conversion' in test && test.conversion) return test.conversion;
                                if ('responses' in test && test.responses) return `${test.responses} responses`;
                                if ('success_rate' in test && test.success_rate) return test.success_rate;
                                if ('insights' in test && test.insights) return `${test.insights} insights`;
                                return 'In progress';
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Evidence Form */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add New Evidence</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="evidence-type">Evidence Type</Label>
                            <Select value={evidenceType} onValueChange={setEvidenceType}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="interview">Customer Interview</SelectItem>
                                <SelectItem value="survey">Survey Data</SelectItem>
                                <SelectItem value="analytics">Analytics Data</SelectItem>
                                <SelectItem value="usability">Usability Test</SelectItem>
                                <SelectItem value="competitor">Competitor Research</SelectItem>
                                <SelectItem value="experiment">A/B Test</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="evidence-source">Source</Label>
                            <Input placeholder="e.g., Customer Interview #4" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="evidence-note">Evidence Details</Label>
                          <Textarea 
                            value={newEvidence}
                            onChange={(e) => setNewEvidence(e.target.value)}
                            placeholder="Describe what you learned and how it relates to this assumption..."
                            className="min-h-[80px]"
                          />
                        </div>
                        <Button onClick={addEvidence} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Evidence
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Key Insights & Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Validated Assumption
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Time spent on manual bookkeeping is confirmed as a real pain point. Move forward with automation features.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Risk Identified
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Setup complexity is a major barrier. Consider simplifying onboarding flow or offering white-glove setup for early customers.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Testing Recommendation
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Price sensitivity needs more testing. Consider running tiered pricing experiments with different customer segments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
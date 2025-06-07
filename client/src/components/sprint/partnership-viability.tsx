import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';

interface PartnershipViabilityProps {
  sprintId: number;
  intakeData?: any;
}

export default function PartnershipViability({ sprintId, intakeData }: PartnershipViabilityProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-purple-600" />
              Partnership Viability Analysis
            </div>
            <Button
              disabled
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              Coming Soon
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <Handshake className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-lg mb-2">Partnership Viability Analysis</p>
            <p className="text-sm">
              This module analyzes partnership opportunities and strategic alliances for your business model.
              Available when partnership evaluation is enabled in Initial Intake.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
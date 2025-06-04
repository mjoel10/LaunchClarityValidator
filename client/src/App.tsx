import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth.tsx";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import SprintView from "@/pages/sprint-view-fixed";
import IntakeForm from "@/pages/intake-form";
import DecisionEnginePage from "@/pages/decision-engine";
import ConsultantDashboard from "@/pages/consultant-dashboard";
import FeatureDemo from "@/pages/feature-demo";
import UnifiedDashboard from "@/pages/unified-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/consultant" component={ConsultantDashboard} />
      <Route path="/demo" component={FeatureDemo} />
      <Route path="/unified" component={UnifiedDashboard} />
      <Route path="/" component={UnifiedDashboard} />
      <Route path="/sprints/:id" component={SprintView} />
      <Route path="/sprints/:id/intake" component={IntakeForm} />
      <Route path="/sprints/:id/decision-engine" component={DecisionEnginePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

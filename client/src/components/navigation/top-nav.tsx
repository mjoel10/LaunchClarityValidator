import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, ChevronDown } from 'lucide-react';
import { useLocation } from 'wouter';

interface TopNavProps {
  selectedSprint?: any;
}

export default function TopNav({ selectedSprint }: TopNavProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: sprints } = useQuery({
    queryKey: ['/api/sprints', user?.id, user?.isConsultant],
    enabled: !!user,
  });

  const handleSprintChange = (sprintId: string) => {
    setLocation(`/sprints/${sprintId}`);
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 
                className="text-xl font-bold text-primary cursor-pointer" 
                onClick={() => setLocation('/')}
              >
                LaunchClarity
              </h1>
            </div>
            
            {sprints && sprints.length > 0 && (
              <div className="relative">
                <Select
                  value={selectedSprint?.id?.toString() || ""}
                  onValueChange={handleSprintChange}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a sprint">
                      {selectedSprint ? (
                        `${selectedSprint.companyName} - ${selectedSprint.tier.charAt(0).toUpperCase() + selectedSprint.tier.slice(1)} Sprint`
                      ) : (
                        "Select a sprint"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map((sprint: any) => (
                      <SelectItem key={sprint.id} value={sprint.id.toString()}>
                        {sprint.companyName} - {sprint.tier.charAt(0).toUpperCase() + sprint.tier.slice(1)} Sprint
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocation('/')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

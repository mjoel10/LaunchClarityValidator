import { User } from '@shared/schema';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Re-export the auth context and provider from auth.tsx
export { AuthProvider, useAuth } from './auth';

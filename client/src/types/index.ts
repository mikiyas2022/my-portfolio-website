// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  content?: {
    images?: string[];
    videos?: string[];
    slides?: string[];
    text?: string;
  };
}

export interface PortfolioState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  currentProject: Project | null;
} 
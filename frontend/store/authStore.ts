'use client';
import { create } from 'zustand';
import api from '@/lib/api';

export type UserRole = 'reader' | 'researcher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  isRootAdmin?: boolean;
  phone?: string;
  dob?: string;
  gender?: string;
  department?: string;
  designation?: string;
  fieldOfResearch?: string;
  researchInterests?: string;
  highestQualification?: string;
  orcid?: string;
  googleScholar?: string;
  linkedin?: string;
  bio?: string;
  country?: string;
  state?: string;
  city?: string;
  availableAsReviewer?: boolean;
  emailNotifications?: boolean;
  newIssueAlerts?: boolean;
  hasMembership?: boolean;
  membershipPlan?: 'monthly' | 'yearly' | 'lifetime';
  membershipExpiresAt?: string;
  certificates?: {
    fileUrl: string;
    fileName: string;
    note?: string;
    uploadedAt: string;
  }[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('swarn_token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('swarn_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const token = localStorage.getItem('swarn_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await api.get('/api/auth/me');
      set({ user: res.data.data, token, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('swarn_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('swarn_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await api.get('/api/auth/me');
      set({ user: res.data.data, token, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('swarn_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

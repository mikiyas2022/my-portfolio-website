// Authentication slice for managing token state
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocialLink {
  platform: string;
  url: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  domain: string;
  token: string;
  profileImage?: string;
  jobPosition?: string;
  aboutMe?: string;
  socialLinks?: SocialLink[];
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer; 
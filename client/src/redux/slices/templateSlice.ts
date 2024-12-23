import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Template {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

interface TemplateState {
  templates: Template[];
  selectedTemplate: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [
    {
      id: 'template1',
      name: 'Modern Portfolio',
      imageUrl: '/templates/modern.png',
      description: 'A clean, modern design perfect for showcasing your work'
    },
    {
      id: 'template2',
      name: 'Creative Portfolio',
      imageUrl: '/templates/creative.png',
      description: 'A creative and dynamic layout for artists and designers'
    },
    {
      id: 'template3',
      name: 'Professional Portfolio',
      imageUrl: '/templates/professional.png',
      description: 'A professional template ideal for business portfolios'
    }
  ],
  selectedTemplate: null,
  loading: false,
  error: null
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplate = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setSelectedTemplate, setLoading, setError } = templateSlice.actions;
export default templateSlice.reducer; 
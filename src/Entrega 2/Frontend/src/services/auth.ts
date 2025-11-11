import { api } from '@/lib/api';

export interface LoginRequest {
  userId?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  user_id: string;
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

export interface UpdateProfileRequest {
  name?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user_id?: string;
  role?: string;
  user_name?: string;
  user_email?: string;
  user?: any;
  msg?: string;
}

export const authService = {
  register: async (userData: RegisterRequest): Promise<any> => {
    const { data } = await api.post('/auth/cadastro', userData);
    return data;
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      // Store user data from login response
      const userData = {
        user_id: data.user_id,
        nome: data.user_name,
        email: data.user_email,
        cargo: data.role,
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<any> => {
    const { data: response } = await api.put('/auth/profile', data);
    
    // Fetch updated profile after update
    const userResponse = await api.get('/auth/profile');
    localStorage.setItem('user', JSON.stringify(userResponse.data.usuario));
    
    return response;
  },
};

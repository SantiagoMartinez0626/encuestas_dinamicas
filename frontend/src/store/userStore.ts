import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

function decodeJWT(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

const getInitialState = (): { user: User | null; token: string | null } => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = decodeJWT(token);
    if (user) return { user, token };
  }
  return { user: null, token: null };
};

const useUserStore = create<UserState>((set) => ({
  ...getInitialState(),
  setUser: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useUserStore; 
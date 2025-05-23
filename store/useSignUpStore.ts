import { create } from "zustand";

interface SignUpState {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  setClerkCredentials: (credentials: {
    username: string;
    password: string;
  }) => void;
  setPreferences: (preferences: Partial<SignUpState>) => void;
  reset: () => void;
  
}

const initialState = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  location: "",
  phone: "",
};

export const useSignUpStore = create<SignUpState>((set) => ({
  ...initialState,
  setClerkCredentials: (credentials) => set(credentials),
  setPreferences: (preferences) =>
    set((state) => ({ ...state, ...preferences })),
  preferences: initialState,
  reset: () => set(initialState),
}));
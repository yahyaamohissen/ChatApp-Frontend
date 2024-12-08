import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../Models/User';

// Define the structure of the auth state
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

// Initial state for auth
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

// Create the auth slice with login and logout actions
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
});

// Export the actions for use in components
export const { login, logout } = authSlice.actions;

// Export the reducer to configure the store
export default authSlice.reducer;

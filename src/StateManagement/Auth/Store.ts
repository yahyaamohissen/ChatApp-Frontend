import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Export the store to use in the app
export default store;

// Export RootState and AppDispatch types for better typing in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
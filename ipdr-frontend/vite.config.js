import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Force the environment variable to be available
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dmFzdC1jcmF3ZGFkLTY3LmNsZXJrLmFjY291bnRzLmRldiQ'),
    },
  };
});

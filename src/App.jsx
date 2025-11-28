import { SidebarProvider } from './components/ui/sidebar';
import AppSidebar from './components/custom-components/AppSidebar';
import AppHeader from './components/custom-components/AppHeader';
import { Outlet } from 'react-router';
import { useAuth } from './hooks/auth/AuthContext';
import { ProjectProvider } from './hooks/project/ProjectContext';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const { user, loading } = useAuth();
  const queryClient = new QueryClient();
  if (user) {
    return (
      <QueryClientProvider client={queryClient}>
        <ProjectProvider autoFetch={true}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider defaultOpen={true} name={'primary_sidebar'}>
              {/* <NavigationBar isSignedIn={isSignUp} /> */}
              <AppSidebar />
              <main className="w-screen">
                <AppHeader />
                <Outlet />
                <Toaster richColors />
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </ProjectProvider>
      </QueryClientProvider>
    );
  }
  return null;
}

export default App;

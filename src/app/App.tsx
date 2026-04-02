import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <div className="size-full max-w-md mx-auto bg-white">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </AppProvider>
  );
}

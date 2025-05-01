import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileUrlForm } from "./components/ProfileUrlForm";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[400px] bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            LinkedIn to Resume
          </h1>
        </div>
        <ProfileUrlForm />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;

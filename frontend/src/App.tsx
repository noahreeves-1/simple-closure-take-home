import React from "react";

import "./App.css";
import { ProfileUrlForm } from "./components/ProfileUrlForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="App">
      <h1>LinkedIn to Resume</h1>

      <ProfileUrlForm />
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

import { useEffect } from "react";
import AppRoutes from "./Views/AppRoutes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./Components/ui/ErrorBoundary";
import { hydrateAuth } from "./store/useStore";

const queryClient = new QueryClient();

//

function App() {
  useEffect(() => {
    // hydrate auth token from storage on client mount
    hydrateAuth();
  }, []);
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

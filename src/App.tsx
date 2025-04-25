import { AuthProvider } from "@/context/Auth";
import { GlobalProvider } from "@/context/Global";
import { TableProvider } from "@/context/Table";
// rcovery
import Main from "@/routes/Routes";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { BrowserRouter as Router } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/roboto-mono"; // Defaults to weight 400
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Hotjar from "@hotjar/browser";
import { LazyLoad } from "@/components/LazyLoad";

const siteId = 5128711;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

const stripePromise = loadStripe(
  "pk_test_51Ll5ukBgOlWo0lDUrBhA2W7EX2MwUH9AR5Y3KQoujf7PTQagZAJylWP1UOFbtH4UwxoufZbInwehQppWAq53kmNC00UIKSmebO"
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true
    }
  }
});

function App(): JSX.Element {
  return (
    <ErrorBoundary fallback={<div>Error</div>} onError={() => {}}>
      <LazyLoad brand>
        <AuthProvider>
          <GlobalProvider>
            <TableProvider>
              <QueryClientProvider client={queryClient}>
                <Router>
                  <Elements stripe={stripePromise}>
                    <Main />
                  </Elements>
                </Router>
              </QueryClientProvider>
            </TableProvider>
          </GlobalProvider>
        </AuthProvider>
      </LazyLoad>
    </ErrorBoundary>
  );
}

export default App;

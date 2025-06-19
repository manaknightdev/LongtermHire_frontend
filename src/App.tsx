import { AuthProvider } from "@/context/Auth";
import { GlobalProvider } from "@/context/Global";
import { TableProvider } from "@/context/Table";
import { ThemeProvider } from "@/context/Theme";
import { OfflineProvider } from "@/context/Offline";
import { ToastProvider, ToastContainer } from "@/components/Toast";

// rcovery
import Main from "@/routes/Routes";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { BrowserRouter as Router } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeStyles } from "@/components/ThemeStyles";
import { createOfflineQueryClient } from "@/query/offline/offlineQueryClient";
// import { OfflineIndicator } from "@/components/OfflineIndicator";
import { OfflineNotifications } from "@/components/OfflineNotifications";
import { OfflineStatusBar } from "@/components/OfflineStatusBar";
// import { OfflineDebugger } from "@/components/OfflineDebugger";

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

// Create an offline-aware query client
const queryClient = createOfflineQueryClient();

function App(): JSX.Element {
  return (
    <ErrorBoundary fallback={<div>Error</div>} onError={() => {}}>
      <QueryClientProvider client={queryClient}>
        <LazyLoad brand={"Brand Name Here"}>
          <ThemeProvider>
            <ThemeStyles />
            <OfflineProvider
              enableNotifications={true}
              enableAutoSync={true}
              config={{
                enableOfflineMode: true,
                maxRetries: 3,
                syncInterval: 30000,
                enableOptimisticUpdates: true,
                enableBackgroundSync: true,
              }}
            >
              <ToastProvider>
                <AuthProvider>
                  <GlobalProvider>
                    <TableProvider>
                      <Router>
                        <Elements stripe={stripePromise}>
                          <Main />
                          {/* Offline UI Components */}

                          <OfflineStatusBar position="top" />
                          <OfflineNotifications position="top-right" />
                          {/* <OfflineDebugger /> */}
                          <ToastContainer />
                        </Elements>
                      </Router>
                    </TableProvider>
                  </GlobalProvider>
                </AuthProvider>
              </ToastProvider>
            </OfflineProvider>
          </ThemeProvider>
        </LazyLoad>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

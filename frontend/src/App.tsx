import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';

import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { DashboardPage } from './pages/DashboardPage';
import { CapgenLoginPage } from './pages/CapgenLoginPage';
import { CapgenSignupPage } from './pages/CapgenSignupPage';

import { HistoryPage } from './pages/HistoryPage';
import { EvaluationPage } from './pages/EvaluationPage';
import AdminPage from './pages/AdminPage';

function LegacyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/studio" element={<DashboardPage />} />
          <Route path="/login" element={<CapgenLoginPage />} />
          <Route path="/signin" element={<CapgenLoginPage />} />
          <Route path="/signup" element={<CapgenSignupPage />} />
          <Route path="/register" element={<CapgenSignupPage />} />

          {/* Existing application routes preserved for compatibility */}
          <Route
            path="/history"
            element={
              <LegacyShell>
                <HistoryPage />
              </LegacyShell>
            }
          />
          <Route
            path="/evaluate"
            element={
              <LegacyShell>
                <EvaluationPage />
              </LegacyShell>
            }
          />
          <Route
            path="/admin"
            element={
              <LegacyShell>
                <AdminPage />
              </LegacyShell>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ProgressProvider } from './context/ProgressContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

import PageShell from './components/layout/PageShell';
import LandingPage from './pages/LandingPage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import Benefits from './pages/Benefits';
import Subscription from './pages/Subscription';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionCancelPage from './pages/SubscriptionCancelPage';
import Placeholder from './pages/Placeholder';
import SkillTreePage from './pages/SkillTreePage';
import ShopPage from './pages/ShopPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import TeamPage from './pages/TeamPage';
import PrivacyPage from './pages/PrivacyPage';
import DictionaryPage from './pages/DictionaryPage';

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/student" element={<Navigate to="/dashboard" replace />} />
          <Route element={<PageShell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/curriculum" element={<CoursePage />} />
            <Route path="/skilltree" element={<SkillTreePage />} />
            <Route path="/curriculum/:sectionSlug/:lessonSlug" element={<LessonPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Novas rotas adicionadas aqui */}
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
            <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}

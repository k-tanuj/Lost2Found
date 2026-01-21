import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import ReportWizard from './pages/ReportWizard';
import Browse from './pages/Browse';
import Matches from './pages/Matches';
import MyReports from './pages/MyReports';
import Profile from './pages/Profile';
import ItemDetail from './pages/ItemDetail';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <PageWrapper><Homepage /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <PrivateRoute>
              <PageWrapper><Browse /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <PrivateRoute>
              <PageWrapper><Matches /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/report/:type"
          element={
            <PrivateRoute>
              <PageWrapper><ReportWizard /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route path="/my-reports" element={<PrivateRoute><PageWrapper><MyReports /></PageWrapper></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><PageWrapper><Profile /></PageWrapper></PrivateRoute>} />
        <Route path="/item/:id" element={<PrivateRoute><PageWrapper><ItemDetail /></PageWrapper></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

              {/* Use conditional rendering for Navbar here if needed */}

              <AnimatedRoutes />
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;

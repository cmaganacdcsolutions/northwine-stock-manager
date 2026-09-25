import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { BranchProvider } from './context/BranchContext';
import { RequireBranch } from './context/RequireBranch';
import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { BranchSelectPage } from './pages/BranchSelectPage/BranchSelectPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { BarrelsPage } from './pages/BarrelsPage/BarrelsPage';
import { WinesPage } from './pages/WinesPage/WinesPage';
import { OrdersPage } from './pages/OrdersPage/OrdersPage';
import { MovementsPage } from './pages/MovementsPage/MovementsPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BranchProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/sucursales" element={<BranchSelectPage />} />

              <Route element={<RequireBranch />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/barriles" element={<BarrelsPage />} />
                  <Route path="/vinos" element={<WinesPage />} />
                  <Route path="/ordenes" element={<OrdersPage />} />
                  <Route path="/movimientos" element={<MovementsPage />} />
                  <Route path="/ajustes" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BranchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

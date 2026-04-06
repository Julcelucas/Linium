import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage'
import DashboardPage from './pages/DashboardPage'
import InfoPage from './pages/InfoPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SearchResultsPage from './pages/SearchResultsPage'

export default function RootApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/servicos" element={<SearchResultsPage />} />
        <Route path="/visao" element={<InfoPage section="visao" />} />
        <Route path="/estrutura" element={<InfoPage section="estrutura" />} />
        <Route path="/categorias" element={<InfoPage section="categorias" />} />
        <Route path="/impacto" element={<InfoPage section="impacto" />} />
        <Route path="/expansao" element={<InfoPage section="expansao" />} />
        <Route path="/contacto" element={<InfoPage section="contacto" />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/criar-conta" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

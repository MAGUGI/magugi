import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import UnauthorizedPage from './UnauthorizedPage';

/**
 * Protege rotas que exigem perfil de Administrador.
 * - Se não autenticado: redireciona para /login
 * - Se autenticado mas não admin: mostra componente de Acesso Negado (403)
 */
const AdminRoute = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
};

export default AdminRoute;

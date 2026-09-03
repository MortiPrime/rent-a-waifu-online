import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, roleLoading } = useAuth();

  // En rutas de admin esperamos también a que termine la verificación de rol,
  // de lo contrario el administrador es expulsado antes de conocer su rol.
  if (loading || (adminOnly && roleLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-app">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-brand" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

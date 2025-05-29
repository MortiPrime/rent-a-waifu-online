
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole, UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  profile: UserProfile | null;
  updateProfile: (updates: any) => Promise<void>;
  userRole: UserRole;
  isClient: boolean;
  isGirlfriend: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  // Compute user role and permissions
  const userRole: UserRole = profile?.user_role || 'client';
  const isClient = userRole === 'client';
  const isGirlfriend = userRole === 'girlfriend';
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile after authentication
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          user_id: data.id,
          full_name: data.full_name,
          username: data.username,
          avatar_url: data.avatar_url,
          user_role: (data as any).user_role || 'client',
          subscription_type: data.subscription_type,
          subscription_expires_at: data.subscription_expires_at,
          favorite_characters: data.favorite_characters || [],
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            user_role: (metadata as any).user_role || 'client'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente.",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Error al crear cuenta",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    profile,
    updateProfile,
    userRole,
    isClient,
    isGirlfriend,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Mail, Lock, User, Crown } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userRole: 'client' as 'client' | 'girlfriend'
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(signInData.email, signInData.password);
      navigate('/');
    } catch (error) {
      // Error handling is done in the useAuth hook
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await signUp(signUpData.email, signUpData.password, {
        full_name: signUpData.fullName,
        user_role: signUpData.userRole
      });
      
      // If successful, switch to sign in tab
      setActiveTab('signin');
      setSignInData({
        email: signUpData.email,
        password: ''
      });
    } catch (error) {
      // Error handling is done in the useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="w-10 h-10 text-primary" />
            <span className="text-2xl font-playfair font-bold text-white">
              AnimeDating
            </span>
          </Link>
          <p className="text-gray-300 mt-2">
            Conecta con personas increíbles
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Bienvenido</CardTitle>
            <CardDescription className="text-gray-300">
              Inicia sesión o crea tu cuenta para comenzar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 glass-card">
                <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="pl-10 bg-white/10 text-white border-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="pl-10 bg-white/10 text-white border-white/20"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full anime-button" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">
                      Nombre Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                        className="pl-10 bg-white/10 text-white border-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="pl-10 bg-white/10 text-white border-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-role" className="text-white">
                      Tipo de Usuario
                    </Label>
                    <Select onValueChange={(value: 'client' | 'girlfriend') => setSignUpData(prev => ({ ...prev, userRole: value }))}>
                      <SelectTrigger className="bg-white/10 text-white border-white/20">
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Cliente - Busco companía
                          </div>
                        </SelectItem>
                        <SelectItem value="girlfriend">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Companion - Ofrezco servicios
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="pl-10 bg-white/10 text-white border-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-white">
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="pl-10 bg-white/10 text-white border-white/20"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full anime-button" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;

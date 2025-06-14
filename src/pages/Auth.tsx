
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userRole: 'client' as 'client' | 'girlfriend'
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};

    if (!registerData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!registerData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateLoginForm()) {
      return;
    }

    try {
      console.log('Iniciando sesión con:', loginData.email);
      await signIn(loginData.email, loginData.password);
      toast({
        title: "¡Bienvenida!",
        description: "Has iniciado sesión correctamente",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error en login:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Verifica tus credenciales e intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateRegisterForm()) {
      return;
    }

    try {
      console.log('Registrando usuario:', registerData.email, registerData.userRole);
      await signUp(registerData.email, registerData.password, {
        full_name: registerData.fullName.trim(),
        user_role: registerData.userRole
      });
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error en registro:', error);
      toast({
        title: "Error al crear cuenta",
        description: error.message || "Hubo un problema al crear tu cuenta. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">
              Bienvenida
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full" onValueChange={clearErrors}>
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">
                  Registro
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => {
                          setLoginData(prev => ({ ...prev, password: e.target.value }));
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 pr-10 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        placeholder="Tu contraseña"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-white font-medium">
                      Nombre Completo
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => {
                        setRegisterData(prev => ({ ...prev, fullName: e.target.value }));
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 ${
                        errors.fullName ? 'border-red-500' : ''
                      }`}
                      placeholder="Tu nombre completo"
                      disabled={loading}
                    />
                    {errors.fullName && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white font-medium">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => {
                        setRegisterData(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-role" className="text-white font-medium">
                      Tipo de Usuario
                    </Label>
                    <Select 
                      value={registerData.userRole} 
                      onValueChange={(value: 'client' | 'girlfriend') => 
                        setRegisterData(prev => ({ ...prev, userRole: value }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="client" className="text-white">Cliente</SelectItem>
                        <SelectItem value="girlfriend" className="text-white">Companion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, password: e.target.value }));
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 pr-10 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-white font-medium">
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }));
                          if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }}
                        className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 pr-10 ${
                          errors.confirmPassword ? 'border-red-500' : ''
                        }`}
                        placeholder="Confirma tu contraseña"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

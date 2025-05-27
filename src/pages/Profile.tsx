
import { useState } from 'react';
import { User, Heart, Settings, Calendar, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import CharacterCard from '@/components/CharacterCard';
import { characters } from '@/data/characters';

const Profile = () => {
  const [favorites, setFavorites] = useState<number[]>([1, 3, 4]);
  
  // Mock user data
  const user = {
    name: "Usuario Demo",
    email: "demo@animedating.com",
    joinDate: "Enero 2024",
    currentPlan: "premium",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  const favoriteCharacters = characters.filter(char => favorites.includes(char.id));

  const handleFavoriteToggle = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const getPlanInfo = (plan: string) => {
    switch(plan) {
      case 'premium':
        return {
          name: 'Premium',
          icon: Star,
          color: 'from-primary-400 to-primary-600',
          benefits: ['Companions premium', 'Contenido exclusivo', 'Sin anuncios']
        };
      case 'vip':
        return {
          name: 'VIP',
          icon: Crown,
          color: 'from-yellow-400 to-orange-500',
          benefits: ['Todo Premium', 'Companions VIP', 'Videollamadas']
        };
      default:
        return {
          name: 'Básico',
          icon: User,
          color: 'from-gray-400 to-gray-600',
          benefits: ['Companions básicas', 'Chat ilimitado']
        };
    }
  };

  const currentPlanInfo = getPlanInfo(user.currentPlan);
  const PlanIcon = currentPlanInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2">
                  <div className={`w-12 h-12 bg-gradient-to-r ${currentPlanInfo.color} rounded-full flex items-center justify-center border-4 border-white`}>
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">Miembro desde {user.joinDate}</span>
                  </div>
                  <Badge className={`bg-gradient-to-r ${currentPlanInfo.color} text-white`}>
                    Plan {currentPlanInfo.name}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Editar Perfil</span>
                  </Button>
                  <Button className="anime-button">
                    Actualizar Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="favorites" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
              <TabsTrigger value="favorites">Favoritas ({favorites.length})</TabsTrigger>
              <TabsTrigger value="subscription">Suscripción</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Companions Favoritas</h2>
                  <p className="text-gray-600">
                    Tus companions favoritas aparecerán aquí para acceso rápido
                  </p>
                </div>

                {favoriteCharacters.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteCharacters.map((character) => (
                      <CharacterCard
                        key={character.id}
                        {...character}
                        isFavorite={true}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No tienes favoritas aún
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Explora el catálogo y añade companions a tus favoritas
                    </p>
                    <Button className="anime-button">
                      Explorar Catálogo
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PlanIcon className="w-6 h-6" />
                      <span>Plan Actual: {currentPlanInfo.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Gestiona tu suscripción y beneficios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Plan Benefits */}
                        <div>
                          <h4 className="font-semibold mb-3">Beneficios incluidos:</h4>
                          <ul className="space-y-2">
                            {currentPlanInfo.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-gray-700">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Subscription Info */}
                        <div>
                          <h4 className="font-semibold mb-3">Información de pago:</h4>
                          <div className="space-y-2 text-gray-600">
                            <p>Próximo pago: 15 de Febrero, 2024</p>
                            <p>Método: •••• •••• •••• 1234</p>
                            <p>Estado: Activa</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <Button className="anime-button">
                          Cambiar Plan
                        </Button>
                        <Button variant="outline">
                          Actualizar Método de Pago
                        </Button>
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          Cancelar Suscripción
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas de Uso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">24</div>
                        <div className="text-sm text-gray-600">Companions conocidas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">150</div>
                        <div className="text-sm text-gray-600">Conversaciones</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">45</div>
                        <div className="text-sm text-gray-600">Días activo</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">3</div>
                        <div className="text-sm text-gray-600">Favoritas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Cuenta</CardTitle>
                    <CardDescription>
                      Gestiona tus preferencias y configuración de privacidad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Notifications */}
                    <div>
                      <h4 className="font-semibold mb-3">Notificaciones</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Nuevas companions disponibles</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Recordatorios de suscripción</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>Ofertas especiales</span>
                        </label>
                      </div>
                    </div>

                    {/* Privacy */}
                    <div>
                      <h4 className="font-semibold mb-3">Privacidad</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Perfil público</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>Mostrar estadísticas</span>
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                      <Button className="anime-button">
                        Guardar Cambios
                      </Button>
                      <Button variant="outline">
                        Descargar Datos
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Eliminar Cuenta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;

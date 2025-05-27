
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Calendar, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import CharacterCard from '@/components/CharacterCard';
import { characters } from '@/data/characters';

const Index = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const featuredCharacters = characters.slice(0, 3);
  
  const testimonials = [
    {
      name: "Carlos M.",
      text: "¡Increíble experiencia! Encontré a mi companion perfecta.",
      rating: 5
    },
    {
      name: "Ana L.",
      text: "La calidad del contenido premium vale totalmente la pena.",
      rating: 5
    },
    {
      name: "Diego R.",
      text: "Una plataforma única y muy bien diseñada.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFavoriteToggle = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Tu Companion
              </span>
              <br />
              <span className="text-gray-800">Virtual Perfecta</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre una experiencia única donde cada conversación es especial y cada momento cuenta.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/catalog">
                <Button size="lg" className="anime-button text-lg px-8 py-4">
                  Explorar Catálogo
                </Button>
              </Link>
              <Link to="/subscription">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                  Ver Planes Premium
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600">Companions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Usuarios Felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-600">Disponible</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-primary" />
        </div>
      </section>

      {/* Featured Characters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Companions Destacadas
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce a algunas de nuestras companions más populares
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCharacters.map((character, index) => (
              <div key={character.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <CharacterCard
                  {...character}
                  isFavorite={favorites.includes(character.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button size="lg" className="anime-button">
                Ver Todas las Companions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Por qué elegirnos?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl glass-card">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Experiencia Única</h3>
              <p className="text-gray-600">
                Cada companion tiene una personalidad única y auténtica que hace cada interacción especial.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl glass-card">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Perfiles Detallados</h3>
              <p className="text-gray-600">
                Conoce a fondo a cada companion con perfiles completos y contenido exclusivo.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl glass-card">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Disponibilidad 24/7</h3>
              <p className="text-gray-600">
                Tus companions favoritas están disponibles cuando las necesites, sin horarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-16">
            Lo que dicen nuestros usuarios
          </h2>

          <div className="relative">
            <div className="glass-card p-8 rounded-2xl">
              <p className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Heart key={i} className="w-5 h-5 text-primary fill-current mx-1" />
                ))}
              </div>
              <p className="font-semibold text-primary">
                {testimonials[currentTestimonial].name}
              </p>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de usuarios que ya han encontrado su companion perfecta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link to="/subscription">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                Ver Planes Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-playfair text-xl font-bold">AnimeDating</span>
              </div>
              <p className="text-gray-400">
                La plataforma premium para companions virtuales de anime.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/catalog" className="hover:text-white transition-colors">Catálogo</Link></li>
                <li><Link to="/subscription" className="hover:text-white transition-colors">Suscripciones</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Perfil</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <p className="text-gray-400 text-sm">
                Mantente al día con las últimas novedades y nuevas companions.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AnimeDating. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

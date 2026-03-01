
import { Heart, Coffee, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import AnnouncementBanner from '@/components/AnnouncementBanner';

const Donations = () => {
  const donationOptions = [
    { amount: 50, icon: Coffee, label: 'Un café', color: 'from-amber-400 to-amber-600' },
    { amount: 100, icon: Heart, label: 'Apoyo básico', color: 'from-pink-400 to-pink-600' },
    { amount: 250, icon: Star, label: 'Apoyo premium', color: 'from-purple-400 to-purple-600' },
    { amount: 500, icon: Gift, label: 'Super apoyo', color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Apoya la
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Plataforma
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Esta plataforma es completamente gratuita. Si te gusta lo que hacemos, 
              considera apoyarnos con una donación voluntaria para seguir mejorando.
            </p>
          </div>

          <AnnouncementBanner location="donations" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {donationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.amount} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                  <CardHeader className="text-center pb-2">
                    <div className={`w-14 h-14 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{option.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-white mb-4">${option.amount} MXN</p>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                      Donar ${option.amount}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Transfer info */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Donación por Transferencia</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-white/80">
                También puedes apoyarnos directamente por transferencia bancaria:
              </p>
              <div className="bg-white/5 rounded-lg p-4 inline-block">
                <p className="text-white font-mono text-lg">Nu Bank</p>
                <p className="text-white/80 text-sm">CLABE: 638180000192603131</p>
              </div>
              <p className="text-white/60 text-sm">
                ¡Cada aportación nos ayuda a mantener la plataforma gratuita para todos!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donations;

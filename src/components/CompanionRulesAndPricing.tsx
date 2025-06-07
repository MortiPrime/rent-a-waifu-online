
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, DollarSign, Shield, Clock, Heart, Coffee, UtensilsCrossed, Calendar, Plane } from 'lucide-react';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { useToast } from '@/hooks/use-toast';

const CompanionRulesAndPricing = () => {
  const { profile, rules, addRule, removeRule, updateProfile } = useCompanionProfile();
  const { toast } = useToast();
  const [newRule, setNewRule] = useState({ type: 'boundary' as 'boundary' | 'availability' | 'pricing' | 'behavior', text: '' });
  const [pricing, setPricing] = useState({
    date_cost: profile?.pricing?.date_cost || 500,
    basic_chat: profile?.pricing?.basic_chat || 150,
    premium_chat: profile?.pricing?.premium_chat || 300,
    video_call: profile?.pricing?.video_call || 500,
    date_packages: profile?.pricing?.date_packages || {
      coffee_date: { price: 300, duration: '2 horas', includes: ['Café', 'Conversación', 'Compañía agradable'] },
      dinner_date: { price: 800, duration: '3 horas', includes: ['Cena', 'Conversación', 'Acompañamiento a restaurante'] },
      event_companion: { price: 1200, duration: '4-6 horas', includes: ['Acompañamiento a evento', 'Conversación', 'Presencia elegante'] },
      weekend_companion: { price: 2500, duration: 'Fin de semana', includes: ['Compañía todo el día', 'Actividades variadas', 'Flexibilidad de horarios'] }
    }
  });

  const ruleTypes = [
    { value: 'boundary', label: 'Límites personales', icon: Shield },
    { value: 'availability', label: 'Disponibilidad', icon: Clock },
    { value: 'pricing', label: 'Precios especiales', icon: DollarSign },
    { value: 'behavior', label: 'Comportamiento esperado', icon: Heart }
  ];

  const datePackages = [
    {
      key: 'coffee_date',
      name: 'Cita de Café',
      icon: Coffee,
      description: 'Encuentro casual en cafetería',
      defaultDuration: '2 horas',
      defaultIncludes: ['Café o bebida', 'Conversación amena', 'Compañía agradable']
    },
    {
      key: 'dinner_date',
      name: 'Cena Romántica',
      icon: UtensilsCrossed,
      description: 'Cena elegante en restaurante',
      defaultDuration: '3 horas',
      defaultIncludes: ['Acompañamiento a restaurante', 'Conversación durante la cena', 'Presencia elegante']
    },
    {
      key: 'event_companion',
      name: 'Acompañante de Evento',
      icon: Calendar,
      description: 'Acompañamiento a eventos sociales',
      defaultDuration: '4-6 horas',
      defaultIncludes: ['Acompañamiento a evento', 'Presencia social', 'Conversación apropiada']
    },
    {
      key: 'weekend_companion',
      name: 'Compañía de Fin de Semana',
      icon: Plane,
      description: 'Compañía extendida',
      defaultDuration: 'Fin de semana completo',
      defaultIncludes: ['Compañía todo el día', 'Actividades variadas', 'Flexibilidad total']
    }
  ];

  const handleAddRule = async () => {
    if (!newRule.text.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe el texto de la regla",
        variant: "destructive",
      });
      return;
    }

    await addRule(newRule.type, newRule.text);
    setNewRule({ type: 'boundary', text: '' });
  };

  const handleUpdatePricing = async () => {
    if (!profile) return;

    await updateProfile({
      ...profile,
      pricing: {
        ...profile.pricing,
        ...pricing
      }
    });

    toast({
      title: "Precios actualizados",
      description: "Tus precios han sido actualizados exitosamente.",
    });
  };

  const updatePackagePrice = (packageKey: string, price: number) => {
    setPricing(prev => ({
      ...prev,
      date_packages: {
        ...prev.date_packages,
        [packageKey]: {
          ...prev.date_packages[packageKey],
          price
        }
      }
    }));
  };

  const updatePackageDuration = (packageKey: string, duration: string) => {
    setPricing(prev => ({
      ...prev,
      date_packages: {
        ...prev.date_packages,
        [packageKey]: {
          ...prev.date_packages[packageKey],
          duration
        }
      }
    }));
  };

  const updatePackageIncludes = (packageKey: string, includes: string[]) => {
    setPricing(prev => ({
      ...prev,
      date_packages: {
        ...prev.date_packages,
        [packageKey]: {
          ...prev.date_packages[packageKey],
          includes
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Precios y Reglas</h1>
          <p className="text-gray-300">Establece tus precios detallados y reglas para las citas</p>
        </div>

        {/* Basic Services Pricing */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Servicios Básicos (MXN)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium">Chat Básico</Label>
                <Input
                  type="number"
                  value={pricing.basic_chat}
                  onChange={(e) => setPricing(prev => ({ ...prev, basic_chat: parseInt(e.target.value) }))}
                  placeholder="ej. 150"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-medium">Chat Premium</Label>
                <Input
                  type="number"
                  value={pricing.premium_chat}
                  onChange={(e) => setPricing(prev => ({ ...prev, premium_chat: parseInt(e.target.value) }))}
                  placeholder="ej. 300"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-medium">Video Llamada</Label>
                <Input
                  type="number"
                  value={pricing.video_call}
                  onChange={(e) => setPricing(prev => ({ ...prev, video_call: parseInt(e.target.value) }))}
                  placeholder="ej. 500"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-medium">Cita Base *</Label>
                <Input
                  type="number"
                  value={pricing.date_cost}
                  onChange={(e) => setPricing(prev => ({ ...prev, date_cost: parseInt(e.target.value) }))}
                  placeholder="ej. 500"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
                <p className="text-sm text-gray-300">Precio base para citas presenciales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Packages */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Paquetes de Citas Detallados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {datePackages.map((pkg) => {
              const Icon = pkg.icon;
              const packageData = pricing.date_packages[pkg.key];
              
              return (
                <div key={pkg.key} className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-pink-400" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">{pkg.name}</h3>
                      <p className="text-gray-300 text-sm">{pkg.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Precio (MXN)</Label>
                      <Input
                        type="number"
                        value={packageData.price}
                        onChange={(e) => updatePackagePrice(pkg.key, parseInt(e.target.value))}
                        className="bg-white/10 border-white/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Duración</Label>
                      <Input
                        value={packageData.duration}
                        onChange={(e) => updatePackageDuration(pkg.key, e.target.value)}
                        placeholder="ej. 2 horas"
                        className="bg-white/10 border-white/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Incluye</Label>
                      <Textarea
                        value={packageData.includes.join(', ')}
                        onChange={(e) => updatePackageIncludes(pkg.key, e.target.value.split(', ').filter(item => item.trim()))}
                        placeholder="Separar con comas"
                        className="bg-white/10 border-white/30 text-white"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {packageData.includes.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-white border-white/30">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">💰 Sistema de Pagos Intermediarios</h4>
              <p className="text-white/80 text-sm">
                La plataforma actuará como intermediario en todos los pagos. El dinero se liberará una vez que 
                ambas partes confirmen que la cita se realizó exitosamente según lo acordado.
              </p>
            </div>

            <Button 
              onClick={handleUpdatePricing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg py-3"
            >
              Actualizar Todos los Precios
            </Button>
          </CardContent>
        </Card>

        {/* Rules Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Mis Reglas y Límites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Rule */}
            <div className="space-y-4 p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-semibold">Agregar Nueva Regla</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Tipo de Regla</Label>
                  <Select value={newRule.type} onValueChange={(value: 'boundary' | 'availability' | 'pricing' | 'behavior') => setNewRule(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {ruleTypes.map(type => (
                        <SelectItem key={type.value} value={type.value} className="text-white">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-white font-medium">Descripción de la Regla</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={newRule.text}
                      onChange={(e) => setNewRule(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="ej. No acepto citas en lugares privados"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                      rows={2}
                    />
                    <Button 
                      onClick={handleAddRule}
                      className="bg-green-500 hover:bg-green-600 px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Rules */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Reglas Actuales</h4>
              {rules.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No has agregado reglas aún</p>
                  <p className="text-sm">Las reglas ayudan a establecer expectativas claras</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rules.map((rule) => {
                    const ruleType = ruleTypes.find(t => t.value === rule.rule_type);
                    const Icon = ruleType?.icon || Shield;
                    
                    return (
                      <div key={rule.id} className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
                        <Icon className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs border-white/30 text-white">
                              {ruleType?.label}
                            </Badge>
                          </div>
                          <p className="text-white text-sm">{rule.rule_text}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRule(rule.id)}
                          className="border-red-400 text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">💡 Consejos para las Reglas</h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Sé clara y específica en tus límites</li>
                <li>• Incluye información sobre lugares de encuentro preferidos</li>
                <li>• Especifica horarios de disponibilidad</li>
                <li>• Menciona cualquier restricción importante</li>
                <li>• Define claramente qué incluye cada tipo de cita</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanionRulesAndPricing;

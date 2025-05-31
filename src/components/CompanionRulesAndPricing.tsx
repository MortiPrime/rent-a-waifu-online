import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, DollarSign, Shield, Clock, Heart } from 'lucide-react';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { useToast } from '@/hooks/use-toast';

const CompanionRulesAndPricing = () => {
  const { profile, rules, addRule, removeRule, createOrUpdateProfile } = useCompanionProfile();
  const { toast } = useToast();
  const [newRule, setNewRule] = useState({ type: 'boundary', text: '' });
  const [pricing, setPricing] = useState({
    date_cost: profile?.pricing?.date_cost || 500,
    basic_chat: profile?.pricing?.basic_chat || 150,
    premium_chat: profile?.pricing?.premium_chat || 300,
    video_call: profile?.pricing?.video_call || 500
  });

  const ruleTypes = [
    { value: 'boundary', label: 'Límites personales', icon: Shield },
    { value: 'availability', label: 'Disponibilidad', icon: Clock },
    { value: 'pricing', label: 'Precios especiales', icon: DollarSign },
    { value: 'behavior', label: 'Comportamiento esperado', icon: Heart }
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

    await addRule(newRule.type as any, newRule.text);
    setNewRule({ type: 'boundary', text: '' });
  };

  const handleUpdatePricing = async () => {
    if (!profile) return;

    await createOrUpdateProfile({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reglas y Precios</h1>
          <p className="text-gray-300">Establece tus reglas y precios para las citas</p>
        </div>

        {/* Pricing Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Precios de Servicios (MXN)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium">Costo por Cita Presencial *</Label>
                <Input
                  type="number"
                  value={pricing.date_cost}
                  onChange={(e) => setPricing(prev => ({ ...prev, date_cost: parseInt(e.target.value) }))}
                  placeholder="ej. 500"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
                <p className="text-sm text-gray-300">Este será el costo base por cita presencial</p>
              </div>
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
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">💰 Sistema de Pagos Intermediarios</h4>
              <p className="text-white/80 text-sm">
                La plataforma actuará como intermediario en los pagos. El dinero se liberará una vez que 
                ambas partes confirmen que la cita se realizó exitosamente.
              </p>
            </div>

            <Button 
              onClick={handleUpdatePricing}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Actualizar Precios
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
                  <Select value={newRule.type} onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value }))}>
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

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">💡 Consejos para las Reglas</h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Sé clara y específica en tus límites</li>
                <li>• Incluye información sobre lugares de encuentro preferidos</li>
                <li>• Especifica horarios de disponibilidad</li>
                <li>• Menciona cualquier restricción importante</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanionRulesAndPricing;

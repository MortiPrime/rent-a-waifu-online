
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { CompanionRule } from '@/types';
import { Shield, Plus, X } from 'lucide-react';

const CompanionRulesManager = () => {
  const { rules, addRule, removeRule, loading } = useCompanionProfile();
  const [newRule, setNewRule] = useState({
    rule_type: 'boundary' as CompanionRule['rule_type'],
    rule_text: ''
  });

  const ruleTypes = [
    { value: 'boundary', label: 'Límites Personales' },
    { value: 'availability', label: 'Disponibilidad' },
    { value: 'pricing', label: 'Precios' },
    { value: 'behavior', label: 'Comportamiento' }
  ];

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'boundary': return 'bg-red-500';
      case 'availability': return 'bg-blue-500';
      case 'pricing': return 'bg-green-500';
      case 'behavior': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.rule_text.trim()) return;

    await addRule(newRule.rule_type, newRule.rule_text);
    setNewRule({ rule_type: 'boundary', rule_text: '' });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Nueva Regla
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRule} className="space-y-4">
            <div>
              <Label className="text-white">Tipo de Regla</Label>
              <Select onValueChange={(value: CompanionRule['rule_type']) => setNewRule(prev => ({
                ...prev,
                rule_type: value
              }))}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Selecciona el tipo de regla" />
                </SelectTrigger>
                <SelectContent>
                  {ruleTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rule_text" className="text-white">Descripción de la Regla *</Label>
              <Textarea
                id="rule_text"
                value={newRule.rule_text}
                onChange={(e) => setNewRule(prev => ({ ...prev, rule_text: e.target.value }))}
                placeholder="Describe tu regla claramente..."
                rows={3}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full anime-button" 
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar Regla'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Mis Reglas ({rules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No tienes reglas establecidas
              </h3>
              <p className="text-gray-300">
                Establece reglas claras para una mejor experiencia con los clientes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getRuleTypeColor(rule.rule_type)} text-white`}>
                          {ruleTypes.find(t => t.value === rule.rule_type)?.label}
                        </Badge>
                      </div>
                      <p className="text-white">{rule.rule_text}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Creada: {new Date(rule.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500/80 hover:bg-red-500 ml-4"
                      onClick={() => removeRule(rule.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Ejemplos de Reglas</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li><strong>Límites:</strong> "No acepto conversaciones de contenido explícito"</li>
          <li><strong>Disponibilidad:</strong> "No estoy disponible los domingos"</li>
          <li><strong>Precios:</strong> "Los pagos deben realizarse antes del chat"</li>
          <li><strong>Comportamiento:</strong> "Requiero respeto y cortesía en todo momento"</li>
        </ul>
      </div>
    </div>
  );
};

export default CompanionRulesManager;

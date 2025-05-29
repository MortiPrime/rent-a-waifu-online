
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCompanionProfile } from '@/hooks/useCompanionProfile';
import { Plus, Trash2, Shield, Clock, DollarSign, Users } from 'lucide-react';
import { CompanionRule } from '@/types';

const CompanionRulesManager = () => {
  const { rules, addRule, removeRule, loading } = useCompanionProfile();
  const [newRuleType, setNewRuleType] = useState<CompanionRule['rule_type']>('boundary');
  const [newRuleText, setNewRuleText] = useState('');
  const [isAddingRule, setIsAddingRule] = useState(false);

  const handleAddRule = async () => {
    if (!newRuleText.trim()) return;

    setIsAddingRule(true);
    try {
      await addRule(newRuleType, newRuleText);
      setNewRuleText('');
    } catch (error) {
      console.error('Error adding rule:', error);
    } finally {
      setIsAddingRule(false);
    }
  };

  const handleRemoveRule = async (ruleId: string) => {
    if (window.confirm('¿Estás segura de que quieres eliminar esta regla?')) {
      await removeRule(ruleId);
    }
  };

  const getRuleIcon = (type: CompanionRule['rule_type']) => {
    switch (type) {
      case 'boundary': return <Shield className="w-4 h-4" />;
      case 'availability': return <Clock className="w-4 h-4" />;
      case 'pricing': return <DollarSign className="w-4 h-4" />;
      case 'behavior': return <Users className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getRuleTypeLabel = (type: CompanionRule['rule_type']) => {
    switch (type) {
      case 'boundary': return 'Límites';
      case 'availability': return 'Disponibilidad';
      case 'pricing': return 'Precios';
      case 'behavior': return 'Comportamiento';
      default: return type;
    }
  };

  const getRuleTypeColor = (type: CompanionRule['rule_type']) => {
    switch (type) {
      case 'boundary': return 'bg-red-500';
      case 'availability': return 'bg-blue-500';
      case 'pricing': return 'bg-green-500';
      case 'behavior': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const exampleRules = {
    boundary: [
      'No acepto contenido explícito o inapropiado',
      'Respeto mutuo en todas las conversaciones',
      'No comparto información personal fuera de la plataforma'
    ],
    availability: [
      'Respondo mensajes dentro de 2 horas en horario laboral',
      'Los fines de semana tengo disponibilidad limitada',
      'Aviso con anticipación si no estaré disponible'
    ],
    pricing: [
      'Los pagos se realizan antes del inicio de la sesión',
      'No se permiten reembolsos después de 24 horas',
      'Descuentos disponibles para clientes frecuentes'
    ],
    behavior: [
      'Mantengo conversaciones respetuosas y amigables',
      'Me adapto al estilo de conversación del cliente',
      'Siempre soy puntual y profesional'
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestión de Reglas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Select value={newRuleType} onValueChange={(value: CompanionRule['rule_type']) => setNewRuleType(value)}>
              <SelectTrigger className="bg-white/10 text-white">
                <SelectValue placeholder="Tipo de regla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boundary">Límites y Boundaries</SelectItem>
                <SelectItem value="availability">Disponibilidad</SelectItem>
                <SelectItem value="pricing">Precios y Pagos</SelectItem>
                <SelectItem value="behavior">Comportamiento</SelectItem>
              </SelectContent>
            </Select>
            
            <Textarea
              placeholder="Describe la regla..."
              value={newRuleText}
              onChange={(e) => setNewRuleText(e.target.value)}
              rows={3}
              className="bg-white/10 text-white"
            />
            
            <Button 
              onClick={handleAddRule} 
              disabled={isAddingRule || !newRuleText.trim()}
              className="anime-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAddingRule ? 'Agregando...' : 'Agregar Regla'}
            </Button>
          </div>

          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-2">Ejemplos de reglas por categoría:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(exampleRules).map(([type, examples]) => (
                <div key={type} className="space-y-1">
                  <p className="font-medium text-white">{getRuleTypeLabel(type as CompanionRule['rule_type'])}:</p>
                  <ul className="space-y-1 text-xs">
                    {examples.map((example, index) => (
                      <li key={index} className="text-gray-400">• {example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getRuleTypeColor(rule.rule_type)} text-white`}>
                      {getRuleIcon(rule.rule_type)}
                      <span className="ml-1">{getRuleTypeLabel(rule.rule_type)}</span>
                    </Badge>
                  </div>
                  <p className="text-white">{rule.rule_text}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Creada el {new Date(rule.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveRule(rule.id)}
                  className="ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No tienes reglas definidas
            </h3>
            <p className="text-gray-300">
              Establece reglas claras para mantener una experiencia profesional y segura.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanionRulesManager;

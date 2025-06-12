
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Crown } from 'lucide-react';

interface CompanionProfile {
  id: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  promotion_plan: string;
  status: string;
  created_at: string;
}

interface AdminResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

interface AdminCompanionManagementProps {
  companions: CompanionProfile[];
  onDataChange: () => void;
}

export const AdminCompanionManagement = ({ companions, onDataChange }: AdminCompanionManagementProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateCompanionPlan = async (companionId: string, promotionPlan: string) => {
    try {
      setUpdating(companionId);
      
      const { data, error } = await supabase
        .rpc('admin_update_companion_plan', {
          companion_profile_id: companionId,
          new_promotion_plan: promotionPlan,
          reason: 'Actualización manual por admin'
        });

      if (error) throw error;
      
      const response = data as AdminResponse;
      
      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Plan actualizado",
        description: response?.message || "El plan se actualizó correctamente",
      });

      onDataChange();

    } catch (error: any) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el plan",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{plan}</Badge>;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Gestión de Companions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-3">Companion</th>
                <th className="text-left p-3">Nombre Real</th>
                <th className="text-left p-3">Plan</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {companions.map((companion) => (
                <tr key={companion.id} className="border-b border-white/10">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{companion.stage_name}</p>
                      <p className="text-sm text-white/70">{companion.user_id}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{companion.real_name}</p>
                  </td>
                  <td className="p-3">
                    {getPlanBadge(companion.promotion_plan)}
                  </td>
                  <td className="p-3">
                    <Badge className={`${
                      companion.status === 'approved' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      {companion.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Select
                        value={companion.promotion_plan}
                        onValueChange={(value) => updateCompanionPlan(companion.id, value)}
                        disabled={updating === companion.id}
                      >
                        <SelectTrigger className="w-32 bg-white/10 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="basic" className="text-white">Básico</SelectItem>
                          <SelectItem value="premium" className="text-white">Premium</SelectItem>
                          <SelectItem value="vip" className="text-white">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

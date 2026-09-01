import { Badge } from '@/components/ui/badge';
import { Check, Clock, Crown, ShieldCheck, X } from 'lucide-react';

const base = 'border font-medium';

export const PlanBadge = ({ plan }: { plan?: string | null }) => {
  switch (plan) {
    case 'premium':
      return <Badge className={`${base} bg-brand-glow/20 text-brand-glow border-brand-glow/30`}>Premium</Badge>;
    case 'vip':
      return (
        <Badge className={`${base} bg-gold/20 text-gold border-gold/30`}>
          <Crown className="mr-1 h-3 w-3" />VIP
        </Badge>
      );
    default:
      return <Badge className={`${base} bg-surface/10 text-surface-foreground/70 border-surface-border/25`}>Básico</Badge>;
  }
};

export const StatusBadge = ({ status }: { status?: string | null }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className={`${base} bg-success/20 text-success border-success/30`}>
          <Check className="mr-1 h-3 w-3" />Aprobado
        </Badge>
      );
    case 'rejected':
    case 'cancelled':
      return (
        <Badge className={`${base} bg-destructive/20 text-destructive border-destructive/30`}>
          <X className="mr-1 h-3 w-3" />{status === 'rejected' ? 'Rechazado' : 'Cancelado'}
        </Badge>
      );
    default:
      return (
        <Badge className={`${base} bg-gold/20 text-gold border-gold/30`}>
          <Clock className="mr-1 h-3 w-3" />Pendiente
        </Badge>
      );
  }
};

export const RoleBadge = ({ role }: { role?: string | null }) => {
  switch (role) {
    case 'admin':
      return (
        <Badge className={`${base} bg-destructive/20 text-destructive border-destructive/30`}>
          <ShieldCheck className="mr-1 h-3 w-3" />Admin
        </Badge>
      );
    case 'girlfriend':
      return <Badge className={`${base} bg-brand/20 text-brand border-brand/30`}>Companion</Badge>;
    default:
      return <Badge className={`${base} bg-info/20 text-info border-info/30`}>Cliente</Badge>;
  }
};

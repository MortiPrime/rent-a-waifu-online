
import { useAuth } from '@/hooks/useAuth';
import { ProfileHeader } from './profile/ProfileHeader';
import { RoleConverter } from './profile/RoleConverter';
import { ProfileInfo } from './profile/ProfileInfo';
import { ProfileStats } from './profile/ProfileStats';
import { PaymentProofSubmission } from './profile/PaymentProofSubmission';
import { SubscriptionInfo } from './profile/SubscriptionInfo';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} profile={profile} updateProfile={updateProfile} />
      <RoleConverter profile={profile} updateProfile={updateProfile} />
      <ProfileInfo user={user} profile={profile} updateProfile={updateProfile} />
      
      {/* Información de suscripciones y planes */}
      <SubscriptionInfo profile={profile} />
      
      <ProfileStats profile={profile} />
      
      {/* Componente de comprobantes de pago solo para clientes */}
      {profile?.user_role === 'client' && <PaymentProofSubmission />}
    </div>
  );
};

export default UserProfile;

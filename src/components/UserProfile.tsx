
import { useAuth } from '@/hooks/useAuth';
import { ProfileHeader } from './profile/ProfileHeader';
import { RoleConverter } from './profile/RoleConverter';
import { ProfileInfo } from './profile/ProfileInfo';
import { ProfileStats } from './profile/ProfileStats';
import { PaymentProofSubmission } from './profile/PaymentProofSubmission';
import { SubscriptionInfo } from './profile/SubscriptionInfo';
import CompanionDashboard from './CompanionDashboard';
import FavoritesSection from './FavoritesSection';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} profile={profile} updateProfile={updateProfile} />
      <RoleConverter profile={profile} updateProfile={updateProfile} />
      <ProfileInfo user={user} profile={profile} updateProfile={updateProfile} />
      
      <SubscriptionInfo profile={profile} />
      
      {/* Favoritas del cliente */}
      {profile?.user_role === 'client' && <FavoritesSection />}
      
      <ProfileStats profile={profile} />
      
      {profile?.user_role === 'girlfriend' && <CompanionDashboard />}
      
      {profile?.user_role === 'client' && <PaymentProofSubmission />}
    </div>
  );
};

export default UserProfile;


import { useAuth } from '@/hooks/useAuth';
import { ProfileHeader } from './profile/ProfileHeader';
import { RoleConverter } from './profile/RoleConverter';
import { ProfileInfo } from './profile/ProfileInfo';
import { SubscriptionInfo } from './profile/SubscriptionInfo';
import { ProfileStats } from './profile/ProfileStats';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} profile={profile} updateProfile={updateProfile} />
      <RoleConverter profile={profile} updateProfile={updateProfile} />
      <ProfileInfo user={user} profile={profile} updateProfile={updateProfile} />
      <SubscriptionInfo profile={profile} />
      <ProfileStats profile={profile} />
    </div>
  );
};

export default UserProfile;

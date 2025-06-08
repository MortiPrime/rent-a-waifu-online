
import { useCompanionProfileData } from './useCompanionProfileData';
import { useCompanionProfileActions } from './useCompanionProfileActions';
import { useCompanionPhotos } from './useCompanionPhotos';
import { useCompanionRules } from './useCompanionRules';

export const useCompanionProfile = () => {
  const {
    profile,
    photos,
    rules,
    chatSessions,
    loading,
    setProfile,
    setPhotos,
    setRules,
    loadCompanionProfile
  } = useCompanionProfileData();

  const { updateProfile } = useCompanionProfileActions(profile, setProfile);
  const { addPhoto, removePhoto } = useCompanionPhotos(profile, photos, setPhotos);
  const { addRule, removeRule } = useCompanionRules(profile, rules, setRules);

  return {
    profile,
    photos,
    rules,
    chatSessions,
    loading,
    updateProfile,
    addPhoto,
    removePhoto,
    addRule,
    removeRule,
    loadCompanionProfile,
  };
};

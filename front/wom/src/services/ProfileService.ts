import ApiUtils from '../utils/ApiUtils';
import { UserProfile } from '../types/profileType';

class UserService {
  async fetchUserProfile(userId: string, authToken: string): Promise<UserProfile | null> {
    try {
      if (userId && authToken) {
        const response = await ApiUtils.getApiInstanceJson(authToken).get<UserProfile>(
          `/profil/${userId}`);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}

const profileService = new UserService();
export default profileService;

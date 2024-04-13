import ApiUtils from '../utils/ApiUtils';
import { UserProfile } from '../types/profileType';

class UserService {
  async fetchUserProfile(userId: string, authToken: string): Promise<UserProfile | null> {
    try {
      if (userId && authToken) {
        const response = await ApiUtils.getApiInstanceJson().get<UserProfile>(
          `/profil/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}

export default new UserService();

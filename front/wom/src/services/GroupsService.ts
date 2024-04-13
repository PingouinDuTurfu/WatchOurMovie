import ApiUtils from '../utils/ApiUtils';
import { Group } from '../types/groupType';

class GroupsService {
  async retrieveGroups(): Promise<Group[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/groups');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des genres');
    }
  }
}

export default new GroupsService();

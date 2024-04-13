import ApiUtils from '../utils/ApiUtils';
import { Group } from '../types/groupType';

class GroupsService {
  async retrieveGroups(): Promise<Group[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/groups');
      const groupNames = Object.keys(response.data);
      const groups: Group[] = groupNames.map((groupName) => ({
        groupName,
      }));
      return groups;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des groupes');
    }
  }

  async leaveGroup(groupName: string, authToken: string): Promise<void> {
    try {
      await ApiUtils.getApiInstanceJson(authToken).post('/group/leave', { groupName });
    } catch (error) {
      throw new Error('Erreur lors de la sortie du groupe');
    }
  }
}

export default new GroupsService();

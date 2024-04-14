import ApiUtils from '../utils/ApiUtils';

class GroupsService {
  
  async retrieveGroups(): Promise<string[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/groups');
      console.log(response.data);
      return response.data;
      
    } catch (error) {
      throw new Error('Erreur lors de la récupération des genres');
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

import ApiUtils from '../utils/ApiUtils';
import { Genre } from '../types/genreType';

class GenresService {
  async retrieveGenres(): Promise<Genre[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/genres');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des genres');
    }
  }
}

export default new GenresService();

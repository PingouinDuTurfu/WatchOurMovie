import { FilmDetails } from '../types/filmDetailsType';
import ApiUtils from '../utils/ApiUtils';

class FilmsService {
  async searchInMovies(searchInput: string, page: number, language: string): Promise<FilmDetails[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get<FilmDetails[]>(`/movies/${searchInput}/${page}?language=${language}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la recherche');
    }
  }
}

export default new FilmsService();

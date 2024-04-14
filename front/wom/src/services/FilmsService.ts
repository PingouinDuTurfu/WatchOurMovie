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

  async getMovies(moviePage: number, language: string): Promise<FilmDetails[]>{
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/movies/${moviePage}?language=${language}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des films");
    }
  }
}

const filmsService = new FilmsService();
export default filmsService;

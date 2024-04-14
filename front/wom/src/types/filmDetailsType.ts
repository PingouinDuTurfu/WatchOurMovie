import { Genre } from "./genreType";

export interface FilmDetails {
  id: number;
  genres: Genre[];
  image: string;
  overview: string;
  popularity: number;
  title: string;
  vote_average: number;
  vote_count: number;
  year: string;
}

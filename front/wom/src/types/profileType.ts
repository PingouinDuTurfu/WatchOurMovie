import { Film } from "./filmType";
import { Group } from "./groupType";

export interface UserProfile {
  _id: string;
  userId: string;
  username: string;
  name: string;
  lastname: string;
  language: string;
  moviesSeen: Film[];
  preferenceGenres: { name: string; id: number }[];
  groups: Group[];
}

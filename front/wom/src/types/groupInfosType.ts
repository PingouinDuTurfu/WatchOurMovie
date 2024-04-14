import { Genre } from "./genreType";
import { UserProfile } from "./profileType";

export interface GroupInfosType {
  groupName: string;
  members: UserProfile[];
  preferenceGenres: Genre[];
}

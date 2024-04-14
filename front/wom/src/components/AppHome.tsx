import { useEffect, useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieQuoteApi from './AppTestQuotesApi';
import { UserProfile } from '../types/profileType';
import { useAuth } from '../auth/AuthProvider';
import ProfileService from '../services/ProfileService';
import ApiUtils from '../utils/ApiUtils';
import styles from "../css/AppHome.module.css";
import { FilmDetails } from '../types/filmDetailsType';

export default function AppHome() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [films, setFilms] = useState<FilmDetails[]>([]);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    getMovies()
  }, [userId, authToken]); 

  async function fetchUserProfile() {
    if (userId === null || authToken === null) return;
    const userProfile = await ProfileService.fetchUserProfile(userId, authToken);
    setUserProfile(userProfile);
  }

  async function getMovies() {
    try {
      const language = localStorage.getItem("language") || "fr";
      const response = await ApiUtils.getApiInstanceJson().get(
        `/movies/1?language=${language}`
      );
      setFilms(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
  }

  return (
    <div className={styles.container}>
      {authToken && (
        <Paper className={styles.groupsContainer}>
        <Typography variant="h6">Mes groupes</Typography>
        <div>
          {userProfile && userProfile.groups.map((group, index) => (
            <div key={index} className={styles.groupItem}>
              <Paper className={styles.insideGroup}>
                {group.groupName}
                <Button className={styles.recommandationButton} component={Link} to={`/groupes/${group.groupName}`} variant="contained">Recommandation</Button>
              </Paper>
            </div>
          ))}
        </div>
        </Paper>
      )}
        
      <Typography variant="h6">Films du moment</Typography>
      <div className={styles.filmsContainer}>
          {films.map((film) => (
            <Link key={film.id} to={`/films/${film.id}`} className={styles.filmContainer}>
              <img src={film.image} alt={film.title} className={styles.filmImage} />
              <div className={styles.title}>{film.title}</div>
            </Link>
          ))}
      </div>
  
      <MovieQuoteApi />
    </div>
  );
}  
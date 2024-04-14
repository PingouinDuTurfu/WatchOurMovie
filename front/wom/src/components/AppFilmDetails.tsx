import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiUtils from '../utils/ApiUtils';
import { Button, CircularProgress } from '@mui/material';
import styles from "../css/AppFilmsDetails.module.css";
import { useAuth } from '../auth/AuthProvider';
import { UserProfile } from '../types/profileType';
import ProfileService from '../services/ProfileService';

interface FilmDetails {
  title: string;
  image: string;
  overview: string;
  id: number;
  year: string;
  genres: string[];
  vote_count: number;
  vote_average: number;
  popularity: number;
}

export default function AppFilmDetails() {
  const { filmId } = useParams<{ filmId: string }>();
  const [filmDetails, setFilmDetails] = useState<FilmDetails | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMovieSeen, setIsMovieSeen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authToken, userId } = useAuth();
  const language = localStorage.getItem("language") || "fr";

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        const response = await ApiUtils.getApiInstanceJson().get<FilmDetails>(`/movie/${filmId}`, {
          params: {
            language: language
          }
        });
        setFilmDetails(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du film :', error);
      }
    };

    fetchFilmDetails();
  }, [filmId]);

  useEffect(() => {
    fetchUserProfile();
  }, [userId, authToken]);

  useEffect(() => {
    if (userProfile && filmDetails) {
      setIsMovieSeen(userProfile.moviesSeen.some(movie => movie.id === filmDetails.id));
    }
  }, [userProfile, filmDetails]);
  
  async function fetchUserProfile() {
    if (userId === null || authToken === null) return;
    const userProfile = await ProfileService.fetchUserProfile(userId, authToken);
    setUserProfile(userProfile);
  }

  async function handleClickAddToSeen() {
    if (filmDetails) {
      try {
        setLoading(true);
        if (!authToken) return;
        await ApiUtils.getApiInstanceJson(authToken).post(
          '/addMovie',
          { id: filmDetails.id, language: language }
        );
        setLoading(false);
        setIsMovieSeen(true);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du film à la liste des films vus :', error);
        setLoading(false);
      }
    }
  }

  async function handleClickRemoveToSeen() {
    if (filmDetails) {
      try {
        setLoading(true);
        if (!authToken) return;
        await ApiUtils.getApiInstanceJson(authToken).post(
          '/removeMovie',
          { id: filmDetails.id, language: language }
        );
        setLoading(false);
        setIsMovieSeen(false);
      } catch (error) {
        console.error('Erreur lors de retirement du film à la liste des films vus :', error);
        setLoading(false);
      }
    }
}

  if (!filmDetails) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <div>Nous n'arrivons pas à récupérer les données de ce film, veuillez essayer de vous reconnecter.</div>
      </div>
    );
  }

  return (
    <div className={styles.filmContainer}>
      <div>
        <h2>{filmDetails.title}</h2>
        <img src={filmDetails.image} alt={filmDetails.title} className={styles.filmImage} />
      </div>
      <div className={styles.infosColumn}>
        <p>{filmDetails.overview}</p>
        <p>Année: {filmDetails.year}</p>
        <p>Genres: {filmDetails.genres.join(', ')}</p>
        <p>Nombre de votes: {filmDetails.vote_count}</p>
        <p>Note moyenne: {filmDetails.vote_average}</p>
        <p>Popularité: {filmDetails.popularity}</p>
        <Button color={isMovieSeen ? 'secondary' : 'primary'} variant='contained' onClick={isMovieSeen ? handleClickRemoveToSeen : handleClickAddToSeen} disabled={loading}>
          {loading ? 'En cours...' : isMovieSeen ? 'Supprimer de la liste des vus' : 'Ajouter aux films vus'}
        </Button>
      </div>
    </div>
  );
}

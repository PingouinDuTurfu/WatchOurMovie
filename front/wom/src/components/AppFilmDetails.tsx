import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiUtils from '../utils/ApiUtils';
import { Button, CircularProgress } from '@mui/material';
import styles from "../css/AppFilmsDetails.module.css";
import { useAuth } from '../auth/AuthProvider';

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
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        const response = await ApiUtils.getApiInstanceJson().get<FilmDetails>(`/movie/${filmId}`);
        setFilmDetails(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du film :', error);
      }
    };

    fetchFilmDetails();
  }, [filmId]);

  async function handleClickAddToSeen() {
    if (filmDetails) {
      try {
        setLoading(true);
        await ApiUtils.getApiInstanceJson().post(
          '/addMovie',
          { id: filmDetails.id, title: filmDetails.title },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du film à la liste des films vus :', error);
        setLoading(false);
      }
    }
  }

  if (!filmDetails) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <h2>{filmDetails.title}</h2>
      <img src={filmDetails.image} alt={filmDetails.title} className={styles.filmImage} />
      <p>{filmDetails.overview}</p>
      <p>Year: {filmDetails.year}</p>
      <p>Genres: {filmDetails.genres.join(', ')}</p>
      <p>Vote Count: {filmDetails.vote_count}</p>
      <p>Vote Average: {filmDetails.vote_average}</p>
      <p>Popularity: {filmDetails.popularity}</p>
      <Button variant='contained' onClick={handleClickAddToSeen} disabled={loading}>
        {loading ? 'En cours...' : 'Vu'}
      </Button>
      <Button variant='contained'>Non vu</Button>
    </div>
  );
}

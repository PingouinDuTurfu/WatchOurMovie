import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiUtils from '../utils/ApiUtils';
import { CircularProgress } from '@mui/material';

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

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        const response = await ApiUtils.getApiInstanceJson().get<FilmDetails>(`/movie/${filmId}`);
        setFilmDetails(response.data);
      } catch (error) {
        console.error('Erreur lors de la récuparation du film :', error);
      }
    };

    fetchFilmDetails();
  }, [filmId]);

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
      <img src={filmDetails.image} alt={filmDetails.title} />
      <p>{filmDetails.overview}</p>
      <p>Year: {filmDetails.year}</p>
      <p>Genres: {filmDetails.genres.join(', ')}</p>
      <p>Vote Count: {filmDetails.vote_count}</p>
      <p>Vote Average: {filmDetails.vote_average}</p>
      <p>Popularity: {filmDetails.popularity}</p>
    </div>
  );
}

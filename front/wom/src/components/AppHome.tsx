import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AppTestLyricsApi from './AppTestLyricsApi';
import MovieQuoteApi from './AppTestQuotesApi';

export default function AppHome() {
  return (
    <div>
      <Button variant='contained' component={Link} to="/recommandations">Recommandations</Button>
      <AppTestLyricsApi />
      <MovieQuoteApi />
    </div>
  );
}

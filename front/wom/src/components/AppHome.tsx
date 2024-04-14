import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AppTestLyricsApi from './AppTestLyricsApi';
import MovieQuoteApi from './AppTestQuotesApi';

export default function AppHome() {
  return (
    <div>
      <AppTestLyricsApi />
      <MovieQuoteApi />
    </div>
  );
}

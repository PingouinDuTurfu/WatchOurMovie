import { Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';

interface LyricsResponse {
  quote: string;
  album: string;
  song: string;
}

export default function AppTestApi() {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [album, setAlbum] = useState<string | null>(null);
  const [song, setSong] = useState<string | null>(null);

  const fetchLyrics = async () => {
    try {
      const response = await fetch('https://taylorswiftapi.onrender.com/get');
      const data: LyricsResponse = await response.json();
      setLyrics(data.quote);
      setAlbum(data.album);
      setSong(data.song);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={fetchLyrics}>Lyrics</Button>
      {lyrics && (
        <Paper elevation={3} style={{ margin: '1em', padding: '10px' }}>
          <Typography variant="h6">TS 💜</Typography>
          <Typography variant="body1">Lyrics : {lyrics}</Typography>
          <Typography variant="body2">Musique : {song}</Typography>
          <Typography variant="body2">Album : {album}</Typography>
        </Paper>
      )}
    </div>
  );
}
import { Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';

interface QuoteResponse {
  content: string;
  author: string;
}

export default function AppRandomQuote() {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data: QuoteResponse = await response.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={fetchRandomQuote}>Citation</Button>
      {quote && (
        <Paper elevation={3} style={{ margin: '1em', padding: '10px' }}>
          <Typography variant="h6">Citation</Typography>
          <Typography variant="body1">Citation : {quote}</Typography>
          <Typography variant="body2">Auteur : {author}</Typography>
        </Paper>
      )}
    </div>
  );
}
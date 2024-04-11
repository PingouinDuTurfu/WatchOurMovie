import { Button, FormControl, MenuItem, Paper, TextField } from '@mui/material'
import styles from "../css/AppInscription.module.css";
import ApiUtils from '../utils/ApiUtils';
import { Navigate } from 'react-router-dom';
import react, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AppInscription() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const auth = ApiUtils.getAuthToken();

  if (auth) {
    return <Navigate to="/profil" />;
  }

  const handleGenreSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGenre(event.target.value);
  };

  const handleAddGenre = () => {
    if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
      setSelectedGenres([...selectedGenres, selectedGenre]);
      setSelectedGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setSelectedGenres(selectedGenres.filter(genre => genre !== genreToRemove));
  };

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.paperInscription}>
        <div className={styles.inscriptionContainer}>
          <h2>Inscription</h2>
          <FormControl>
            <TextField className={styles.inputText} id="name" label="Prénom" variant="outlined" fullWidth />
            <TextField className={styles.inputText} id="lastname" label="Nom" variant="outlined" fullWidth />
            <TextField className={styles.inputText} id="email" label="Email" variant="outlined" fullWidth />
            <TextField className={styles.inputText} id="pseudo" label="Pseudo" variant="outlined" fullWidth />
            <TextField className={styles.inputText} id="password" label="Mot de passe" type="password" variant="outlined" fullWidth />
            <TextField
              className={styles.languageSelect}
              id="select-language"
              select
              label="Langue"
              defaultValue="fr"
            >
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </TextField>
            <TextField
              className={styles.genreSelect}
              id="select-genre"
              select
              label="Genre"
              value={selectedGenre}
              onChange={handleGenreSelect}
            >
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Adventure">Adventure</MenuItem>
              <MenuItem value="Drama">Drama</MenuItem>
            </TextField>
            <Button onClick={handleAddGenre} variant="outlined">Ajouter</Button>
            <Paper className={styles.selectedGenres}>
              Genres préférés : {selectedGenres.map(genre => (
                <span key={genre} className={styles.selectedGenre}>
                  <Button onClick={() => handleRemoveGenre(genre)} size="small">
                    {genre}
                    <DeleteIcon className={styles.deleteIcon}/>
                  </Button>
                </span>
              ))}
            </Paper>
            <Button variant="contained" color="primary" fullWidth>
              S'inscrire
            </Button>
          </FormControl>
        </div>
      </Paper>
    </div>
  )
}

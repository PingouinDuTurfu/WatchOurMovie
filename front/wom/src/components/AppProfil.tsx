import { useState, useEffect } from 'react';
import { Avatar, Button, List, ListItem, ListItemText, Typography, MenuItem, TextField, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import styles from "../css/AppProfil.module.css";
import { useAuth } from '../auth/AuthProvider';
import { Genre } from '../types/genreType';
import GenresService from '../services/GenresService';
import { UserProfile } from '../types/profileType';
import ProfileService from '../services/ProfileService';
import ApiUtils from '../utils/ApiUtils';

export default function AppProfil() {
  const [addingGenre, setAddingGenre] = useState(false);
  const [showingMovies, setShowingMovies] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [userId, authToken]);  
  
  useEffect(() => {
    if (userProfile?.language) {
      localStorage.setItem("language", userProfile?.language);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchGenres();
    console.log(authToken);
    console.log(userId);
  }, []);

  function handleGenreSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const genreName = event.target.value;
    const selectedGenre = genres.find(genre => genre.name === genreName);
    if (selectedGenre) {
      setSelectedGenre(selectedGenre);
    }
  }

  function handleClickWatchedMovies() {
    if (userProfile?.moviesSeen) {
      setShowingMovies(true);
    }
  }

  function handleAddGenre() {
    if (userProfile !== null) {
      if (selectedGenre && !userProfile.preferenceGenres.some(genre => genre.id === selectedGenre.id)) {
        const updatedProfile = {
          ...userProfile,
          preferenceGenres: [...userProfile.preferenceGenres, selectedGenre]
        };
        setUserProfile(updatedProfile);
        setSelectedGenre(null);
        setAddingGenre(false);
        editGenres(updatedProfile.preferenceGenres);
      }
    }
  }
  
  async function fetchUserProfile() {
    if (userId === null || authToken === null) return;
    const userProfile = await ProfileService.fetchUserProfile(userId, authToken);
    setUserProfile(userProfile);
  }

  async function fetchGenres() {
    try {
      const genres = await GenresService.retrieveGenres();
      setGenres(genres);
    } catch (error) {
      console.log('Erreur lors de la récupération des genres');
    }
  }

  if (!userProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  async function editGenres(newGenres: Genre[]) {
    try {
      if (userProfile?.preferenceGenres && authToken) {
        await ApiUtils.getApiInstanceJson(authToken).post('/updateGenre', { preferenceGenres: newGenres });
      }
    } catch (error) {
      throw new Error('Erreur lors de la récupération des genres');
    }
  }

  async function editLanguage(languageShort: string[]) {
    // post genres
  }

  return (
    <div className={styles.container}>
      <div className={styles.profil}>
        <Avatar alt="User Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <div className={styles.nameContainer}>
            <Typography variant="h4">{userProfile.username}</Typography>
          </div>
          <Typography variant="body1">Prénom : {userProfile.name}</Typography>
          <Typography variant="body1">Nom : {userProfile.lastname}</Typography>
          <Typography variant="body1">Langue : {userProfile.language}</Typography>
        </div>
      </div>
      <div>
        <Typography variant="h6">Groupes</Typography>
          
        <List>
          {userProfile.groups.map((group, index) => (
            <ListItem key={index}>
              <ListItemText primary={group.groupName} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Genres</Typography>
        <List>
          {userProfile.preferenceGenres.map((genre, index) => (
            <ListItem key={index}>
              <ListItemText primary={genre.name} />
            </ListItem>
          ))}
          {addingGenre ? (
            <>
              <TextField
              className={styles.genreSelect}
              id="select-genre"
              select
              label="Genre"
              value={selectedGenre ? selectedGenre.name : ''}
              onChange={handleGenreSelect}
            >
              {genres.map(genre => (
                <MenuItem key={genre.id} value={genre.name}>
                  {genre.name}
                </MenuItem>
              ))}
            </TextField>
              <Button onClick={handleAddGenre} variant="contained">Ajouter</Button>
            </>
          ) : (
            <Button onClick={() => setAddingGenre(true)}>
              <AddIcon />
            </Button>
          )}
        </List>
      </div>

      <Button variant="contained" color="primary" onClick={handleClickWatchedMovies} className={styles.watchedButton}>
        Films Vus
      </Button>
      {showingMovies && (
        <List>
        {userProfile?.moviesSeen.map((movie, index) => (
          <ListItem key={index}>
            <ListItemText primary={movie.title} />
          </ListItem>
        ))}
      </List>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Avatar, Button, List, ListItem, ListItemText, Typography, MenuItem, TextField, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import styles from "../css/AppProfil.module.css";
import { useAuth } from '../auth/AuthProvider';
import { Genre } from '../types/genreType';
import GenresService from '../services/GenresService';
import { UserProfile } from '../types/profileType';
import ProfileService from '../services/ProfileService';
import ApiUtils from '../utils/ApiUtils';
import DeleteIcon from '@mui/icons-material/Delete';
import { Language } from '../types/languageType';
import { Link } from 'react-router-dom';
import { Film } from '../types/filmType';

export default function AppProfil() {
  const [addingGenre, setAddingGenre] = useState(false);
  const [editLanguage, setEditLanguage] = useState(false);
  const [showingMovies, setShowingMovies] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  });  
  
  useEffect(() => {
    if (userProfile?.language) {
      localStorage.setItem("language", userProfile?.language);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchLanguages();
    fetchGenres();
  }, []);

  function handleGenreSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const genreName = event.target.value;
    const selectedGenre = genres.find(genre => genre.name === genreName);
    if (selectedGenre) {
      setSelectedGenre(selectedGenre);
    }
  }

  function handleLanguageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const languageEnglishName = event.target.value;
    const selectedLanguage = languages.find(language => language.english_name === languageEnglishName);
    if (selectedLanguage) {
      setSelectedLanguage(selectedLanguage);
    }
  }

  function handleClickWatchedMovies() {
    if (userProfile?.moviesSeen) {
      setShowingMovies(true);
    }
  }

  function handleRemoveGenre(removedGenre: string) {
    if (userProfile !== null) {
      const updatedGenres = userProfile.preferenceGenres.filter(genre => genre.name !== removedGenre);

      const updatedProfile: UserProfile = {
        ...userProfile,
        preferenceGenres: updatedGenres,
      };
      setUserProfile(updatedProfile);
      editGenres(updatedProfile.preferenceGenres);
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
    const newUserProfile = await ProfileService.fetchUserProfile(userId, authToken);
    setUserProfile(newUserProfile);
  }

  async function fetchGenres() {
    try {
      const genres = await GenresService.retrieveGenres();
      setGenres(genres);
    } catch (error) {
      console.log('Erreur lors de la récupération des genres');
    }
  }

  async function fetchLanguages(){
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/langs');
      const sortedLanguages = response.data.sort((a: Language, b: Language) => {
        return a.english_name.localeCompare(b.english_name);
      });
      setLanguages(sortedLanguages);
    } catch (error) {
      console.log('Erreur lors de la récupération des langues');
    }
  }  

  if (!userProfile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <div>Nous n'arrivons pas à récupérer votre profil, veuillez essayer de vous reconnecter.</div>
      </div>
    );
  }

  async function editGenres(newGenres: Genre[]) {
    try {
      if (userProfile?.preferenceGenres && authToken) {
        await ApiUtils.getApiInstanceJson(authToken).post('/updateGenre', { preferenceGenres: newGenres });
      }
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour des genres');
    }
  }

  async function handleEditLanguage() {
    try {
      if (userProfile?.language && authToken) {
        await ApiUtils.getApiInstanceJson(authToken).post('/updateLang', { language: selectedLanguage?.iso_639_1 });
        fetchUserProfile();
        setEditLanguage(false);
      }
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de la langue');
    }
  }

  async function handleClickRemoveToSeen(removedMovie: Film) {
    try {
      if (!authToken) return;
      await ApiUtils.getApiInstanceJson(authToken).post(
        '/removeMovie',
        { id: removedMovie.id, language: userProfile?.language }
      );
      fetchUserProfile();
    } catch (error) {
      console.error('Erreur lors de retirement du film à la liste des films vus :', error);
    }
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
          <span>Langue : {userProfile.language}
          {editLanguage ? (
            <>
              <TextField
                className={styles.languageSelect}
                id="select-genre"
                select
                label="Langue"
                value={selectedLanguage ? selectedLanguage.english_name : ''}
                onChange={handleLanguageSelect}
              >
                {languages.map(language => (
                  <MenuItem key={language.iso_639_1} value={language.english_name}>
                    {language.english_name}
                  </MenuItem>
                ))}
              </TextField>
              <Button className={styles.muiButtons} onClick={handleEditLanguage} variant="contained">Modifier</Button>
            </>
          ) : (
            <Button onClick={() => setEditLanguage(true)}>
              <EditIcon />
            </Button>
          )}</span>
        </div>
      </div>
      <div>
        <Typography variant="h6">Groupes</Typography>
          
        <List>
          {userProfile.groups.map((group, index) => (
            <ListItem key={index}>
              <ListItemText primary={group.groupName} />
              <Button className={styles.muiButtons} component={Link} to={`/groupes/${group.groupName}`} variant="outlined">Recommandation</Button>
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Genres</Typography>
        <List>
          {userProfile.preferenceGenres.map((genre, index) => (
            <ListItem key={index}>
              <ListItemText primary={genre.name} />
              <Button onClick={() => handleRemoveGenre(genre.name)}>
                <DeleteIcon className={styles.deleteIcon}/>
              </Button>
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
            <Button onClick={() => handleClickRemoveToSeen(movie)}>
              <DeleteIcon className={styles.deleteIcon}/>
            </Button>
          </ListItem>
        ))}
      </List>
      )}
    </div>
  );
}

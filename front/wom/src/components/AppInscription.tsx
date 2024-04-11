import { Button, FormControl, MenuItem, Paper, TextField } from '@mui/material'
import styles from "../css/AppInscription.module.css";
import ApiUtils from '../utils/ApiUtils';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { hashPassword } from "../utils/HashUtils";

interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

export default function AppInscription() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresToDisplay, setGenresToDisplay] = useState<Genre[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    username: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState('');
  const auth = ApiUtils.getAuthToken();

  useEffect(() => {
    fetchLanguages();
    fetchGenres();
  }, []);

  useEffect(() => {
    const isGenreSelected = selectedGenres.length > 0;
    const isAllFieldsFilled = Object.values(formData).every(val => val !== '');
    setIsFormValid(isGenreSelected && isAllFieldsFilled);
  }, [formData, selectedGenres]);

  if (auth) {
    return <Navigate to="/profil" />;
  }

  async function fetchLanguages(){
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/langs');
      const sortedLanguages = response.data.sort((a: Language, b: Language) => {
        return a.english_name.localeCompare(b.english_name);
      });
      setLanguages(sortedLanguages);
    } catch (error) {
      setError('Erreur lors de la récupération des langues');
    }
  }  

  async function fetchGenres(){
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/genres');
      setGenres(response.data);
      setGenresToDisplay(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des genres');
    }
  }

  function handleGenreSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGenre(event.target.value);
  }

  function handleLanguageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedLanguage(event.target.value);
  }

  function handleAddGenre() {
    if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
      setSelectedGenres([...selectedGenres, selectedGenre]);
      setSelectedGenre('');
  
      const updatedGenres = genresToDisplay.filter(genre => genre.name !== selectedGenre);
      setGenresToDisplay(updatedGenres);
    }
  }
  
  function handleRemoveGenre(genreToRemove: string) {
    setSelectedGenres(selectedGenres.filter(genre => genre !== genreToRemove));
    
    const deletedGenre = genres.find(genre => genre.name === genreToRemove);
    if (deletedGenre) {
      const updatedGenresToDisplay = [...genresToDisplay, deletedGenre].sort((a, b) => a.name.localeCompare(b.name));
      setGenresToDisplay(updatedGenresToDisplay);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  async function registerUser() {
    try {
      const { firstName, lastName, age, username, password } = formData;
      const hashedPassword = hashPassword(password);
      const userLogin = { username, hashPassword: hashedPassword };
      const userInfos = { username, name: firstName, lastname: lastName, age: age, language: selectedLanguage, preferenceGenres: selectedGenres };
  
      const response = await ApiUtils.getApiInstanceJson().post('/register', { userLogin, userInfos });
      console.log(response);
      console.log(response.headers.autorization);
      
      ApiUtils.setAuthToken(response.data.token);
      ApiUtils.setUserId(response.data.userId);
      
      return <Navigate to="/profil" />;
    } catch (error) {
      setError('Pseudo déjà utilisé. Veuillez utiliser un autre pseudo.');
    }
  }
  
  function handleSubmit() {
    registerUser();
  }

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.paperInscription}>
        <div className={styles.inscriptionContainer}>
          <h2>Inscription</h2>
          <FormControl>
            <TextField className={styles.inputText} id="firstName" name="firstName" label="Prénom" variant="outlined" fullWidth onChange={handleInputChange} />
            <TextField className={styles.inputText} id="lastName" name="lastName" label="Nom" variant="outlined" fullWidth onChange={handleInputChange} />
            <TextField className={styles.inputText} id="age" name="age" label="Age" variant="outlined" fullWidth onChange={handleInputChange} />
            <TextField className={styles.inputText} id="username" name="username" label="Pseudo" variant="outlined" fullWidth onChange={handleInputChange} />
            <TextField className={styles.inputText} id="password" name="password" label="Mot de passe" type="password" variant="outlined" fullWidth onChange={handleInputChange} />
            <TextField
              className={styles.languageSelect}
              id="select-language"
              select
              label="Langue"
              value={selectedLanguage}
              onChange={handleLanguageSelect}
            >
              {languages.map(language => (
                <MenuItem key={language.iso_639_1} value={language.iso_639_1}>
                  {language.english_name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className={styles.genreSelect}
              id="select-genre"
              select
              label="Genre"
              value={selectedGenre}
              onChange={handleGenreSelect}
            >
              {genresToDisplay.map(genre => (
                <MenuItem key={genre.id} value={genre.name}>
                  {genre.name}
                </MenuItem>
              ))}
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
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={!isFormValid}>
              S'inscrire
            </Button>
            {error && <p className={styles.error}>{error}</p>}
          </FormControl>
        </div>
      </Paper>
    </div>
  )
}

import { Button, FormControl, MenuItem, Paper, TextField } from '@mui/material'
import styles from "../css/AppInscription.module.css";
import ApiUtils from '../utils/ApiUtils';
import { Navigate } from 'react-router-dom';

export default function AppInscription() {
  const auth = ApiUtils.getAuthToken();

  if (auth) {
    return <Navigate to="/profil" />;
  }

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.paperInscription}>
        <div className={styles.inscriptionContainer}>
          <h2>Inscription</h2>
          <FormControl>
            <TextField className={styles.inputText} id="name" label="Prénom" variant="outlined" fullWidth />
            <TextField className={styles.inputText} id="surname" label="Nom" variant="outlined" fullWidth />
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
            <Button variant="contained" color="primary" fullWidth>
              S'inscrire
            </Button>
          </FormControl>
          <h2>Genre</h2>
        </div>
      </Paper>
    </div>
  )
}

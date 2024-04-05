import { Link } from 'react-router-dom';
import styles from "../css/AppConnexion.module.css";
import { Button, FormControl, Paper, TextField } from '@mui/material';

export default function AppConnexion() {
  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.paperConnexion}>
        <div className={styles.connexionContainer}>
          <h2>Connexion</h2>
          <FormControl>
            <TextField className={styles.inputText} id="pseudo" label="Pseudo" variant="outlined" fullWidth />
            <TextField className={styles.inputText} id="password" label="Mot de passe" type="password" variant="outlined" fullWidth />
            <Button variant="contained" color="primary" fullWidth>
              Se connecter
            </Button>
          </FormControl>
        </div>
        <div className={styles.inscriptionContainer}>
          <h2>Pas encore inscrit ?</h2>
          <p>Inscrivez-vous dès maintenant !</p>
          <Button component={Link} to="/inscription" variant="outlined" fullWidth>
            Inscription
          </Button>
        </div>
      </Paper>
    </div>
  );
}

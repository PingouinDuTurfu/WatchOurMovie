import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "../css/AppConnexion.module.css";
import { Button, FormControl, Paper, TextField } from "@mui/material";
import ApiUtils from "../utils/ApiUtils";
import { useAuth } from "../auth/AuthProvider";

export default function AppConnexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { authToken, login } = useAuth();

  useEffect(() => {
    if (authToken !== null) {
      navigate("/profil");
    }
  }, [authToken]);

  async function handleConnexionClick() {
    try {
      const token = await ApiUtils.authentification(username, password, login);
      if (!token) {
        setError("Connexion échouée, veuillez réessayer");
      }
    } catch (error) {
      setError("Identifiant ou mot de passe incorrect.");
    }
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setUsername(value);
    setIsFormValid(value !== "" && !!password);
    setError(null);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setPassword(value);
    setIsFormValid(value !== "" && !!username);
    setError(null);
  }

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.paperConnexion}>
        <div className={styles.connexionContainer}>
          <h2>Connexion</h2>
          <FormControl>
            <TextField
              className={styles.inputText}
              id="pseudo"
              label="Pseudo"
              variant="outlined"
              fullWidth
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              className={styles.inputText}
              id="password"
              label="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConnexionClick}
              disabled={!isFormValid}
            >
              Se connecter
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </FormControl>
        </div>
        <div className={styles.inscriptionContainer}>
          <h2>Pas encore inscrit ?</h2>
          <p>Inscrivez-vous dès maintenant !</p>
          <Button
            component={Link}
            to="/inscription"
            variant="outlined"
            fullWidth
          >
            Inscription
          </Button>
        </div>
      </Paper>
    </div>
  );
}

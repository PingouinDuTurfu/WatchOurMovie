import { useState } from 'react';
import { Avatar, Button, List, ListItem, ListItemText, Typography, MenuItem, TextField } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import styles from "../css/AppProfil.module.css";

export default function AppProfil() {
  // Exemple utilisateur
  const user = {
    name: 'Nom',
    surname: 'Exemple',
    email: 'nom@example.com',
    pseudo: 'SuperExemple',
    groups: ['Group 1', 'Group 2', 'Group 3'],
    genres: ['Romance', 'Comedy']
  };

  const [newGenre, setNewGenre] = useState('');
  const [addingGenre, setAddingGenre] = useState(false);

  function handleEditProfile() {
    // ToDo
  }

  function handleClickWatched() {
    // ToDo
  }

  function handleAddGenre() {
    // Add newGenre to user's genres
    // Reset newGenre state
    setAddingGenre(false);
    // ToDo
  }

  return (
    <div className={styles.container}>
      <div className={styles.profil}>
        <Avatar alt="User Avatar" src="dune2.jpg" className={styles.avatar} />
        <div className={styles.userInfo}>
          <div className={styles.nameContainer}>
            <Typography variant="h4">{user.pseudo}</Typography>
            <Button startIcon={<EditIcon />} onClick={handleEditProfile} className={styles.editButton}>
              Modifier
            </Button>
          </div>
          <Typography variant="body1">Prénom : {user.name}</Typography>
          <Typography variant="body1">Nom : {user.surname}</Typography>
          <Typography variant="body1">Email : {user.email}</Typography>
        </div>
      </div>
      <div>
        <Typography variant="h6">Groupes</Typography>
        <List>
          {user.groups.map((group, index) => (
            <ListItem key={index}>
              <ListItemText primary={group} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Genres</Typography>
        <List>
          {user.genres.map((genre, index) => (
            <ListItem key={index}>
              <ListItemText primary={genre} />
            </ListItem>
          ))}
          {addingGenre ? (
            <>
              <TextField
                id="select-genre"
                select
                label="Genre"
                defaultValue="Action"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                fullWidth
              >
                <MenuItem value="Action">Action</MenuItem>
                <MenuItem value="Adventure">Adventure</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
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

      <Button variant="contained" color="primary" onClick={handleClickWatched} className={styles.watchedButton}>
        Films Vus
      </Button>
    </div>
  );
}

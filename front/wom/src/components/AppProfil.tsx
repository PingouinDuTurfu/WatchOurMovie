import { useState, useEffect } from 'react';
import { Avatar, Button, List, ListItem, ListItemText, Typography, MenuItem, TextField, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import styles from "../css/AppProfil.module.css";
import { useAuth } from '../auth/AuthProvider';
import ApiUtils from '../utils/ApiUtils';
import { Genre } from '../types/genreType';
import { Group } from '../types/groupType';

interface UserProfile {
  _id: string;
  userId: string;
  username: string;
  name: string;
  lastname: string;
  language: string;
  moviesSeen: Genre[]; 
  preferenceGenres: { name: string; id: number; _id: string }[];
  groups: Group[];
  __v: number;
}

export default function AppProfil() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [newGenre, setNewGenre] = useState('');
  const [addingGenre, setAddingGenre] = useState(false);
  const { authToken, userId, logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [userId, authToken]);

  function handleEditProfile() {
    // Handle editing profile
  }

  function handleClickWatched() {
    // Handle clicking watched movies
  }

  function handleAddGenre() {
    // Add newGenre to user's genres
    // Reset newGenre state
    setAddingGenre(false);
    // Handle adding genre to user's profile
  }

  async function fetchUserProfile() {
    try {
      if (userId && authToken) {
        const response = await ApiUtils.getApiInstanceJson().get<UserProfile>(`/profil/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  if (!userProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profil}>
        <Avatar alt="User Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <div className={styles.nameContainer}>
            <Typography variant="h4">{userProfile.username}</Typography>
            <Button startIcon={<EditIcon />} onClick={handleEditProfile} className={styles.editButton}>
              Modifier
            </Button>
          </div>
          <Typography variant="body1">Prénom : {userProfile.name}</Typography>
          <Typography variant="body1">Nom : {userProfile.lastname}</Typography>
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
      <Button variant="contained" color="secondary" onClick={() => ApiUtils.logout(logout)}>
        Déconnexion
      </Button>
    </div>
  );
}

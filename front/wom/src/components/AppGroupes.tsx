import { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '../css/AppGroupes.module.css';
import { useAuth } from '../auth/AuthProvider';
import GroupsService from '../services/GroupsService';
import ApiUtils from '../utils/ApiUtils';
import { UserProfile } from '../types/profileType';
import ProfileService from '../services/ProfileService';

export default function AppGroupes() {
  const [searchValue, setSearchValue] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchGroups();
    
  }, []);
  
  const filteredGroups = groups.filter(group => {
    const lowercaseGroupName = group.toLowerCase();
    return lowercaseGroupName.includes(searchValue.toLowerCase()) && !userProfile?.groups.some(userGroup => userGroup.groupName.toLowerCase() === lowercaseGroupName);
  });
  
  async function fetchGroups() {
    try {
      const groups = await GroupsService.retrieveGroups();
      setGroups(groups);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes :', error);
    }
  };
  
  async function handleCreateGroup() {
    try {
      if(!authToken) return;
      await ApiUtils.getApiInstanceJson(authToken).post('/group/create', { groupName: newGroupName });
      setNewGroupName('');
      fetchUserProfile();
      fetchGroups();
    } catch (error) {
      console.error('Erreur lors de la création du groupe :', error);
    }
  };

  async function handleJoinGroup(groupName: string) {
    try {
      if(!authToken) return;
      await ApiUtils.getApiInstanceJson(authToken).post(
        '/group/join',
        { groupName }
      );
      fetchUserProfile();
    } catch (error) {
      console.error('Erreur pour joindre le groupe :', error);
    }
  };
  
  async function fetchUserProfile() {
    if (userId === null || authToken === null) return;
    const userProfile = await ProfileService.fetchUserProfile(userId, authToken);
    setUserProfile(userProfile);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && isFormValid) {
      handleCreateGroup();
    }
  }

  function handleGroupNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setNewGroupName(value); 
    setIsFormValid(value !== "");
  }
  
  return (
    <div className={styles.container}>
      <Paper className={styles.paperContainer}>
      <Typography variant="h6">Créer un groupe</Typography>
        <div className={styles.createGroupContainer}>
          <TextField
            className={styles.input} 
            label="Nom du groupe"
            variant="outlined"
            fullWidth
            value={newGroupName}
            onChange={handleGroupNameInputChange}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleCreateGroup} disabled={!isFormValid} variant="contained" color="primary">Valider</Button>
        </div>
      </Paper>

      <Paper className={styles.paperContainer}>
        <Typography variant="h6">Vos groupes</Typography>
        {userProfile?.groups.map((group, index) => (
          <Paper key={index} className={styles.groupContainer}>
            <Typography>{group.groupName}</Typography>
            <Button component={Link} to={`/groupes/${group.groupName}`} variant="outlined">Recommandation</Button>
          </Paper>
        ))}
      </Paper>

      <Paper className={styles.paperContainer}>
        <Typography variant="h6">Tous les groupes</Typography>
        <div className={styles.searchContainer}>
          <TextField
            className={styles.input} 
            label="Rechercher un groupe"
            variant="outlined"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {filteredGroups.map((group, index) => (
          <Paper key={index} className={styles.groupContainer}>
            <Typography>{group}</Typography>
            <Button component={Link} to={`/groupes/infos/${group}`} variant="contained">Voir</Button>
            <Button variant="contained" onClick={() => handleJoinGroup(group)}>Rejoindre</Button>
          </Paper>
        ))}
      </Paper>
    </div>
  );
}

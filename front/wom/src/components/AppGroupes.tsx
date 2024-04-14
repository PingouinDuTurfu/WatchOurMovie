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
  const [groups, setGroups] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchGroups();
    
  }, []);
  
  const filteredGroups = groups.filter(group =>
    group && group.toLowerCase().includes(searchValue.toLowerCase())
  );    
  
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
      console.error('Erreur lors de la jointure du groupe :', error);
    }
  };
  
  async function fetchUserProfile() {
    if (userId === null || authToken === null) return;
    const userProfile = await ProfileService.fetchUserProfile(userId, authToken);
    setUserProfile(userProfile);
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
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button onClick={handleCreateGroup} variant="contained" color="primary">Valider</Button>
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
            <Button variant="outlined">Voir</Button>
            <Button variant="outlined" onClick={() => handleJoinGroup(group)}>Rejoindre</Button>
          </Paper>
        ))}
      </Paper>
    </div>
  );
}

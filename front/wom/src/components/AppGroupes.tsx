import { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '../css/AppGroupes.module.css';
import { useAuth } from '../auth/AuthProvider';
import GroupsService from '../services/GroupsService'; // Importer le service
import { Group } from '../types/groupType';
import ApiUtils from '../utils/ApiUtils';
import { UserProfile } from '../types/profileType';

export default function AppGroupes() {
  const [searchValue, setSearchValue] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await GroupsService.retrieveGroups();
        setGroups(groups);
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes :', error);
      }
    };
    fetchUserProfile();
    fetchGroups();
  }, []);

  const filteredGroups = Array.isArray(groups) ? groups.filter(group =>
    group.groupName.toLowerCase().includes(searchValue.toLowerCase())
  ) : [];  

  async function handleCreateGroup() {
    try {
      await ApiUtils.getApiInstanceJson().post('/group/create', { groupName: newGroupName }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setNewGroupName('');
    } catch (error) {
      console.error('Erreur lors de la création du groupe :', error);
    }
  };

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

  return (
    <div className={styles.container}>
      <Paper className={styles.paperContainer}>
        <div className={styles.createGroupContainer}>
          <TextField
            label="Nom du groupe"
            variant="outlined"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button onClick={handleCreateGroup} variant="contained" color="primary">Créer un groupe</Button>
        </div>
        <Typography variant="h6">Tous les groupes</Typography>
        <div className={styles.searchContainer}>
          <TextField
            label="Rechercher un groupe"
            variant="outlined"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {filteredGroups.map(group => (
          <Paper className={styles.groupContainer}>
            <Typography>{group.groupName}</Typography>
            <Button variant="outlined">Rejoindre</Button>
          </Paper>
        ))}
      </Paper>

      <Paper className={styles.paperContainer}>
        <Typography variant="h6">Vos groupes</Typography>
        {userProfile?.groups.map(group => (
          <Paper className={styles.groupContainer}>
            <Typography>{group.groupName}</Typography>
            <Button component={Link} to={`/groupes/${group.groupName}`} variant="outlined">Recommandation</Button>
          </Paper>
        ))}
      </Paper>
    </div>
  );
}

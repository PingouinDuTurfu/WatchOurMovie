import { useState } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '../css/AppGroupes.module.css';

const allGroups = [
  { id: 1, name: 'Groupe 1' },
  { id: 2, name: 'Groupe 2' },
  { id: 3, name: 'Groupe 3' },
  { id: 4, name: 'Groupe 4' },
  { id: 5, name: 'Groupe 5' },
  { id: 6, name: 'Groupe 6' },
  { id: 7, name: 'Groupe 7' },
  { id: 8, name: 'Groupe 8' },
  { id: 9, name: 'Groupe 9' },
  { id: 10, name: 'Groupe 10' },
];

const userGroups = [
  { id: 1, name: 'Groupe 1' },
  { id: 6, name: 'Groupe 6' },
];

export default function AppGroupes() {
  const [searchValue, setSearchValue] = useState('');

  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Paper className={styles.paperContainer}>
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
          <Paper key={group.id} className={styles.groupContainer}>
            <Typography>{group.name}</Typography>
            <Button variant="outlined">Rejoindre</Button>
          </Paper>
        ))}
      </Paper>

      <Paper className={styles.paperContainer}>
        <Typography variant="h6">Vos groupes</Typography>
        {userGroups.map(group => (
          <Paper key={group.id} className={styles.groupContainer}>
            <Typography>{group.name}</Typography>
            <Button component={Link} to={`/groupes/${group.id}`} variant="outlined">Recommandation</Button>
          </Paper>
        ))}
      </Paper>
    </div>
  );
}

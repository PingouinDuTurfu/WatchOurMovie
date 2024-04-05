import { Assignment, Home, Movie, People, Person } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React from 'react';
import styles from "../css/AppFooter.module.css";
import { Link } from 'react-router-dom';

interface AppFooterProps {
  footerNavValue: number | undefined;
  setFooterNavValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function AppFooter({ footerNavValue, setFooterNavValue }: AppFooterProps) {
  return (
    <BottomNavigation
      className={styles.footer} 
      value={footerNavValue}
      onChange={(event, newValue) => setFooterNavValue(newValue)}
      showLabels
    >
      <BottomNavigationAction 
        label="Accueil" 
        icon={<Home />} 
        component={Link} 
        to="/" 
        className={footerNavValue === 0 ? styles.activeIcon : ''}
      />
      <BottomNavigationAction 
        label="Films" 
        icon={<Movie />} 
        component={Link} 
        to="/films" 
        className={footerNavValue === 1 ? styles.activeIcon : ''}
      />
      <BottomNavigationAction 
        label="Groupes" 
        icon={<People />} 
        component={Link} 
        to="/groupes" 
        className={footerNavValue === 2 ? styles.activeIcon : ''}
      />
      <BottomNavigationAction 
        label="Profil" 
        icon={<Person />} 
        component={Link} 
        to="/profil" 
        className={footerNavValue === 3 ? styles.activeIcon : ''}
      />
      <BottomNavigationAction 
        label="CGU" 
        icon={<Assignment />} 
        component={Link} 
        to="/cgu" 
        className={footerNavValue === 4 ? styles.activeIcon : ''}
      />
    </BottomNavigation>
  );
}

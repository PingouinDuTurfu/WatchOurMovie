import { Assignment, Home, Movie, People, Person } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import React from 'react'
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
      <BottomNavigationAction label="Accueil" icon={<Home/>} component={Link} to="/"/>
      <BottomNavigationAction label="Films" icon={<Movie/>} component={Link} to="/films"/>
      <BottomNavigationAction label="Groupes" icon={<People/>} component={Link} to="/groupes"/>
      <BottomNavigationAction label="Profil" icon={<Person/>} component={Link} to="/profil"/>
      <BottomNavigationAction label="CGU" icon={<Assignment/>} component={Link} to="/cgu"/>
    </BottomNavigation>
  )
} 

import { Search } from '@mui/icons-material'
import { AppBar, Button, IconButton, TextField, Toolbar, Typography } from '@mui/material'
import styles from "../css/AppMenu.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useState } from 'react';

interface AppMenuProps {
  setFooterNavValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function AppMenu({ setFooterNavValue }: AppMenuProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const { authToken, logout } = useAuth();
  const navigate = useNavigate();

  function handleNavClick(value: number | undefined) {
    setFooterNavValue(value);
  };

  function handleLogout() {
    logout();
  }

  function handleSearchClick() {
    navigate(`/films/recherche/${searchValue}`);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  }

  return (
    <AppBar className={styles.navMenu}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Watch Our Movie
        </Typography>
        <div>
          <TextField
            className={styles.searchBar}
            placeholder="Rechercher un film…"
            onKeyDown={handleKeyPress}
          />
          <IconButton type="submit" aria-label="search" onClick={() => handleSearchClick()}>
            <Search/>
          </IconButton>
        </div>
        <Button color="inherit" component={Link} to="/" onClick={() => handleNavClick(0)}>
          Accueil
        </Button>
        {authToken && (
          <>
            <Button color="inherit" component={Link} to="/films" onClick={() => handleNavClick(1)}>
              Films
            </Button>
            <Button color="inherit" component={Link} to="/groupes" onClick={() => handleNavClick(2)}>
              Groupes
            </Button>
            <Button color="inherit" component={Link} to="/profil" onClick={() => handleNavClick(3)}>
              Profil
            </Button>
          </>
        )}
        <Button color="inherit" component={Link} to="/contacts" onClick={() => handleNavClick(undefined)}>
          Contacts
        </Button>
        {authToken ? (
          <Button color="inherit" onClick={handleLogout}>
            Déconnexion
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/connexion" onClick={() => handleNavClick(undefined)}>
            Connexion
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

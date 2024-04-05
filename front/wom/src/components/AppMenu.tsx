import { Search } from '@mui/icons-material'
import { AppBar, Button, IconButton, InputBase, Toolbar, Typography } from '@mui/material'
import styles from "../css/AppMenu.module.css";
import { Link } from 'react-router-dom';

interface AppMenuProps {
  setFooterNavValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function AppMenu({ setFooterNavValue }: AppMenuProps) {
  const handleNavClick = (value: number | undefined) => {
    setFooterNavValue(value);
  };

  return (
    <AppBar className={styles.navMenu}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Watch Our Movie
        </Typography>
        <div>
          <InputBase
            className={styles.searchBar}
            placeholder="Rechercher…"
          />
          <IconButton type="submit" aria-label="search">
            <Search/>
          </IconButton>
        </div>
        <Button color="inherit" component={Link} to="/" onClick={() => handleNavClick(0)}>
          Accueil
        </Button>
        <Button color="inherit" component={Link} to="/films" onClick={() => handleNavClick(1)}>
          Films
        </Button>
        <Button color="inherit" component={Link} to="/groupes" onClick={() => handleNavClick(2)}>
          Groupes
        </Button>
        <Button color="inherit" component={Link} to="/profil" onClick={() => handleNavClick(3)}>
          Profil
        </Button>
        <Button color="inherit" component={Link} to="/contacts" onClick={() => handleNavClick(undefined)}>
          Contacts
        </Button>
        <Button color="inherit" component={Link} to="/connexion" onClick={() => handleNavClick(undefined)}>
          Connexion
        </Button>
      </Toolbar>
    </AppBar>
  )
}

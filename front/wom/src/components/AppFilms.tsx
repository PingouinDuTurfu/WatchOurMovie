import { useState, useEffect } from "react";
import styles from "../css/AppFilms.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FilmsService from "../services/FilmsService";
import { FilmDetails } from "../types/filmDetailsType";

export default function AppFilms() {
  const [films, setFilms] = useState<FilmDetails[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    getMovies(1);
  }, []);

  async function getMovies(moviePage: number) {
    try {
      const language = localStorage.getItem("language") || "fr";
      const response = await FilmsService.getMovies(moviePage, language);
      setFilms(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
  }

  function handleSearchInput(searchEntry: string) {
    setSearchValue(searchEntry);
  }

  function handleSearchClick() {
    navigate(`/films/recherche/${searchValue}`);
  }

  function handleLeftArrowClick(): void {
    getMovies(currentPage - 1);
    setCurrentPage(currentPage - 1);
  }  
  
  function handleRightArrowClick(): void {
    getMovies(currentPage + 1);
    setCurrentPage(currentPage + 1);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  }

  if (!films) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <div>Nous n'arrivons pas à récupérer les données des films, veuillez essayer de vous reconnecter.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Films</h1>
      <div className={styles.searchBar}>
        <TextField
          placeholder="Rechercher…"
          value={searchValue}
          onChange={(e) => handleSearchInput(e.target.value)}
          className={styles.searchInput}
          onKeyDown={handleKeyPress}
        />
        <IconButton type="submit" aria-label="search" onClick={() => handleSearchClick()}>
          <Search />
        </IconButton>
      </div>

      <div className={styles.filmsContainer}>
      {films.length === 0 &&
        <div style={{ display: 'flex', margin: 'auto', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
          <div>Nous n'arrivons pas à récupérer les données des films, veuillez essayer de vous reconnecter.</div>
        </div>
      }
        {films.map((film) => (
          <Link
            to={`/films/${film.id}`}
            key={film.id}
            className={styles.filmContainer}
          >
            <img
              src={film.image}
              alt={film.title}
              className={styles.filmImage}
            />
            <div className={styles.title}>{film.title}</div>
          </Link>
        ))}
      </div>
      <div className={styles.pagination}>
        {currentPage !== 1 && (
        <Button className={styles.pageArrow} onClick={() => handleLeftArrowClick()}>
          <KeyboardArrowLeftIcon />
        </Button>)}
          <span key={currentPage} className={styles.activePage}>
          {currentPage}
        </span>
        <Button className={styles.pageArrow} onClick={() => handleRightArrowClick()}>
          <KeyboardArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import styles from "../css/AppFilms.module.css";
import { Link } from "react-router-dom";
import { Button, CircularProgress, IconButton, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ApiUtils from "../utils/ApiUtils";

interface Film {
  id: number;
  title: string;
  image: string;
}

export default function AppFilms() {
  const [films, setFilms] = useState<Film[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getMovies(1);
  }, []);

  async function getMovies(moviePage: number) {
    try {
      const language = localStorage.getItem("language") || "fr";
      const response = await ApiUtils.getApiInstanceJson().get(
        `/movies/${moviePage}?language=${language}`
      );
      setFilms(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
  }

  function handleSearchEntry(searchEntry: string) {
    setSearchValue(searchEntry);
    setCurrentPage(1);
  }

  function handleLeftArrowClick(): void {
    getMovies(currentPage - 1);
    setCurrentPage(currentPage - 1);
  }  
  
  function handleRightArrowClick(): void {
    getMovies(currentPage + 1);
    setCurrentPage(currentPage + 1);
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
        <InputBase
          placeholder="Rechercher…"
          value={searchValue}
          onChange={(e) => handleSearchEntry(e.target.value)}
          className={styles.searchInput}
        />
        <IconButton type="submit" aria-label="search">
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

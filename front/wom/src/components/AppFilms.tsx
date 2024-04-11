import React, { useState, useEffect } from "react";
import styles from "../css/AppFilms.module.css";
import { Link } from "react-router-dom";
import { IconButton, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
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
  const filmsPerPage: number = 12;

  useEffect(() => {
    getMovies();
  }, []);

  async function getMovies() {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/movies");
      setFilms(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
  }

  const handleSearchEntry = (searchEntry: string) => {
    setSearchValue(searchEntry);
    setCurrentPage(1); 
  };

  //calcule le debut et la fin pour la pagination
  const startIndex: number = (currentPage - 1) * filmsPerPage;
  const endIndex: number = startIndex + filmsPerPage;

  // Filtre les films 
  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filmsToShow = filteredFilms.slice(startIndex, endIndex);
  
  const totalPages: number = Math.ceil(filteredFilms.length / filmsPerPage);

  const paginationSquares = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationSquares.push(
      <button
        key={i}
        onClick={() => setCurrentPage(i)}
        className={currentPage === i ? styles.activePage : styles.pageSquare}
      >
        {i}
      </button>
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
        {filmsToShow.map((film) => (
          <Link
            to={`/films/${film.id}`}
            key={film.id}
            className={styles.filmContainer}
          >
            <img
              src={film.image}
              alt={film.title}
              className={styles.filmImage}
              style={{ width: "100%" }}
            />
            <div className={styles.title}>{film.title}</div>
          </Link>
        ))}
      </div>
      <div className={styles.pagination}>{paginationSquares}</div>
    </div>
  );
}

import React, { useState } from "react";
import styles from "../css/AppFilms.module.css";
import { Link } from "react-router-dom";
import { IconButton, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";

const filmsData = [
  {
    id: 1,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 2,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 3,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 4,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 5,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 6,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 7,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 8,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 9,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 10,
    title: "Dune 2",
    imageUrl: "dune2.jpg",
  },
  {
    id: 11,
    title: "Godzilla vs Kong",
    imageUrl: "godzillakong.jpg",
  },
];

const filmsPerPage = 6;

export default function AppFilms() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const startIndex = (currentPage - 1) * filmsPerPage;
  const endIndex = startIndex + filmsPerPage;

  const filteredFilms = filmsData.filter((film) =>
    film.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filmsToShow = filteredFilms.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

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

  function handleSearchEntry(searchEntry: string) {
    setSearchValue(searchEntry);
    setCurrentPage(1);
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
              src={film.imageUrl}
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

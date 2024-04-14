import { useState, useEffect } from "react";
import styles from "../css/AppFilms.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FilmsService from "../services/FilmsService";

interface Film {
  id: number;
  title: string;
  image: string;
}

export default function AppFilmsSearch() {
  const { searchValue } = useParams<{ searchValue: string }>();
  const [films, setFilms] = useState<Film[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    getSearchMovies(1);
  }, []);

  async function getSearchMovies(moviePage: number) {
    if (searchValue) {
      try {
        const language = localStorage.getItem("language") || "fr";
        const response = await FilmsService.searchInMovies(searchValue, moviePage, language);
        setFilms(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      }
    } else {
      navigate("/films");
    }

  }

  function handleLeftArrowClick(): void {
    getSearchMovies(currentPage - 1);
    setCurrentPage(currentPage - 1);
  }  
  
  function handleRightArrowClick(): void {
    getSearchMovies(currentPage + 1);
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
      <h1>Films : "{searchValue}"</h1>
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

import React from 'react'
import { useParams } from 'react-router-dom';

export default function AppFilmDetails() {
  const { filmId } = useParams();

  return (
    <div>
      <h2>Film ID : {filmId}</h2>
      <p>Faire une requête à l'API pour avoir les infos concernant le film</p>
    </div>
  );
}

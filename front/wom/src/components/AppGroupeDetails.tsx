import { Button } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom';

export default function AppGroupeDetails() {
  const { groupId } = useParams();

  return (
    <div>
      <h2>Groupe ID : {groupId}</h2>
      <p>Faire une requête à l'API pour avoir les infos concernant le groupe</p>
      <Button variant='contained'>Quitter le groupe</Button>
    </div>
  );
}

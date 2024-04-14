import { Button, Typography } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ApiUtils from '../utils/ApiUtils';
import { useAuth } from '../auth/AuthProvider';
import GroupsService from '../services/GroupsService';
import { useEffect, useState } from 'react';
import { GroupInfosType } from '../types/groupInfosType';
import styles from "../css/AppGroupeDetails.module.css";
import { FilmDetails } from '../types/filmDetailsType';

export default function AppGroupeDetails() {
  const [groupInfos, setGroupInfos] = useState<GroupInfosType | null>(null);
  const [recommandations, setRecommandations] = useState<FilmDetails[] | null>(null);
  const { groupName } = useParams();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    retrieveGroupInfos();
  }, []);

  async function retrieveGroupInfos() {
    try {
      if (groupName && authToken) {
        const groupInfos = await GroupsService.retrieveGroupInfos(groupName, authToken);
        setGroupInfos(groupInfos);
      }
    } catch (error) {
      console.error('Erreur lors de la sortie du groupe :', error);
    }
  }

  async function handleLeaveGroup() {
    try {
      if (groupName && authToken) {
        await GroupsService.leaveGroup(groupName, authToken);
        navigate('/groupes');
      }
    } catch (error) {
      console.error('Erreur lors de la sortie du groupe :', error);
    }
  }

  async function handleRecommandation() {
    try {
      if (groupName && authToken) {
        const language = localStorage.getItem("language") || "fr";
        const response = await ApiUtils.getApiInstanceJson(authToken).get<FilmDetails[]>(
          '/group/recommendation', {
            params: {
              language: language,
              groupName: groupName,
              onMoviesSeen: true
            }
        });
        setRecommandations(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la sortie du groupe :', error);
    }
  }

  return (
    <div>
      <Typography variant='h3'>Groupe {groupName}</Typography>
      <Typography variant='h6'>Membres du groupe</Typography>
        {groupInfos?.members.map((member, index) => (
          <div key={index}>
            {member.username} ({member.name} {member.lastname})
          </div>
        ))}

      <Typography variant='h6'>Genres du groupe</Typography>
        {groupInfos?.preferenceGenres.map((genre, index) => (
          <div key={index}>
            {genre.name}
          </div>
        ))}

        <Button variant='contained' onClick={handleRecommandation}>Recommandation</Button>
        <Button variant='contained' color='error' onClick={handleLeaveGroup}>Quitter le groupe</Button>
        
        <div className={styles.recommandationContainer}>
          {recommandations && recommandations.map((film) => (
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
              <Typography className={styles.smallTitle}>{film.title}</Typography>
              <Typography className={styles.note}>Note : {film.vote_average}</Typography>
            </Link>
          ))}
        </div>
    </div>
  );
}

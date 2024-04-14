import { Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ApiUtils from '../utils/ApiUtils';
import { useAuth } from '../auth/AuthProvider';
import GroupsService from '../services/GroupsService';

export default function AppGroupeDetails() {
  const { groupName } = useParams();
  const { authToken } = useAuth();
  const navigate = useNavigate();

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
        const response = await ApiUtils.getApiInstanceJson(authToken).get(
          '/group/recommendation', {
            params: {
              language: language,
              groupName: groupName,
              onMoviesSeen: false
            }
        });
        console.log(response);
        
      }
    } catch (error) {
      console.error('Erreur lors de la sortie du groupe :', error);
    }
  }

  return (
    <div>
      <h2>Groupe Name : {groupName}</h2>
      <p>Faire une requête à l'API pour avoir les infos concernant le groupe</p>
      <Button variant='contained' onClick={handleRecommandation}>Recommandation</Button>
      <Button variant='contained' onClick={handleLeaveGroup}>Quitter le groupe</Button>
    </div>
  );
}

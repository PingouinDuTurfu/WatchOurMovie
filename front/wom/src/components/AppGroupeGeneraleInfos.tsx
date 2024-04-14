import { Button, Typography } from "@mui/material";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import GroupsService from "../services/GroupsService";
import { useEffect, useState } from "react";
import { GroupInfosType } from "../types/groupInfosType";
import ApiUtils from "../utils/ApiUtils";

export default function AppGroupeGeneraleInfos() {
  const [groupInfos, setGroupInfos] = useState<GroupInfosType | null>(null);
  const { groupName } = useParams();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    retrieveGroupInfos();
  }, []);

  async function retrieveGroupInfos() {
    try {
      if (groupName && authToken) {
        const groupInfos = await GroupsService.retrieveGroupInfos(
          groupName,
          authToken
        );
        setGroupInfos(groupInfos);
      }
    } catch (error) {
      console.error("Erreur lors de la sortie du groupe :", error);
    }
  }

  async function handleJoinClick(groupName: string) {
    try {
      if (!authToken) return;
      await ApiUtils.getApiInstanceJson(authToken).post("/group/join", {
        groupName,
      });
      navigate(`/groupes/${groupName}`);
    } catch (error) {
      console.error("Erreur pour joindre le groupe :", error);
    }
  }

  return (
    <div>
      <Typography variant="h3">Groupe {groupName}</Typography>
      {groupName && (
        <Button variant="contained" onClick={() => handleJoinClick(groupName)}>
          Rejoindre
        </Button>
      )}
      <Typography variant="h6">Membres du groupe</Typography>
      {groupInfos?.members.map((member, index) => (
        <div key={index}>
          {member.username} ({member.name} {member.lastname})
        </div>
      ))}

      <Typography variant="h6">Genres du groupe</Typography>
      {groupInfos?.preferenceGenres.map((genre, index) => (
        <div key={index}>{genre.name}</div>
      ))}
    </div>
  );
}

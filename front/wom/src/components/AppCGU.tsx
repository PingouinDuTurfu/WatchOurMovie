import { Typography } from "@mui/material";
import styles from "../css/AppCGU.module.css"

export default function AppCGU() {
  return (
    <div className={styles.containerCGU}>
      <Typography variant="h2">Conditions Générales d'Utilisation</Typography>
      <Typography variant="h6">
        En utilisant cette application, vous acceptez les conditions générales
        d'utilisation suivantes :
      </Typography>
      <Typography variant="body1">
        1. Pour utiliser notre service et accéder au contenu, vous devez avoir
        18 ans (ou l'âge minimum équivalent dans votre pays d'origine) ou plus,
        avoir l'accord d'un parent ou d'un tuteur si vous êtes mineur dans votre
        pays d'origine.
      </Typography>
      <Typography variant="body1">
        2. Vous devrez créer un compte pour utiliser notre service. Votre nom
        d'utilisateur et votre mot de passe sont réservés à votre usage
        personnel et doivent rester confidentiels. Vous comprenez que vous êtes
        responsable de toute utilisation (y compris toute utilisation non
        autorisée) de votre nom d'utilisateur et de votre mot de passe.
      </Typography>
      <Typography variant="body1">
        3. L'utilisation des données des films est soumise aux conditions de {" "}
        <a href="https://www.themoviedb.org/terms-of-use" target="/">
          TheMovieDataBase
        </a>
        , merci de vous y référer pout toute information supplémentaire.
      </Typography>
      <Typography variant="h6">
        Merci de bien vouloir lire attentivement et de respecter ces conditions
        lors de l'utilisation de notre application.
      </Typography>
    </div>
  );
}

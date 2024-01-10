import { Route, Routes } from "react-router-dom";
import AppHome from "./AppHome";
import AppConnexion from "./AppConnexion";
import AppInscription from "./AppInscription";
import AppProfil from "./AppProfil";
import AppFilms from "./AppFilms";
import AppGroupes from "./AppGroupes";
import AppCGU from "./AppCGU";
import AppRecommandations from "./AppRecommandations";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/films" element={<AppFilms />} />
      <Route path="/groupes" element={<AppGroupes />} />
      <Route path="/profil" element={<AppProfil />} />
      <Route path="/connexion" element={<AppConnexion />} />
      <Route path="/inscription" element={<AppInscription />} />
      <Route path="/cgu" element={<AppCGU />} />
      <Route path="/recommandations" element={<AppRecommandations />} />
    </Routes>
  );
};

export default AppRouter;

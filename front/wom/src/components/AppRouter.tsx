import { Route, Routes } from "react-router-dom";
import AppHome from "./AppHome";
import AppConnexion from "./AppConnexion";
import AppInscription from "./AppInscription";
import AppProfil from "./AppProfil";
import AppFilms from "./AppFilms";
import AppGroupes from "./AppGroupes";
import AppCGU from "./AppCGU";
import AppRecommandations from "./AppRecommandations";
import AppError404 from './AppError404';
import AppContacts from "./AppContacts";
import AppFilmDetails from "./AppFilmDetails";
import AppRoutesPrivate from "./AppRoutesPrivate";
import AppGroupeDetails from "./AppGroupeDetails";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/films" element={<AppFilms />} />
      <Route path="/connexion" element={<AppConnexion />} />
      <Route path="/inscription" element={<AppInscription />} />
      <Route path="/cgu" element={<AppCGU />} />
      <Route path="/contacts" element={<AppContacts />} />
      <Route path="/films/:filmId" element={<AppFilmDetails />} />
      <Route path="*" element={<AppError404 />} />
      {/* <Route element={<AppRoutesPrivate />}> */}
        <Route path="/groupes" element={<AppGroupes />} />
        <Route path="/groupes/:groupeId" element={<AppGroupeDetails />} />
        <Route path="/profil" element={<AppProfil />} />
        <Route path="/recommandations" element={<AppRecommandations />} />
      {/* </Route> */}
    </Routes>
  );
};

export default AppRouter;

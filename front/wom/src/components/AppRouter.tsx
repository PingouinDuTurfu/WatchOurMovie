import { Route, Routes } from "react-router-dom";
import AppHome from "./AppHome";
import AppConnexion from "./AppConnexion";
import AppInscription from "./AppInscription";
import AppProfil from "./AppProfil";
import AppFilms from "./AppFilms";
import AppGroupes from "./AppGroupes";
import AppCGU from "./AppCGU";
import AppError404 from './AppError404';
import AppContacts from "./AppContacts";
import AppFilmDetails from "./AppFilmDetails";
import AppRoutesPrivate from "./AppRoutesPrivate";
import AppGroupeDetails from "./AppGroupeDetails";
import AppGroupeGeneraleInfos from "./AppGroupeGeneraleInfos";
import AppFilmsSearch from "./AppFilmsSearch";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/connexion" element={<AppConnexion />} />
      <Route path="/inscription" element={<AppInscription />} />
      <Route path="/cgu" element={<AppCGU />} />
      <Route path="/contacts" element={<AppContacts />} />
      <Route path="*" element={<AppError404 />} />
      <Route element={<AppRoutesPrivate />}>
        <Route path="/films" element={<AppFilms />} />
        <Route path="/films/:filmId" element={<AppFilmDetails />} />
        <Route path="/films/recherche/:searchValue" element={<AppFilmsSearch />} />
        <Route path="/groupes" element={<AppGroupes />} />
        <Route path="/groupes/:groupName" element={<AppGroupeDetails />} />
        <Route path="/groupes/infos/:groupName" element={<AppGroupeGeneraleInfos />} />
        <Route path="/profil" element={<AppProfil />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

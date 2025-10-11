import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Alerts from "./pages/UiElements/Alerts";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PlanActionList from "./pages/planAction/PlanActionList";
import Utilisateur from "./pages/DataManagment/Utilisateurs";
import PiecesLivre from "./pages/DataManagment/PiecesLivres";
import Ligne from "./pages/DataManagment/Lignes";
import HistoriqueTache from "./pages/DataManagment/HistoriqueTaches";
import Fournisseur from "./pages/DataManagment/Fournisseurs";
import Client from "./pages/DataManagment/Clients";
import Article from "./pages/DataManagment/Articles";
import FichDMPP from "./pages/ToolsManagement/FichDMPP";
import RapportNonConformite from "./pages/ToolsManagement/RapportNonConfomite";
import RegistreSCRAP from "./pages/ToolsManagement/RegistrSCRAP";
import SuiviDefautClient from "./pages/ToolsManagement/SuiviDefautClient";
import SuiviDefaultFournisseur from "./pages/ToolsManagement/SuiviDefautFournisseur";
import SuiviSuperControle from "./pages/ToolsManagement/SuiviSuperControle";
import AddLigneForm from "./components/Ligne/AddLigneForm";
import AddPieceLivreForm from "./components/PieceLivre/AddPieceLivreForm";
import AddUserForm from "./components/Utilisateur/AddUserForm";
import AddRapportNcFrom from "./components/RapportNC/AddRapportNCForm";
import AddFIchDMPPForm from "./components/FichDMPP/AddFichDMPPForm";
import AddRegisterSCRAPForm from "./components/RegisterSCARP/AddRegisterSCRAPForm";
import AddPlanActionForm from "./components/PlanAction/AddPlanActionForm";
import AddSuiviClientForm from "./components/SuiviClient/AddSuiviClientForm";
import AddSuiviFournisseurForm from "./components/SuiviFournisseur/AddSuiviFournisseurForm";
import AddSuiviSuperControleForm from "./components/SuiviSuperControle/AddSuiviSuperControleForm";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./utils/AdminRoute";
import Error500 from "./pages/OtherPage/Error500";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<SignIn />} />

        {/* Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/dashboard" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />

            {/* Plan d'action */}
            <Route path="/plan-action" element={<PlanActionList />} />

            {/* Data management (Admin only) */}
            <Route
              path="/articles"
              element={
                <AdminRoute>
                  <Article />
                </AdminRoute>
              }
            />
            <Route
              path="/historique-taches"
              element={
                <AdminRoute>
                  <HistoriqueTache />
                </AdminRoute>
              }
            />
            <Route
              path="/lignes"
              element={
                <AdminRoute>
                  <Ligne />
                </AdminRoute>
              }
            />
            <Route
              path="/lignes/ajouter-ligne"
              element={
                <AdminRoute>
                  <AddLigneForm />
                </AdminRoute>
              }
            />
            <Route
              path="/pieces-livrees"
              element={
                <AdminRoute>
                  <PiecesLivre />
                </AdminRoute>
              }
            />
            <Route
              path="/pieces/ajouter-pieces"
              element={
                <AdminRoute>
                  <AddPieceLivreForm />
                </AdminRoute>
              }
            />
            <Route
              path="/utilisateurs"
              element={
                <AdminRoute>
                  <Utilisateur />
                </AdminRoute>
              }
            />
            <Route
              path="/utilisateurs/ajouter-utilisateur"
              element={
                <AdminRoute>
                  <AddUserForm />
                </AdminRoute>
              }
            />
            <Route
              path="/fournisseurs"
              element={
                <AdminRoute>
                  <Fournisseur />
                </AdminRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <AdminRoute>
                  <Client />
                </AdminRoute>
              }
            />


            {/* Tools management */}
            <Route path="/fich-dmpp" element={<FichDMPP />} />
            <Route path="/rapport-nc" element={<RapportNonConformite />} />
            <Route path="/registre-scrap" element={<RegistreSCRAP />} />
            <Route path="/suivi-client" element={<SuiviDefautClient />} />
            <Route path="/suivi-fournisseur" element={<SuiviDefaultFournisseur />} />
            <Route path="/suivi-super-controle" element={<SuiviSuperControle />} />
            <Route path="/rapport-nc/add-rnc" element={<AddRapportNcFrom />} />
            <Route path="/fich-dmpp/add-fich-dmpp" element={<AddFIchDMPPForm />} />
            <Route path="/scrap/add-reg-scrap" element={<AddRegisterSCRAPForm />} />
            <Route path="/plan-action/add-plan-action/:id/:type" element={<AddPlanActionForm />} />
            <Route path="/plan-action/add-plan-action" element={<AddPlanActionForm />} />
            <Route path="/suivi-client/add-suivi-client" element={<AddSuiviClientForm />} />
            <Route path="/suivi-fournisseur/add-suivi-fournisseur" element={<AddSuiviFournisseurForm />} />
            <Route path="/suivi-super-controle/add-suivi-super-controle" element={<AddSuiviSuperControleForm />} />
          </Route>
        </Route>
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
        <Route path="/error-500" element={<Error500 />} />
      </Routes>
    </Router>
  );
}

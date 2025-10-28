import PageMeta from "../../components/common/PageMeta";
import GlobalChart from "../../components/Dashboard/ChartGlobal";
import RetardByDep from "../../components/Dashboard/RetardByDep";
import DoneByDep from "../../components/Dashboard/DoneByDep";
import TauxActionRetard from "../../components/Dashboard/TauxActionRetard";
import TauxClotureTot from "../../components/Dashboard/TauxClotureTot";
import Cnq from "../../components/Dashboard/CNQ";
import ByUser from "../../components/Dashboard/ByUser";
import PpmClient from "../../components/Dashboard/PPM1";
import Ppm2 from "../../components/Dashboard/PPM2";
import PPM3 from "../../components/Dashboard/PPM3";
import ScrapByZoneChart from "../../components/Dashboard/TauxSCRAP";
import ParetoScrap from "../../components/Dashboard/ParetoScrap";
import ScrapCostOverTime from "../../components/Dashboard/ScrapCout";
import DmppPerMonth from "../../components/Dashboard/DmppPerMonth";
import MonthlyAuditChart from "../../components/Dashboard/MonthlyAuditChart";
import Cards from "../../components/Dashboard/Cards";
import { useEffect, useState } from "react";
import { DMPPOpenVsClosed } from "../../components/Dashboard/DMPPOpenVsClosed";

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getConnectedUserdata = () => {
      const userData = localStorage.getItem("userData");
      const storedUser = userData ? JSON.parse(userData) : null;
      return storedUser;
    };

    const user = getConnectedUserdata();
    setUserRole(user?.role || null);
  }, []);

  const isUser = userRole === "user";
  const isAgentQualite = userRole === "agent_qualite";
  const isAdmin = userRole === "admin";

  return (
    <>
      <PageMeta
        title="Dashboard"
        description="This is the Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {isUser && (
          <div className="col-span-12 xl:col-span-12">
            <ByUser />
          </div>
        )}

        {isAgentQualite && (
          <>
            <div className="col-span-12 xl:col-span-4">
              <PpmClient />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <Ppm2 />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <PPM3 />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <ByUser />
            </div>
          </>
        )}


        {isAdmin && (
          <>

            <div className="col-span-12 space-y-6 xl:col-span-12">
              <Cards />
            </div>
            <div className="col-span-12 xl:col-span-12">
              <MonthlyAuditChart />
            </div>

            <div className="col-span-12">
              <GlobalChart />
            </div>

            <div className="col-span-12 xl:col-span-6">
              <RetardByDep />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <DoneByDep />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <TauxActionRetard />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <TauxClotureTot />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <Cnq />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <ByUser />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <PpmClient />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <Ppm2 />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <PPM3 />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <ScrapByZoneChart />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <ScrapCostOverTime />
            </div>
            <div className="col-span-12 xl:col-span-12">
              <ParetoScrap />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <DMPPOpenVsClosed />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <DmppPerMonth />
            </div>
          </>
        )}

        {!userRole && (
          <div className="col-span-12 text-center py-8">
            <p className="text-gray-500">Chargement des données utilisateur...</p>
          </div>
        )}
      </div>
    </>
  );
}
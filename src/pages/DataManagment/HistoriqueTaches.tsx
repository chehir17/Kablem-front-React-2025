import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { SendNotif } from "../../icons";
import SendNotification from "../../components/Notifications/SendNotification";
import SendMessage from "../../components/Notifications/SendMessage";
import { Mail } from "lucide-react";

export default function HistoriqueTache() {
  interface Notif {
    id: number;
    titre: string;
    body: string;
    visibility: boolean;
    created_at: Date;
  }

  const [isSendNotifModelOpen, setIsSendNotifModelOpen] = useState(false);
  const [openSendMessage, setOpenSendMessage] = useState(false);

  const [notificationList, setNotificationList] = useState<Notif[]>([
    {
      id: 1,
      titre: "Le plan d'action N°37 est fermé",
      body: "Fermeture d'un plan d'action",
      visibility: false,
      created_at: new Date("2025-09-25"),
    },
    {
      id: 2,
      titre: "Le plan d'action N°38 est fermé",
      body: "Fermeture d'un plan d'action",
      visibility: false,
      created_at: new Date("2025-10-15"),
    },
    {
      id: 3,
      titre: "Nouveau plan d'action ajouté",
      body: "Pour plus de détails consulter le tableau des plans d'action",
      visibility: true,
      created_at: new Date("2025-11-22"),
    },
  ]);

  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");

  const toggleVisibility = (id: number) => {
    setNotificationList((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, visibility: !notif.visibility } : notif
      )
    );
  };

  const filteredNotifications = notificationList.filter((notif) => {
    if (filter === "visible") return notif.visibility;
    if (filter === "hidden") return !notif.visibility;
    return true;
  });

  return (
    <>
      <div>
        <PageMeta
          title="Historique des tâches"
          description="Suivi des notifications et tâches"
        />
        <PageBreadcrumb pageTitle="Historique des Tâches" />

        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-2 py-4 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="flex justify-between">
            <button
              onClick={() => setIsSendNotifModelOpen(true)}
              className="flex items-center gap-2 px-2 py-1 my-1 text-xs text-white bg-success-500 rounded hover:bg-success-700 hover:shadow-xl transition-shadow duration-200"
            >
              Envoyer Notification
              <SendNotif className="mt-0.5" />
            </button>

            <button
              onClick={() => setOpenSendMessage(true)}
              className="flex items-center gap-2 px-2 py-1 my-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
              Envoyer Message
              <Mail className="w-4 h-4" />
            </button>
            <SendMessage
              isOpen={openSendMessage}
              onClose={() => setOpenSendMessage(false)}
            />
          </div>

          <div className="flex gap-3 my-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs rounded ${filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter("visible")}
              className={`px-3 py-1 text-xs rounded ${filter === "visible"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Visibles
            </button>
            <button
              onClick={() => setFilter("hidden")}
              className={`px-3 py-1 text-xs rounded ${filter === "hidden"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Masquées
            </button>
          </div>

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tâche
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredNotifications.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <h3 className="font-semibold">{notif.titre}</h3>
                    <p>{notif.body}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {notif.created_at.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${notif.visibility
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {notif.visibility ? "Visible" : "Masquée"}
                      </span>
                      <button
                        onClick={() => toggleVisibility(notif.id)}
                        className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-700"
                      >
                        {notif.visibility ? "Masquer" : "Rendre Visible"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <SendNotification
            isOpen={isSendNotifModelOpen}
            onClose={() => setIsSendNotifModelOpen(false)}
          />
        </div>
      </div>
    </>
  );
}

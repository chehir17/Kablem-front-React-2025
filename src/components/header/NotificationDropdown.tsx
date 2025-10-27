import { JSX, useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { Notif } from "../../types/Notif";
import { NotifService } from "../../services/NotifService";

const notifications: Notif[] = [];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifList, setNotifList] = useState<Notif[]>(notifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotif = async () => {
    try {
      if (!user) return;

      const response = await NotifService.getById(user.id_user);
      const data = response.data;

      let list: Notif[] = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      }

      if (user.role === "admin") {
        list = list.filter((n) => n.visibility === 3);
      } else {
        list = list.filter((n) => n.visibility === 0);
      }

      setNotifList(list);

      const unread = list.some((n) =>
        user.role === "admin" ? n.visibility === 3 : n.visibility === 0
      );
      setHasUnread(unread);
    } catch (err) {
      setError(" Impossible de charger vos notifications.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const storedUser = userData ? JSON.parse(userData) : null;
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotif();
    }
  }, [user]);

  const updateVisibility = async () => {
    try {
      if (!user) return;

      const unreadNotif = notifList.filter((n) =>
        user.role === "admin" ? n.visibility === 3 : n.visibility === 0
      );

      if (unreadNotif.length === 0) return;

      await Promise.all(
        unreadNotif.map((notif) =>
          NotifService.updateNotif(notif.id_notif, {
            visibility: user.role === "admin" ? 4 : 1,
          })
        )
      );

      setNotifList((prev) =>
        prev.map((n) => ({
          ...n,
          visibility: user.role === "admin" ? 4 : 1,
        }))
      );

      setHasUnread(false);
    } catch (error) {
      console.error(" Erreur lors de la mise à jour des notifications :", error);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      updateVisibility();
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {hasUnread && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-[240px] mt-[17px] flex h-auto w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
        </div>

        {loading && <p className="p-4 text-center">⏳ Chargement des notifications...</p>}
        {error && <p className="p-4 text-center text-red-600">{error}</p>}

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifList.length === 0 && !loading && !error && (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">
              🔕 Aucune notification disponible
            </p>
          )}
          {notifList.map((notification) => (
            <li key={notification.id_notif}>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <span className="block">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {notification.titre}
                  </p>
                  <span className="text-gray-500 dark:text-gray-400">{notification.body}</span>

                  <span className="flex items-center gap-2 mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                    <span>
                      {notification.created_at
                        ? typeof notification.created_at === "string"
                          ? notification.created_at
                          : notification.created_at.toLocaleString()
                        : "Inconnue"}
                    </span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>

        <Link
          to="/historique-taches"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Afficher toutes les notifications
        </Link>
      </Dropdown>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Settings, User, MessageSquare, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
};

export default function AdminHeader({ user }: { user: AdminUser }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [totalPending, setTotalPending] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setTotalPending(data.totalPending);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left side - could add breadcrumb here */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-gray-900 font-medium">Dashboard Admin</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            id="admin-notifications-btn"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {totalPending > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {totalPending > 99 ? "99+" : totalPending}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-20">
                <div className="p-4 border-b border-gray-100 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Notifikasi Baru</h3>
                    <p className="text-xs text-gray-500">
                      Ada {totalPending} pengajuan menunggu persetujuan
                    </p>
                  </div>
                  {totalPending > 0 && (
                    <span className="badge badge-emerald text-[10px]">Pending</span>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Link
                        key={`${notif.type}-${notif.id}`}
                        href={notif.href}
                        onClick={() => setNotifOpen(false)}
                        className="flex gap-3 p-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          notif.type === "complaint" 
                            ? "bg-amber-50 text-amber-600" 
                            : "bg-blue-50 text-blue-600"
                        )}>
                          {notif.type === "complaint" ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {notif.subtitle}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] font-mono text-gray-400">
                              #{notif.ticketNumber}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {formatTime(notif.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                      <p className="text-xs font-medium">Tidak ada notifikasi pending</p>
                    </div>
                  )}
                </div>

                <div className="p-2.5 border-t border-gray-100 bg-gray-50 text-center">
                  <span className="text-[10px] text-gray-400">
                    Sistem memeriksa data baru secara otomatis
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            id="admin-user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl hover:bg-gray-50 px-2 py-1.5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-20">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="p-2">
                  <button className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="h-4 w-4" />
                    Profil Saya
                  </button>
                  <button className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    id="admin-logout-btn"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

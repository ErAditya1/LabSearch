'use client'
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ReactNode } from "react";
import { useUser } from "@/contexts/UserContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user= useUser();

  // console.log(user);

  // if (user.isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!user.id) {
  //   return <div>Unauthorized</div>;
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

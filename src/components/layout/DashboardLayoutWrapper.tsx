"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MainHeader from "./MainHeader";

export default function DashboardLayoutWrapper({
  children,
  role,
  viewingTenantId, // NEW
}: {
  children: React.ReactNode;
  role: string;
  viewingTenantId: string; // NEW
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 w-full">
      <Sidebar
        isCollapsed={isCollapsed}
        role={role}
        viewingTenantId={viewingTenantId}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        <MainHeader
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div className="flex-1 relative overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

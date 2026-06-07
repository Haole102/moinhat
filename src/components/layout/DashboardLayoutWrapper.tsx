"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MainHeader from "./MainHeader";

export default function DashboardLayoutWrapper({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 w-full">
      {/* Lắp ghép Sidebar */}
      <Sidebar isCollapsed={isCollapsed} role={role} />

      {/* Khu vực nội dung động bên phải */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        {/* Lắp ghép Thanh Header phụ chứa nút bấm điều khiển */}
        <MainHeader
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Render các trang con (Dashboard, Quản lý xe...) */}
        <div className="flex-1 relative overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

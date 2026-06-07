"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import TenantSelector from "./TenantSelector";

interface SidebarProps {
  isCollapsed: boolean;
  role: string;
  viewingTenantId: string; // NEW
}

export default function Sidebar({
  isCollapsed,
  role,
  viewingTenantId,
}: SidebarProps) {
  const pathname = usePathname();
  const [isOperateOpen, setIsOperateOpen] = useState(true);

  return (
    <aside
      className={`border-r border-slate-200 bg-white flex flex-col shrink-0 h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-0 overflow-hidden border-r-0" : "w-64"
      }`}
    >
      {/* 1. Header: Thông tin Công ty */}
      <TenantSelector role={role} viewingTenantId={viewingTenantId} />

      {/* 2. Body: Các đường link menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <p className="px-2 text-xs font-medium text-slate-500 mb-2">
            Nền tảng
          </p>
          <div className="space-y-1">
            {/* Menu con có thể thu gọn */}
            <div>
              <button
                onClick={() => setIsOperateOpen(!isOperateOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  Vận hành xe
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isOperateOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isOperateOpen && (
                <div className="mt-1 ml-4 border-l border-slate-200 pl-2 flex flex-col space-y-1">
                  <Link
                    href="/quan-ly-xe"
                    className={`px-2 py-1.5 text-sm rounded-md transition-colors ${
                      pathname === "/quan-ly-xe"
                        ? "bg-slate-100 font-semibold text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Danh sách Đội xe
                  </Link>
                  <Link
                    href="/quan-ly-xe/lich-su-bao-tri"
                    className={`px-2 py-1.5 text-sm rounded-md transition-colors ${
                      pathname === "/quan-ly-xe/lich-su-bao-tri"
                        ? "bg-slate-100 font-semibold text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Lịch sử bảo trì
                  </Link>
                  <Link
                    href="/quan-ly-xe/canh-bao-dinh-vi"
                    className={`px-2 py-1.5 text-sm rounded-md transition-colors ${
                      pathname === "/quan-ly-xe/canh-bao-dinh-vi"
                        ? "bg-slate-100 font-semibold text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Cảnh báo định vị
                  </Link>
                </div>
              )}
            </div>

            {/* Menu đơn lẻ */}
            <Link
              href="/"
              className={`flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Báo cáo P&L
            </Link>

            <Link
              href="#"
              className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Tài liệu
            </Link>

            <Link
              href="#"
              className="flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Cài đặt
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Footer: Nhúng component tài khoản đã tách */}
      <UserMenu />
    </aside>
  );
}

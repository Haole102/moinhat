"use client";

import { useState } from "react";
import { ROLES } from "@/lib/constants";

export default function TenantSelector({ role }: { role: string }) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Kiểm tra xem có phải là Super Admin hay không
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  return (
    <div className="relative p-3 border-b border-slate-100">
      {/* NẾU LÀ SUPER ADMIN: Cho phép bấm (cursor-pointer), ngược lại KHÓA CON TRỎ (cursor-default)
       */}
      <div
        onClick={() => isSuperAdmin && setShowDropdown(!showDropdown)}
        className={`flex items-center justify-between w-full p-2 rounded-xl transition-colors ${
          isSuperAdmin
            ? "hover:bg-slate-50 cursor-pointer group"
            : "bg-slate-50/50 cursor-default"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Icon Doanh nghiệp */}
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
            {isSuperAdmin ? "SA" : "AC"}
          </div>

          <div className="flex flex-col text-left truncate">
            <span className="text-sm font-bold text-slate-900 truncate">
              {isSuperAdmin ? "Hệ Thống Tổng" : "Công ty Acme"}
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              {isSuperAdmin ? "Quyền: Super Admin" : "Doanh nghiệp thành viên"}
            </span>
          </div>
        </div>

        {/* ẨN/HIỆN MŨI TÊN: Chỉ Super Admin mới thấy icon mũi tên đổi doanh nghiệp
         */}
        {isSuperAdmin ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-400 group-hover:text-slate-600 transition-colors"
          >
            <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
          </svg>
        ) : (
          /* Khách hàng thường thì hiện Icon Khóa hoặc không hiện gì để báo hiệu không thể bấm */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-300"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
      </div>

      {/* POPUP CHỌN TỔ CHỨC / DOANH NGHIỆP (Chỉ dành cho Super Admin) */}
      {isSuperAdmin && showDropdown && (
        <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-1">
          <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Danh sách Tenant
          </p>
          <button
            onClick={() => setShowDropdown(false)}
            className="text-left text-xs font-semibold text-slate-700 px-2.5 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            🏢 Công ty Acme (Tenant 1)
          </button>
          <button
            onClick={() => setShowDropdown(false)}
            className="text-left text-xs font-semibold text-slate-700 px-2.5 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            🚚 Logistics Toàn Cầu (Tenant 2)
          </button>
          <button
            onClick={() => setShowDropdown(false)}
            className="text-left text-xs font-semibold text-slate-700 px-2.5 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            🏗️ Xây dựng Vin-Group (Tenant 3)
          </button>
        </div>
      )}
    </div>
  );
}

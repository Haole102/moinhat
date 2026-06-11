"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ROLES, MOCK_TENANTS } from "@/lib/constants";
import { setViewingTenantAction } from "@/app/actions/tenant";

interface TenantSelectorProps {
  role: string;
  viewingTenantId: string; // tenant đang được xem hiện tại
}

export default function TenantSelector({
  role,
  viewingTenantId,
}: TenantSelectorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  // Tenant đang xem — tìm trong danh sách MOCK_TENANTS
  const currentTenant =
    MOCK_TENANTS.find((t) => t.id === viewingTenantId) || MOCK_TENANTS[0];

  // Lọc danh sách tenant theo ô tìm kiếm
  const filteredTenants = MOCK_TENANTS.filter((t) =>
    t.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleTenantSelect = async (tenantId: string) => {
    if (tenantId === viewingTenantId) {
      setShowDropdown(false);
      return;
    }

    setIsSwitching(true);
    setShowDropdown(false);
    setSearchText("");

    // 1. Ghi cookie trên server — page.tsx sẽ đọc để filter data
    await setViewingTenantAction(tenantId);

    // 2. Xóa toàn bộ cache TanStack Query — buộc dùng initialData mới từ server
    queryClient.removeQueries();

    // 3. Re-render server components → initialData mới chảy xuống client
    router.refresh();

    setIsSwitching(false);
  };

  return (
    <div className="relative p-3 border-b border-slate-100">
      <div
        onClick={() => isSuperAdmin && setShowDropdown(!showDropdown)}
        className={`flex items-center justify-between w-full p-2 rounded-xl transition-colors ${
          isSuperAdmin
            ? "hover:bg-slate-50 cursor-pointer group"
            : "bg-slate-50/50 cursor-default"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-xs">
            {isSuperAdmin ? "SA" : currentTenant.emoji}
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="text-sm font-bold text-slate-900 truncate">
              {isSuperAdmin ? currentTenant.name : currentTenant.name}
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              {isSuperAdmin ? "Quyền: Super Admin" : "Doanh nghiệp thành viên"}
            </span>
          </div>
        </div>

        {isSuperAdmin ? (
          isSwitching ? (
            // Hiển thị loading khi đang chuyển tenant
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"
            >
              <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
            </svg>
          )
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-300 shrink-0"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
      </div>

      {/* DROPDOWN — chỉ Super Admin */}
      {isSuperAdmin && showDropdown && (
        <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Ô tìm kiếm */}
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm công ty..."
              autoFocus
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
            />
          </div>

          {/* Danh sách tenant đã lọc */}
          <div className="p-1.5 flex flex-col gap-0.5 max-h-48 overflow-y-auto">
            <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Danh sách Tenant
            </p>

            {filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => {
                const isActive = tenant.id === viewingTenantId;
                return (
                  <button
                    key={tenant.id}
                    onClick={() => handleTenantSelect(tenant.id)}
                    className={`flex items-center gap-2 text-left text-xs font-semibold px-2.5 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 cursor-default"
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span>{tenant.emoji}</span>
                    <span className="truncate">{tenant.name}</span>
                    {isActive && (
                      <span className="ml-auto text-[10px] font-bold text-blue-500 shrink-0">
                        ✓ Đang xem
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="px-2.5 py-3 text-center text-xs text-slate-400">
                Không tìm thấy công ty nào.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

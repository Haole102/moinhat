"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalProfile from "./modals/ModalProfile";
import ModalPassword from "./modals/ModalPassword";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";

export default function UserMenu() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  // Các state quản lý việc mở hộp thoại popup tính năng độc lập
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Xử lý đăng xuất tài khoản
  const handleLogout = async () => {
    setShowMenu(false);
    
    toast.loading("Đang đăng xuất khỏi hệ thống doanh nghiệp...", { id: "logout" });
    
    try {
      await logoutAction();
      toast.success("Đăng xuất thành công", { id: "logout" });
      router.push(ROUTES.LOGIN); // Đẩy người dùng về trang đăng nhập
      router.refresh();
    } catch (error) {
      toast.error("Lỗi khi đăng xuất", { id: "logout" });
    }
  };

  return (
    <div className="mt-auto border-t border-slate-100 p-3 relative shrink-0">
      {/* POP-UP MENU TÍNH NĂNG (Bung lên trên) */}
      {showMenu && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 flex flex-col gap-1 z-50 transition-all">
          <button
            onClick={() => {
              setShowMenu(false);
              setIsProfileOpen(true);
            }}
            className="text-left text-xs font-medium text-slate-700 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => {
              setShowMenu(false);
              setIsPasswordOpen(true);
            }}
            className="text-left text-xs font-medium text-slate-700 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Đổi mật khẩu
          </button>
          <hr className="border-slate-100 my-1" />
          <button
            onClick={handleLogout}
            className="text-left text-xs font-medium text-red-600 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors w-full cursor-pointer"
          >
            Đăng xuất tài khoản
          </button>
        </div>
      )}

      {/* NÚT KHỐI HIỂN THỊ TÀI KHOẢN */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center justify-between w-full p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src="https://ui.shadcn.com/avatars/02.png"
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
          />
          <div className="flex flex-col text-left truncate">
            <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              Hào Nguyễn
            </span>
            <span className="text-xs text-slate-500 truncate">
              hao@example.com
            </span>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${showMenu ? "rotate-180 text-slate-600" : ""}`}
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      {/* ĐẶT CÁC MODAL ĐẰNG SAU (Chỉ hiển thị khi các state tương ứng là true) */}
      <ModalProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <ModalPassword
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
    </div>
  );
}

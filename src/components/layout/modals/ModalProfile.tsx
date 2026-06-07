"use client";

import { toast } from "sonner";
interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalProfile({ isOpen, onClose }: ModalProfileProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Thông tin cá nhân</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-4 space-y-4 text-sm text-slate-600">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <img
              src="https://ui.shadcn.com/avatars/02.png"
              className="w-14 h-14 rounded-full border border-slate-200"
              alt="Avatar"
            />
            <div>
              <p className="font-semibold text-slate-900 text-base">
                Hào Nguyễn
              </p>
              <p className="text-xs text-slate-500">Quyền hạn: Super Admin</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Email hệ thống
            </label>
            <input
              type="text"
              disabled
              value="hao@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Số điện thoại nhận cảnh báo GPS
            </label>
            <input
              type="text"
              placeholder="0901234567"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              toast.success("Cập nhật thành công!");
              onClose();
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

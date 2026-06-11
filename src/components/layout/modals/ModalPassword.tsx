"use client";

import { toast } from "sonner";
interface ModalPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalPassword({ isOpen, onClose }: ModalPasswordProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            Đổi mật khẩu tài khoản
          </h3>
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
        <div className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Xác nhận lại mật khẩu mới
            </label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy bớt
          </button>
          <button
            onClick={() => {
              toast.success("Đổi mật khẩu thành công!");
              onClose();
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Xác nhận đổi
          </button>
        </div>
      </div>
    </div>
  );
}

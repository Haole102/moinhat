"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.DASHBOARD;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goToCallbackUrl = () => {
    window.location.assign(callbackUrl);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAction(username, password);
      if (result.success) {
        toast.success(result.message);
        goToCallbackUrl();
      } else {
        setError(result.message);
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (type: "super" | "tenant") => {
    setLoading(true);
    setError("");
    try {
      const result = await loginAction("", "", type);
      if (result.success) {
        toast.success(result.message);
        goToCallbackUrl();
      } else {
        setError(result.message);
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập nhanh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hệ thống Quản lý Đội xe
        </h1>
        <p className="text-sm text-slate-500">
          Vui lòng đăng nhập để tiếp tục phiên làm việc
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2.5 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Tài khoản
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tài khoản test..."
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-3 rounded-xl transition-colors cursor-pointer shadow-md disabled:bg-blue-400"
        >
          {loading ? "Xác thực thông tin..." : "Đăng nhập hệ thống"}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Test nhanh phân quyền
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickLogin("tenant")}
            className="p-2.5 text-left border border-slate-200 hover:border-blue-500 rounded-xl hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
              Khách Hàng
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">tenant_123</p>
          </button>

          <button
            type="button"
            onClick={() => quickLogin("super")}
            className="p-2.5 text-left border border-slate-200 hover:border-blue-500 rounded-xl hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
              Super Admin
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Hào & Quân</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={<div className="text-white">Đang tải biểu mẫu...</div>}
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}

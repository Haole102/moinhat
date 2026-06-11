// src/app/(dashboard)/quan-ly-xe/canh-bao-dinh-vi/_components/ModalCreateMaintenanceOrder.tsx
"use client";

import { useState } from "react";
import { useExpenseMutation } from "@/hooks/useVehicleMutation";
import { Vehicle } from "@/lib/services/vehicle.service";
import { toast } from "sonner";

interface ModalCreateMaintenanceOrderProps {
  vehicle: Vehicle;
  // Gợi ý loại bảo dưỡng dựa trên lý do cảnh báo
  suggestedCategory: "oil" | "tire";
  onClose: () => void;
}

export default function ModalCreateMaintenanceOrder({
  vehicle,
  suggestedCategory,
  onClose,
}: ModalCreateMaintenanceOrderProps) {
  const [category, setCategory] = useState(suggestedCategory);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState(
    // Điền sẵn nội dung gợi ý dựa theo loại cảnh báo
    suggestedCategory === "oil"
      ? `Thay nhớt máy định kỳ — Odometer: ${vehicle.odometer.toLocaleString()} KM`
      : `Thay lốp — Lốp hiện tại đã chạy: ${vehicle.tireKM.toLocaleString()} KM`,
  );

  const mutation = useExpenseMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Vui lòng nhập số tiền dự kiến!");
      return;
    }

    mutation.mutate(
      {
        vehicleId: vehicle.id,
        category,
        amount: Number(amount),
        description,
        receiptImage: "",
      },
      {
        onSuccess: () => {
          toast.success(
            `Đã tạo lệnh bảo dưỡng cho xe ${vehicle.plateNumber}! Hồ sơ đang chờ kế toán phê duyệt.`,
          );
          onClose();
        },
        onError: () => {
          toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-900 text-sm">
              Tạo lệnh bảo dưỡng
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Xe{" "}
              <strong className="text-blue-600">{vehicle.plateNumber}</strong> —{" "}
              {vehicle.driverName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Thông tin xe — chỉ đọc */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Odometer hiện tại:</span>
              <span className="font-mono font-bold text-slate-900">
                {vehicle.odometer.toLocaleString()} KM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hạn thay dầu:</span>
              <span
                className={`font-mono font-bold ${
                  vehicle.odometer >= vehicle.nextOilChangeKM
                    ? "text-red-600"
                    : "text-slate-900"
                }`}
              >
                {vehicle.nextOilChangeKM.toLocaleString()} KM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">KM lốp hiện tại:</span>
              <span
                className={`font-mono font-bold ${
                  vehicle.tireKM >= 50000 ? "text-red-600" : "text-slate-900"
                }`}
              >
                {vehicle.tireKM.toLocaleString()} / 50.000 KM
              </span>
            </div>
          </div>

          {/* Loại bảo dưỡng */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Loại bảo dưỡng *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "oil" | "tire")}
              className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm bg-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="oil">🛢️ Thay nhớt máy</option>
              <option value="tire">🔵 Thay lốp xe</option>
              <option value="engine">🔧 Sửa động cơ</option>
              <option value="rescue">🚨 Cứu hộ dọc đường</option>
            </select>
          </div>

          {/* Số tiền dự kiến */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Số tiền dự kiến (VNĐ) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ví dụ: 1500000"
              className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-blue-500"
            />
            {amount && Number(amount) > 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                ≈ {Number(amount).toLocaleString("vi-VN")} đ
              </p>
            )}
          </div>

          {/* Mô tả — điền sẵn, có thể chỉnh */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Ghi chú kỹ thuật
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {mutation.isPending
                ? "Đang tạo lệnh..."
                : "✅ Tạo lệnh bảo dưỡng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

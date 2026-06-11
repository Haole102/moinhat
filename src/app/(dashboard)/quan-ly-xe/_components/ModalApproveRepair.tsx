"use client";

import { useExpenseQuery } from "@/hooks/useVehicleQuery";
import { useApproveExpenseMutation } from "@/hooks/useVehicleMutation";
import { Vehicle } from "@/lib/services/vehicle.service";
import { toast } from "sonner";

interface ModalApproveRepairProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export default function ModalApproveRepair({
  vehicle,
  onClose,
}: ModalApproveRepairProps) {
  // Tự động tìm kiếm xem xe này đang có hóa đơn nào chờ duyệt không
  const { data: expenses } = useExpenseQuery();
  const approveMutation = useApproveExpenseMutation();

  const pendingExpense = expenses?.find(
    (e) => e.vehicleId === vehicle.id && e.status === "pending",
  );

  const handleApprove = () => {
    if (!pendingExpense) return;
    approveMutation.mutate(pendingExpense.id, {
      onSuccess: () => {
        toast.success(
          "Đã duyệt chi phí! Biểu đồ P&L sẽ tự động cập nhật Lợi nhuận.",
        );
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-900 text-sm">
              Hồ sơ chờ phê duyệt
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Từ Zalo Mini App của tài xế
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Nội dung hóa đơn */}
        <div className="p-5 space-y-4">
          {!pendingExpense ? (
            <p className="text-center text-sm text-slate-500 py-4">
              Xe này không có hóa đơn nào đang chờ duyệt.
            </p>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                  🚚
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {vehicle.plateNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tài xế báo cáo:{" "}
                    <strong className="text-slate-800">
                      {vehicle.driverName}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-xs">Loại dịch vụ:</span>
                  <span className="font-bold text-slate-800 text-xs uppercase">
                    {pendingExpense.category === "engine"
                      ? "Sửa Động Cơ"
                      : pendingExpense.category}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-xs">
                    Nội dung báo cáo:
                  </span>
                  <span className="font-semibold text-slate-800 text-xs text-right max-w-[60%]">
                    {pendingExpense.description}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-xs">
                    Tổng tiền yêu cầu:
                  </span>
                  <span className="font-black text-red-600 text-base">
                    {pendingExpense.amount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              {/* Giả lập khung hiển thị ảnh chụp từ Zalo */}
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">
                  Ảnh chứng từ hiện trường:
                </p>
                <div className="w-full h-32 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 flex-col gap-1">
                  <span>📸</span>
                  <span>[Ảnh chụp hóa đơn từ Zalo]</span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs transition-colors"
                >
                  ❌ Từ chối
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="flex-1 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {approveMutation.isPending
                    ? "Đang xử lý..."
                    : "✅ Chấp thuận Chi"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

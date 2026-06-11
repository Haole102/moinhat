"use client";

import { useVehicleQuery, useExpenseQuery } from "@/hooks/useVehicleQuery";
import { useApproveExpenseMutation } from "@/hooks/useVehicleMutation";
import { Vehicle, MaintenanceExpense } from "@/lib/services/vehicle.service";

interface DashboardClientProps {
  initialVehicles: Vehicle[];
  initialExpenses: MaintenanceExpense[];
}

export default function DashboardClientWrapper({
  initialVehicles,
  initialExpenses,
}: DashboardClientProps) {
  const { data: vehicles } = useVehicleQuery(initialVehicles);
  const { data: expenses } = useExpenseQuery(initialExpenses);
  const approveMutation = useApproveExpenseMutation();

  // 1. Logic Tính Toán Tài Chính P&L Thực Tế Theo Trạng Thái Phê Duyệt Hóa Đơn
  const baseRevenue = 152000000; // Doanh thu gốc giả định từ hợp đồng vận đơn

  // Tổng hợp chi phí sửa chữa từ các hóa đơn ĐÃ ĐƯỢC DUYỆT
  const approvedMaintenanceCost = expenses
    ? expenses
        .filter((e) => e.status === "approved")
        .reduce((sum, curr) => sum + curr.amount, 0)
    : 0;

  const baseOperationalCost = 72000000; // Chi phí xăng dầu, lương cứng mặc định
  const totalExpenses = baseOperationalCost + approvedMaintenanceCost;
  const netProfit = baseRevenue - totalExpenses;
  const profitMargin = ((netProfit / baseRevenue) * 100).toFixed(1);

  // 2. Phân Tích Biểu Đồ Trạng Thái Đội Xe (Thuần Tailwind CSS)
  const totalVehicles = vehicles?.length || 0;
  const onRoadCount =
    vehicles?.filter((v) => v.status === "on_road").length || 0;
  const waitingCount =
    vehicles?.filter((v) => v.status === "waiting").length || 0;
  const maintenanceCount =
    vehicles?.filter((v) => v.status === "maintenance").length || 0;

  const onRoadPercent = totalVehicles ? (onRoadCount / totalVehicles) * 100 : 0;
  const waitingPercent = totalVehicles
    ? (waitingCount / totalVehicles) * 100
    : 0;
  const maintenancePercent = totalVehicles
    ? (maintenanceCount / totalVehicles) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* KHỐI CHỈ SỐ KPIs TÀI CHÍNH P&L */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng Doanh Thu (Revenue)
          </p>
          <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">
            {baseRevenue.toLocaleString("vi-VN")} đ
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
            ↑ Đã bao gồm vận đơn tháng
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tổng Chi Phí (Expenses)
          </p>
          <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">
            {totalExpenses.toLocaleString("vi-VN")} đ
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 inline-block">
            Bảo dưỡng duyệt:{" "}
            <strong className="text-red-500">
              {approvedMaintenanceCost.toLocaleString("vi-VN")}đ
            </strong>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Lợi Nhuận Thuần (Profit)
          </p>
          <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">
            +{netProfit.toLocaleString("vi-VN")} đ
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
            Dòng tiền thực thu về
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Biên Lợi Nhuận (Margin)
          </p>
          <p className="text-xl md:text-2xl font-black text-blue-600 mt-1">
            {profitMargin}%
          </p>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 inline-block">
            Hiệu suất sử dụng vốn
          </span>
        </div>
      </div>

      {/* BIỂU ĐỒ TRẠNG THÁI ĐỘI XE BẰNG THUẦN TAILWIND CSS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Trạng thái vận hành Đội xe (Live GPS Analysis)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân mảnh hiệu suất hoạt động thực tế trên đường của tổng số{" "}
            {totalVehicles} phương tiện.
          </p>
        </div>

        {/* Thanh phân mảnh tỉ lệ thiết kế bằng CSS nguyên bản cực nhẹ */}
        <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${onRoadPercent}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title="Đang chạy"
          />
          <div
            style={{ width: `${waitingPercent}%` }}
            className="bg-amber-400 h-full transition-all duration-500"
            title="Nằm bãi chờ"
          />
          <div
            style={{ width: `${maintenancePercent}%` }}
            className="bg-rose-500 h-full transition-all duration-500"
            title="Bảo trì"
          />
        </div>

        {/* Chú giải chi tiết chỉ số */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            <span className="text-xs text-slate-500 font-medium">
              Đang chạy:
            </span>
            <p className="text-sm font-black text-emerald-700 mt-0.5">
              {onRoadCount} xe ({onRoadPercent.toFixed(0)}%)
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />
            <span className="text-xs text-slate-500 font-medium">
              Chờ hàng:
            </span>
            <p className="text-sm font-black text-amber-700 mt-0.5">
              {waitingCount} xe ({waitingPercent.toFixed(0)}%)
            </p>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
            <span className="text-xs text-slate-500 font-medium">
              Sửa chữa:
            </span>
            <p className="text-sm font-black text-rose-700 mt-0.5">
              {maintenanceCount} xe ({maintenancePercent.toFixed(0)}%)
            </p>
          </div>
        </div>
      </div>

      {/* WORKFLOW PHÊ DUYỆT CHI PHÍ CHỐNG GIAN LẬN */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <h3 className="font-bold text-slate-900 text-sm">
            Hồ sơ chờ kế toán duyệt (Approval Workflow)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Danh sách hóa đơn tài xế bắt buộc chụp trực tiếp từ hiện trường gửi
            về.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {expenses
            ?.filter((e) => e.status === "pending")
            .map((exp) => (
              <div
                key={exp.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      {exp.plateNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                      {exp.category === "oil"
                        ? "Thay nhớt"
                        : exp.category === "tire"
                          ? "Thay lốp"
                          : exp.category === "engine"
                            ? "Động cơ"
                            : "Cứu hộ"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Nội dung: {exp.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>⏱️ Hóa đơn thực địa (🔒 Bảo mật Camera)</span>
                    <span>•</span>
                    <span>
                      {new Date(exp.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="text-sm font-extrabold text-red-600">
                    {exp.amount.toLocaleString("vi-VN")} đ
                  </span>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Bạn có chắc chắn hóa đơn này hợp lệ và đồng ý cộng trừ vào dòng tiền tài chính công ty?",
                        )
                      ) {
                        approveMutation.mutate(exp.id);
                      }
                    }}
                    disabled={approveMutation.isPending}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all disabled:opacity-50"
                  >
                    {approveMutation.isPending ? "Đang duyệt..." : "Phê duyệt"}
                  </button>
                </div>
              </div>
            ))}

          {expenses?.filter((e) => e.status === "pending").length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              ✅ Không có hóa đơn sửa chữa nào đang tồn đọng cần phê duyệt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

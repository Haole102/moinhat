import { vehicleService } from "@/lib/services/vehicle.service";
import DashboardClientWrapper from "./components/DashboardClientWrapper";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Lấy dữ liệu tĩnh ban đầu từ Server chuyển giao qua ranh giới Client
  const initialVehicles = await vehicleService.getVehicles();
  const initialExpenses = await vehicleService.getExpenses();

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Tổng quan Tài chính & Đội xe
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Báo cáo P&L phân luồng Multi-tenant tích hợp Real-time GPS Tracker.
        </p>
      </div>

      {/* Chuyển tiếp dữ liệu sang Client Layer xử lý tương tác */}
      <DashboardClientWrapper
        initialVehicles={initialVehicles}
        initialExpenses={initialExpenses}
      />
    </div>
  );
}

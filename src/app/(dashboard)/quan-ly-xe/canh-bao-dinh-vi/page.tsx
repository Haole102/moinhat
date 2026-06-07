// src/app/(dashboard)/quan-ly-xe/canh-bao-dinh-vi/page.tsx

import { vehicleService } from "@/lib/services/vehicle.service";
import MaintenanceAlertList from "./_components/MaintenanceAlertList";

export const dynamic = "force-dynamic";

export default async function CanhBaoDinhViPage() {
  const initialVehicles = await vehicleService.getVehicles();

  // Đếm sẵn trên server để hiển thị số liệu tổng quan ở header
  const redCount = initialVehicles.filter(
    (v) => v.odometer >= v.nextOilChangeKM || v.tireKM >= 50000,
  ).length;

  const yellowCount = initialVehicles.filter((v) => {
    const isRed = v.odometer >= v.nextOilChangeKM || v.tireKM >= 50000;
    const kmLeft = v.nextOilChangeKM - v.odometer;
    const isYellow = !isRed && kmLeft <= 500 && kmLeft > 0;
    return isYellow;
  }).length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER + TỔNG QUAN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Cảnh báo Định vị GPS
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Theo dõi ngưỡng bảo dưỡng tự động từ dữ liệu odometer thời gian
            thực.
          </p>
        </div>

        {/* Hai badge tổng quan tính sẵn từ server */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span className="text-xs font-bold text-red-700">
              {redCount} Quá hạn
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-700">
              {yellowCount} Sắp đến hạn
            </span>
          </div>
        </div>
      </div>

      {/* CLIENT LAYER xử lý interactive */}
      <MaintenanceAlertList initialVehicles={initialVehicles} />
    </div>
  );
}

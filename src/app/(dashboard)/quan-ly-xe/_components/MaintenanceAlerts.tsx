"use client";

import { useVehicleQuery } from "@/hooks/useVehicleQuery";
import { Vehicle } from "@/lib/services/vehicle.service";

export default function MaintenanceAlerts({
  initialData,
}: {
  initialData: Vehicle[];
}) {
  const { data: vehicles } = useVehicleQuery(initialData);

  // Quét lọc điều kiện kỹ thuật tự động
  const criticalVehicles =
    vehicles?.filter((v) => {
      const isOilOverdue = v.odometer >= v.nextOilChangeKM;
      const isTireOverdue = v.tireKM >= 50000; // Tiêu chuẩn an toàn: lốp quá 5 vạn KM ép thay
      return isOilOverdue || isTireOverdue;
    }) || [];

  if (criticalVehicles.length === 0) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2.5 animate-pulse-slow">
      <div className="flex items-center gap-2 text-rose-800">
        <span className="text-lg">🚨</span>
        <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider">
          Góc Cảnh báo Bảo trì Khẩn cấp (GPS Live Tracker)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {criticalVehicles.map((vehicle) => {
          const oilOverKM = vehicle.odometer - vehicle.nextOilChangeKM;
          return (
            <div
              key={vehicle.id}
              className="bg-white/80 p-3 rounded-lg border border-rose-100 flex justify-between items-center text-xs"
            >
              <div>
                <p className="font-extrabold text-slate-900">
                  {vehicle.plateNumber} ({vehicle.model})
                </p>
                <p className="text-slate-500 font-medium mt-0.5">
                  Tài xế phụ trách:{" "}
                  <strong className="text-slate-800">
                    {vehicle.driverName}
                  </strong>
                </p>
                <div className="mt-1 space-y-0.5 font-semibold text-[11px]">
                  {vehicle.odometer >= vehicle.nextOilChangeKM && (
                    <p className="text-amber-700">
                      ⚠️ Quá hạn thay dầu:{" "}
                      <span className="underline font-mono">
                        {oilOverKM.toLocaleString()} KM
                      </span>{" "}
                      (GPS đo)
                    </p>
                  )}
                  {vehicle.tireKM >= 50000 && (
                    <p className="text-red-600">
                      ❌ Bộ lốp mòn nguy hiểm:{" "}
                      <span className="font-mono">
                        {vehicle.tireKM.toLocaleString()} / 50.000 KM
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

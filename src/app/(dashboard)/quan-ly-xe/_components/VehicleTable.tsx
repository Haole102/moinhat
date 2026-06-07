"use client";

import { useState } from "react";
import { useVehicleQuery } from "@/hooks/useVehicleQuery";
import { Vehicle } from "@/lib/services/vehicle.service";
import ModalApproveRepair from "./ModalApproveRepair";
import { toast } from "sonner";

export default function VehicleTable({
  initialData,
}: {
  initialData: Vehicle[];
}) {
  const { data: vehicles, isLoading } = useVehicleQuery(initialData);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  if (isLoading && !vehicles?.length) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 font-bold animate-pulse">
        Đang đồng bộ dữ liệu đội xe...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs md:text-sm text-left text-slate-600">
        <thead className="text-[11px] text-slate-700 uppercase bg-slate-50 border-b border-slate-200 font-bold">
          <tr>
            <th className="px-4 py-3.5">Biển Số Xe</th>
            <th className="px-4 py-3.5">Tài xế đang lái</th>
            <th className="px-4 py-3.5">Trạng thái</th>
            <th className="px-4 py-3.5">Định vị GPS (Odometer)</th>
            <th className="px-4 py-3.5 text-center">Hành động nhanh</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-4 py-4">
                  <p className="font-extrabold text-blue-600 tracking-wide">
                    {vehicle.plateNumber}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {vehicle.model} • {vehicle.type}
                  </p>
                </td>
                <td className="px-4 py-4 text-slate-900 font-semibold">
                  {vehicle.driverName}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      vehicle.status === "on_road"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : vehicle.status === "waiting"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {vehicle.status === "on_road"
                      ? "Đang chạy"
                      : vehicle.status === "waiting"
                        ? "Nằm bãi chờ"
                        : "Đang xưởng"}
                  </span>
                </td>
                <td className="px-4 py-4 font-mono text-slate-900 font-bold">
                  {vehicle.odometer.toLocaleString()} KM
                  <span className="block text-[10px] text-slate-400 font-sans font-medium mt-0.5">
                    Hạn dầu: {vehicle.nextOilChangeKM.toLocaleString()} KM
                  </span>
                </td>

                {/* CỘT HÀNH ĐỘNG ĐÃ ĐƯỢC FIX LỖI CÚ PHÁP VÀ THÊM ONCLICK */}
                <td className="p-4 text-sm font-medium flex justify-center">
                  {vehicle.hasPendingRepair ? (
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors animate-pulse-slow"
                    >
                      ✨ Duyệt chi phí
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        toast.info(
                          "Đang mở lịch sử bảo trì xe (Tính năng đang phát triển)...",
                        )
                      }
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                    >
                      Lịch sử sửa chữa
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                Không tìm thấy xe nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* GỌI MODAL DUYỆT CHI PHÍ (MỚI) */}
      {selectedVehicle && (
        <ModalApproveRepair
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}

// src/app/(dashboard)/quan-ly-xe/canh-bao-dinh-vi/_components/MaintenanceAlertList.tsx
"use client";

import { useState } from "react";
import { useVehicleQuery } from "@/hooks/useVehicleQuery";
import { Vehicle } from "@/lib/services/vehicle.service";
import ModalCreateMaintenanceOrder from "./ModalCreateMaintenanceOrder";

interface MaintenanceAlertListProps {
  initialVehicles: Vehicle[];
}

// Kiểu dữ liệu của một thẻ cảnh báo sau khi phân tích
interface AlertCard {
  vehicle: Vehicle;
  level: "red" | "yellow";
  reasons: string[];
  suggestedCategory: "oil" | "tire";
}

export default function MaintenanceAlertList({
  initialVehicles,
}: MaintenanceAlertListProps) {
  const { data: vehicles } = useVehicleQuery(initialVehicles);

  // State lưu xe đang được chọn để mở modal
  const [selectedAlert, setSelectedAlert] = useState<AlertCard | null>(null);

  /*
   * PHÂN TÍCH TỪNG XE — tạo AlertCard nếu xe cần cảnh báo
   *
   * Logic phân loại:
   *   🔴 ĐỎ: odometer >= nextOilChangeKM  HOẶC  tireKM >= 50000
   *   🟡 VÀNG: còn <= 500 KM nữa chạm nextOilChangeKM (chưa đỏ)
   */
  const alertCards: AlertCard[] = (vehicles || []).reduce<AlertCard[]>(
    (acc, vehicle) => {
      const reasons: string[] = [];
      let level: "red" | "yellow" | null = null;
      let suggestedCategory: "oil" | "tire" = "oil";

      const oilOverdue = vehicle.odometer >= vehicle.nextOilChangeKM;
      const tireOverdue = vehicle.tireKM >= 50000;
      const kmLeft = vehicle.nextOilChangeKM - vehicle.odometer;
      const oilSoon = !oilOverdue && kmLeft <= 500 && kmLeft > 0;

      if (oilOverdue) {
        level = "red";
        const overKM = vehicle.odometer - vehicle.nextOilChangeKM;
        reasons.push(`Quá hạn thay dầu ${overKM.toLocaleString()} KM (GPS đo)`);
        suggestedCategory = "oil";
      }

      if (tireOverdue) {
        level = "red";
        reasons.push(
          `Lốp đã chạy ${vehicle.tireKM.toLocaleString()} / 50.000 KM — nguy hiểm`,
        );
        suggestedCategory = "tire";
      }

      if (oilSoon && level === null) {
        level = "yellow";
        reasons.push(`Còn ${kmLeft.toLocaleString()} KM nữa đến hạn thay dầu`);
        suggestedCategory = "oil";
      }

      if (level !== null) {
        acc.push({ vehicle, level, reasons, suggestedCategory });
      }

      return acc;
    },
    [],
  );

  // Sắp xếp: đỏ lên trước, vàng xuống sau
  const sorted = [...alertCards].sort((a, b) => {
    if (a.level === "red" && b.level === "yellow") return -1;
    if (a.level === "yellow" && b.level === "red") return 1;
    return 0;
  });

  const redCards = sorted.filter((c) => c.level === "red");
  const yellowCards = sorted.filter((c) => c.level === "yellow");

  // Không có cảnh báo nào → hiện trạng thái xanh
  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-3xl mb-3">✅</p>
        <p className="font-bold text-slate-700">
          Toàn bộ đội xe đang trong ngưỡng an toàn
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Không có xe nào cần bảo dưỡng trong thời điểm hiện tại.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* NHÓM ĐỎ */}
        {redCards.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider">
                Cảnh báo Đỏ — Quá hạn ({redCards.length} xe)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redCards.map((card) => (
                <AlertCardItem
                  key={card.vehicle.id}
                  card={card}
                  onAction={() => setSelectedAlert(card)}
                />
              ))}
            </div>
          </div>
        )}

        {/* NHÓM VÀNG */}
        {yellowCards.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
              <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wider">
                Cảnh báo Vàng — Sắp đến hạn ({yellowCards.length} xe)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yellowCards.map((card) => (
                <AlertCardItem
                  key={card.vehicle.id}
                  card={card}
                  onAction={() => setSelectedAlert(card)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL tạo lệnh bảo dưỡng */}
      {selectedAlert && (
        <ModalCreateMaintenanceOrder
          vehicle={selectedAlert.vehicle}
          suggestedCategory={selectedAlert.suggestedCategory}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </>
  );
}

// -------------------------------------------------------
// Sub-component: Thẻ cảnh báo từng xe
// Tách ra để MaintenanceAlertList không bị quá dài
// -------------------------------------------------------
function AlertCardItem({
  card,
  onAction,
}: {
  card: AlertCard;
  onAction: () => void;
}) {
  const { vehicle, level, reasons } = card;

  const isRed = level === "red";

  // Tính % thanh tiến trình dầu
  const oilProgressPercent = Math.min(
    (vehicle.odometer / vehicle.nextOilChangeKM) * 100,
    100,
  );
  // Tính % thanh tiến trình lốp
  const tireProgressPercent = Math.min((vehicle.tireKM / 50000) * 100, 100);

  return (
    <div
      className={`bg-white rounded-xl border shadow-xs overflow-hidden ${
        isRed ? "border-red-200" : "border-amber-200"
      }`}
    >
      {/* Header thẻ */}
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          isRed ? "bg-red-50/70" : "bg-amber-50/70"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isRed ? "bg-red-500" : "bg-amber-400"
            }`}
          />
          <div>
            <p className="font-extrabold text-slate-900 text-sm">
              {vehicle.plateNumber}
            </p>
            <p className="text-[11px] text-slate-500">
              {vehicle.model} • Tài xế: {vehicle.driverName}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${
            isRed
              ? "bg-red-100 text-red-700 border-red-200"
              : "bg-amber-100 text-amber-700 border-amber-200"
          }`}
        >
          {isRed ? "Quá hạn" : "Sắp hạn"}
        </span>
      </div>

      {/* Nội dung thẻ */}
      <div className="px-4 py-3 space-y-3">
        {/* Danh sách lý do cảnh báo */}
        <ul className="space-y-1">
          {reasons.map((reason, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-xs text-slate-600"
            >
              <span
                className={`mt-0.5 shrink-0 ${isRed ? "text-red-500" : "text-amber-500"}`}
              >
                {isRed ? "●" : "◐"}
              </span>
              {reason}
            </li>
          ))}
        </ul>

        {/* Thanh tiến trình dầu */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Dầu máy</span>
            <span className="font-mono">
              {vehicle.odometer.toLocaleString()} /{" "}
              {vehicle.nextOilChangeKM.toLocaleString()} KM
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${oilProgressPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                oilProgressPercent >= 100 ? "bg-red-500" : "bg-blue-400"
              }`}
            />
          </div>
        </div>

        {/* Thanh tiến trình lốp */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Độ mòn lốp</span>
            <span className="font-mono">
              {vehicle.tireKM.toLocaleString()} / 50.000 KM
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${tireProgressPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                tireProgressPercent >= 100 ? "bg-red-500" : "bg-amber-400"
              }`}
            />
          </div>
        </div>

        {/* Nút hành động */}
        <button
          onClick={onAction}
          className={`w-full mt-1 py-2 text-xs font-bold rounded-lg transition-all ${
            isRed
              ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
              : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
          }`}
        >
          🔧 Tạo lệnh bảo dưỡng ngay
        </button>
      </div>
    </div>
  );
}

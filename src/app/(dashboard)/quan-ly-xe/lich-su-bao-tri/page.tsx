// src/app/(dashboard)/quan-ly-xe/lich-su-bao-tri/page.tsx

import { vehicleService } from "@/lib/services/vehicle.service";
import MaintenanceHistoryTable from "./_components/MaintenanceHistoryTable";
import FraudAlertWidget from "./_components/FraudAlertWidget";

export const dynamic = "force-dynamic";

export default async function LichSuBaoTriPage() {
  // SERVER PATH: Fetch cả hai nguồn dữ liệu song song để tăng tốc
  // Promise.all = chạy đồng thời, không chờ nhau tuần tự
  const [initialExpenses, initialVehicles] = await Promise.all([
    vehicleService.getExpenses(),
    vehicleService.getVehicles(),
  ]);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Lịch sử Bảo trì
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Toàn bộ hồ sơ chi phí sửa chữa — minh bạch từng đồng, chống gian lận
          tài xế.
        </p>
      </div>

      {/*
        FraudAlertWidget nhận toàn bộ expenses để tự tính toán bất thường.
        Đặt trước bảng để người dùng thấy cảnh báo ngay khi vào trang.
      */}
      <FraudAlertWidget initialExpenses={initialExpenses} />

      {/*
        MaintenanceHistoryTable nhận cả expenses lẫn vehicles.
        vehicles dùng để build dropdown filter "Biển số xe".
      */}
      <MaintenanceHistoryTable
        initialExpenses={initialExpenses}
        initialVehicles={initialVehicles}
      />
    </div>
  );
}

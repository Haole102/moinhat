import { vehicleService, Vehicle } from "@/lib/services/vehicle.service";
import VehicleTable from "./_components/VehicleTable";
import ModalAddVehicle from "./_components/ModalAddVehicle";
import { cookies } from "next/headers";
import { COOKIES, MOCK_TENANTS } from "@/lib/constants";

// Ép trang luôn render động theo từng request (Phục vụ việc phân tách dữ liệu Tenant liên tục)
export const dynamic = "force-dynamic";

export default async function QuanLyXePage() {
  // SERVER PATH: Đọc dữ liệu thô lần đầu
  // FIX: Thêm ": Vehicle[]" để TypeScript hiểu đây là mảng chứa thông tin xe
  let initialVehicles: Vehicle[] = [];
  const cookieStore = await cookies();
  const viewingTenantId =
    cookieStore.get(COOKIES.VIEWING_TENANT_ID)?.value || MOCK_TENANTS[0].id;

  try {
    initialVehicles = await vehicleService.getVehicles(viewingTenantId);
  } catch (error) {
    console.error("Lỗi SSR fetch vehicles:", error);
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Khai báo Đội xe
          </h1>
        </div>
        <ModalAddVehicle />
      </div>

      {/* Ranh giới truyền dữ liệu (Data Boundary) sang Client Component */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Lỗi đỏ đã được giải quyết do initialVehicles đã đúng kiểu Vehicle[] */}
        <VehicleTable initialData={initialVehicles} />
      </div>
    </div>
  );
}

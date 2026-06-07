export type VehicleStatus = "on_road" | "waiting" | "maintenance";
export type ExpenseCategory = "oil" | "tire" | "engine" | "rescue";
export type ExpenseStatus = "pending" | "approved";

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  type: string;
  status: VehicleStatus;
  driverName: string;
  odometer: number; // Đồng bộ tự động từ thiết bị định vị GPS (Thời gian thực)
  lastOilChangeKM: number;
  nextOilChangeKM: number; // Ngưỡng định vị GPS kích hoạt cảnh báo thay dầu
  tireKM: number; // Số KM lốp hiện tại đã chạy
  tenantId: string;
  hasPendingRepair?: boolean;
}

export interface MaintenanceExpense {
  id: string;
  vehicleId: string;
  plateNumber: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receiptImage: string; // Chuỗi Base64 hoặc URL ảnh chụp trực tiếp từ Camera
  status: ExpenseStatus; // Workflow kiểm duyệt dòng tiền
  createdAt: string;
  tenantId: string;
}

// TUẦN 4: Chuyển thành false để kết nối thẳng tới Postgres/API của Quân
const IS_MOCK = true;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Khởi tạo Mock Data trong RAM bộ nhớ tạm thời
let mockVehicles: Vehicle[] = [
  {
    id: "v1",
    plateNumber: "29A-123.45",
    model: "Hyundai Mighty 2024",
    type: "Tải",
    status: "on_road",
    driverName: "Nguyễn Văn Hùng",
    odometer: 42500,
    lastOilChangeKM: 35000,
    nextOilChangeKM: 42000,
    tireKM: 52000,
    tenantId: "tenant_123",
  },
  {
    id: "v2",
    plateNumber: "30E-678.90",
    model: "Hino 500 Series",
    type: "Đầu Kéo",
    status: "waiting",
    driverName: "Trần Quốc Toản",
    odometer: 18200,
    lastOilChangeKM: 15000,
    nextOilChangeKM: 25000,
    tireKM: 18200,
    tenantId: "tenant_123",
  },
  {
    id: "v3",
    plateNumber: "15C-443.12",
    model: "Isuzu Forward N-Series",
    type: "Tải",
    status: "maintenance",
    driverName: "Lê Hoàng Long",
    odometer: 89000,
    lastOilChangeKM: 84000,
    nextOilChangeKM: 90000,
    tireKM: 31000,
    tenantId: "tenant_123",
    hasPendingRepair: true,
  },
];

let mockExpenses: MaintenanceExpense[] = [
  // --- Tháng 6/2026 ---
  {
    id: "e1",
    vehicleId: "v1",
    plateNumber: "29A-123.45",
    category: "oil",
    amount: 1200000,
    description: "Thay nhớt máy định kỳ đầu tháng",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-06-01T08:30:00.000Z",
    tenantId: "tenant_123",
  },
  {
    id: "e2",
    vehicleId: "v3",
    plateNumber: "15C-443.12",
    category: "engine",
    amount: 8500000,
    description: "Bảo dưỡng hệ thống tăng áp lốc máy",
    receiptImage: "mock_base64_image_data",
    status: "pending",
    createdAt: "2026-06-05T14:20:00.000Z",
    tenantId: "tenant_123",
  },
  {
    // ⚠️ FRAUD SIGNAL: v1 thay lốp lần 1 trong tháng 6
    id: "e3",
    vehicleId: "v1",
    plateNumber: "29A-123.45",
    category: "tire",
    amount: 4800000,
    description: "Thay 2 lốp trước do mòn không đều",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-06-10T09:00:00.000Z",
    tenantId: "tenant_123",
  },
  {
    // ⚠️ FRAUD SIGNAL: v1 thay lốp lần 2 trong tháng 6 — trigger cảnh báo bất thường
    id: "e4",
    vehicleId: "v1",
    plateNumber: "29A-123.45",
    category: "tire",
    amount: 5200000,
    description: "Thay 2 lốp sau, tài xế báo nổ lốp trên QL5",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-06-18T16:45:00.000Z",
    tenantId: "tenant_123",
  },
  {
    id: "e5",
    vehicleId: "v2",
    plateNumber: "30E-678.90",
    category: "rescue",
    amount: 3500000,
    description: "Cứu hộ xe bị chết máy trên cao tốc Hà Nội - Hải Phòng",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-06-20T21:10:00.000Z",
    tenantId: "tenant_123",
  },
  // --- Tháng 5/2026 ---
  {
    id: "e6",
    vehicleId: "v2",
    plateNumber: "30E-678.90",
    category: "oil",
    amount: 1350000,
    description: "Thay nhớt hộp số và nhớt cầu sau",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-05-12T10:20:00.000Z",
    tenantId: "tenant_123",
  },
  {
    id: "e7",
    vehicleId: "v3",
    plateNumber: "15C-443.12",
    category: "tire",
    amount: 2600000,
    description: "Thay lốp dự phòng bị thủng do đinh",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-05-28T07:55:00.000Z",
    tenantId: "tenant_123",
  },
  // --- Tháng 4/2026 ---
  {
    id: "e8",
    vehicleId: "v1",
    plateNumber: "29A-123.45",
    category: "engine",
    amount: 12000000,
    description: "Đại tu hệ thống nhiên liệu, thay kim phun",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-04-15T13:00:00.000Z",
    tenantId: "tenant_123",
  },
];

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return [...mockVehicles];
    }
    const res = await fetch(`${API_BASE_URL}/api/vehicles`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Không thể lấy danh sách xe");
    return res.json();
  },

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const newVehicle: Vehicle = {
        id: `v_${Math.random().toString(36).substring(2, 9)}`,
        plateNumber: data.plateNumber || "N/A",
        model: data.model || "N/A",
        type: data.type || "Tải",
        status: data.status || "waiting",
        driverName: data.driverName || "Chưa bàn giao",
        odometer: data.odometer || 0,
        lastOilChangeKM: data.odometer || 0,
        nextOilChangeKM: (data.odometer || 0) + 7000, // Tự động thiết lập chu kỳ thay dầu sau 7,000 KM
        tireKM: 0,
        tenantId: "tenant_123",
      };
      mockVehicles = [newVehicle, ...mockVehicles];
      return newVehicle;
    }
    const res = await fetch(`${API_BASE_URL}/api/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getExpenses(): Promise<MaintenanceExpense[]> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...mockExpenses];
    }
    const res = await fetch(`${API_BASE_URL}/api/expenses`, {
      cache: "no-store",
    });
    return res.json();
  },

  async createExpense(
    data: Partial<MaintenanceExpense>,
  ): Promise<MaintenanceExpense> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const targetVehicle = mockVehicles.find((v) => v.id === data.vehicleId);
      const newExpense: MaintenanceExpense = {
        id: `e_${Math.random().toString(36).substring(2, 9)}`,
        vehicleId: data.vehicleId || "",
        plateNumber: targetVehicle ? targetVehicle.plateNumber : "N/A",
        category: data.category || "oil",
        amount: data.amount || 0,
        description: data.description || "",
        receiptImage: data.receiptImage || "",
        status: "pending", // Ép buộc rơi vào trạng thái Chờ duyệt phòng chống gian lận
        createdAt: new Date().toISOString(),
        tenantId: "tenant_123",
      };
      mockExpenses = [newExpense, ...mockExpenses];
      return newExpense;
    }
    const res = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async approveExpense(expenseId: string): Promise<MaintenanceExpense> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const expenseIndex = mockExpenses.findIndex((e) => e.id === expenseId);
      if (expenseIndex !== -1) {
        mockExpenses[expenseIndex].status = "approved";
        // Đồng thời nếu chi phí liên quan đến thay lốp hoặc dầu -> cập nhật thông số GPS xe ngầm
        const exp = mockExpenses[expenseIndex];
        const vIndex = mockVehicles.findIndex((v) => v.id === exp.vehicleId);
        if (vIndex !== -1) {
          if (exp.category === "oil") {
            mockVehicles[vIndex].lastOilChangeKM =
              mockVehicles[vIndex].odometer;
            mockVehicles[vIndex].nextOilChangeKM =
              mockVehicles[vIndex].odometer + 7000;
          } else if (exp.category === "tire") {
            mockVehicles[vIndex].tireKM = 0;
          }
        }
        return mockExpenses[expenseIndex];
      }
      throw new Error("Không tìm thấy bản ghi chi phí");
    }
    const res = await fetch(
      `${API_BASE_URL}/api/expenses/${expenseId}/approve`,
      { method: "PATCH" },
    );
    return res.json();
  },
};

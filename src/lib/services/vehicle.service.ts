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
  odometer: number;
  lastOilChangeKM: number;
  nextOilChangeKM: number;
  tireKM: number;
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
  receiptImage: string;
  status: ExpenseStatus;
  createdAt: string;
  tenantId: string;
}

const IS_MOCK = true;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let mockVehicles: Vehicle[] = [
  // ---- TENANT 123: Công ty Acme ----
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

  // ---- TENANT 456: Logistics Toàn Cầu ----
  {
    id: "v4",
    plateNumber: "51A-555.67",
    model: "Volvo FH16",
    type: "Đầu Kéo",
    status: "on_road",
    driverName: "Phạm Minh Tuấn",
    odometer: 125000,
    lastOilChangeKM: 120000,
    nextOilChangeKM: 127000,
    tireKM: 38000,
    tenantId: "tenant_456",
  },
  {
    id: "v5",
    plateNumber: "43B-888.99",
    model: "Thaco Auman C160",
    type: "Tải",
    status: "waiting",
    driverName: "Vũ Đình Khải",
    odometer: 67400,
    lastOilChangeKM: 63000,
    nextOilChangeKM: 70000,
    tireKM: 67400,
    tenantId: "tenant_456",
  },
  {
    id: "v6",
    plateNumber: "72C-321.00",
    model: "Mercedes Actros",
    type: "Đầu Kéo",
    status: "on_road",
    driverName: "Bùi Thanh Sơn",
    odometer: 203000,
    lastOilChangeKM: 199000,
    nextOilChangeKM: 206000,
    tireKM: 12000,
    tenantId: "tenant_456",
  },

  // ---- TENANT 789: Xây dựng Vin-Group ----
  {
    id: "v7",
    plateNumber: "92C-111.22",
    model: "Kia K250",
    type: "Tải",
    status: "maintenance",
    driverName: "Đặng Quốc Việt",
    odometer: 31000,
    lastOilChangeKM: 28000,
    nextOilChangeKM: 35000,
    tireKM: 31000,
    tenantId: "tenant_789",
    hasPendingRepair: true,
  },
  {
    id: "v8",
    plateNumber: "88D-777.33",
    model: "Hyundai HD320",
    type: "Bồn",
    status: "on_road",
    driverName: "Ngô Thế Anh",
    odometer: 54200,
    lastOilChangeKM: 50000,
    nextOilChangeKM: 54000,
    tireKM: 54200,
    tenantId: "tenant_789",
  },
];

let mockExpenses: MaintenanceExpense[] = [
  // ---- TENANT 123 ----
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

  // ---- TENANT 456 ----
  {
    id: "e9",
    vehicleId: "v4",
    plateNumber: "51A-555.67",
    category: "oil",
    amount: 2800000,
    description: "Thay nhớt động cơ Volvo FH16 định kỳ 7,000 KM",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-06-03T07:00:00.000Z",
    tenantId: "tenant_456",
  },
  {
    id: "e10",
    vehicleId: "v5",
    plateNumber: "43B-888.99",
    category: "tire",
    amount: 9600000,
    description: "Thay 4 lốp toàn bộ cầu trước",
    receiptImage: "mock_base64_image_data",
    status: "pending",
    createdAt: "2026-06-22T11:30:00.000Z",
    tenantId: "tenant_456",
  },

  // ---- TENANT 789 ----
  {
    id: "e11",
    vehicleId: "v7",
    plateNumber: "92C-111.22",
    category: "engine",
    amount: 6500000,
    description: "Thay gioăng máy bị rò rỉ nhớt",
    receiptImage: "mock_base64_image_data",
    status: "pending",
    createdAt: "2026-06-19T15:00:00.000Z",
    tenantId: "tenant_789",
  },
  {
    id: "e12",
    vehicleId: "v8",
    plateNumber: "88D-777.33",
    category: "oil",
    amount: 1500000,
    description: "Thay nhớt máy + lọc nhớt HD320",
    receiptImage: "mock_base64_image_data",
    status: "approved",
    createdAt: "2026-06-08T08:45:00.000Z",
    tenantId: "tenant_789",
  },
];

export const vehicleService = {
  // tenantId là optional — nếu không truyền thì trả về tất cả (dùng cho Super Admin xem tổng)
  async getVehicles(tenantId?: string): Promise<Vehicle[]> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      if (tenantId) {
        return mockVehicles.filter((v) => v.tenantId === tenantId);
      }
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
        nextOilChangeKM: (data.odometer || 0) + 7000,
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

  async getExpenses(tenantId?: string): Promise<MaintenanceExpense[]> {
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      if (tenantId) {
        return mockExpenses.filter((e) => e.tenantId === tenantId);
      }
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
        status: "pending",
        createdAt: new Date().toISOString(),
        tenantId: targetVehicle?.tenantId || "tenant_123",
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

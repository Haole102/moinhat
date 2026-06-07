export const COOKIES = {
  AUTH_TOKEN: "auth_token",
  USER_ROLE: "user_role",
  TENANT_ID: "tenant_id",
  VIEWING_TENANT_ID: "viewing_tenant_id", // NEW: tenant SA đang xem
};

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  TENANT: "tenant_customer",
};

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/quan-ly-xe",
  HOME: "/",
};

// Danh sách tenant mock — sau này load từ DB
export const MOCK_TENANTS = [
  { id: "tenant_123", name: "Công ty Acme", emoji: "🏢" },
  { id: "tenant_456", name: "Logistics Toàn Cầu", emoji: "🚚" },
  { id: "tenant_789", name: "Xây dựng Vin-Group", emoji: "🏗️" },
];

// src/app/(dashboard)/quan-ly-xe/lich-su-bao-tri/_components/FraudAlertWidget.tsx
"use client";

import { useExpenseQuery } from "@/hooks/useVehicleQuery";
import { MaintenanceExpense } from "@/lib/services/vehicle.service";

interface FraudAlertWidgetProps {
  initialExpenses: MaintenanceExpense[];
}

interface FraudCase {
  plateNumber: string;
  category: string;
  monthLabel: string;
  count: number;
  totalAmount: number;
}

// Nhãn hiển thị cho từng loại category
const CATEGORY_LABEL: Record<string, string> = {
  oil: "thay nhớt",
  tire: "thay lốp",
  engine: "sửa động cơ",
  rescue: "cứu hộ",
};

export default function FraudAlertWidget({
  initialExpenses,
}: FraudAlertWidgetProps) {
  const { data: expenses } = useExpenseQuery(initialExpenses);

  /*
   * THUẬT TOÁN PHÁT HIỆN BẤT THƯỜNG:
   * Điều kiện: cùng 1 xe + cùng 1 loại chi phí + >= 2 lần trong cùng tháng
   *
   * Cách làm: Group expenses theo key = "plateNumber|category|YYYY-MM"
   * Nếu một key có count >= 2 → đánh dấu là bất thường
   */
  const fraudCases: FraudCase[] = (() => {
    if (!expenses) return [];

    // Bước 1: Tạo một Map để đếm và cộng dồn theo key
    const groupMap = new Map<
      string,
      {
        count: number;
        totalAmount: number;
        plateNumber: string;
        category: string;
        monthLabel: string;
      }
    >();

    expenses.forEach((exp) => {
      const date = new Date(exp.createdAt);
      // Key = "biển số|loại|năm-tháng", ví dụ: "29A-123.45|tire|2026-06"
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const groupKey = `${exp.plateNumber}|${exp.category}|${monthKey}`;

      const existing = groupMap.get(groupKey);
      if (existing) {
        existing.count += 1;
        existing.totalAmount += exp.amount;
      } else {
        groupMap.set(groupKey, {
          count: 1,
          totalAmount: exp.amount,
          plateNumber: exp.plateNumber,
          category: exp.category,
          // Định dạng lại thành "Tháng 6/2026" cho dễ đọc
          monthLabel: date.toLocaleDateString("vi-VN", {
            month: "long",
            year: "numeric",
          }),
        });
      }
    });

    // Bước 2: Lọc ra các nhóm có count >= 2 (bất thường)
    return Array.from(groupMap.values()).filter((g) => g.count >= 2);
  })();

  // Nếu không có bất thường nào → không render widget này
  if (fraudCases.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
      {/* Header cảnh báo */}
      <div className="px-5 py-3.5 bg-red-100/70 border-b border-red-200 flex items-center gap-2.5">
        <span className="text-base">🚨</span>
        <div>
          <h3 className="font-bold text-red-800 text-sm">
            Phát hiện Chi phí Bất thường ({fraudCases.length} trường hợp)
          </h3>
          <p className="text-[11px] text-red-600 mt-0.5">
            Cùng một xe báo cùng loại hỏng hóc từ 2 lần trở lên trong một tháng
            — cần xác minh lại hóa đơn.
          </p>
        </div>
      </div>

      {/* Danh sách các trường hợp bất thường */}
      <div className="divide-y divide-red-100">
        {fraudCases.map((fc, index) => (
          <div
            key={index}
            className="px-5 py-3.5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              {/* Icon cảnh báo */}
              <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center shrink-0">
                <span className="text-sm">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {fc.plateNumber}
                  <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full border border-red-200 uppercase">
                    {CATEGORY_LABEL[fc.category] || fc.category}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Báo hỏng{" "}
                  <strong className="text-red-600">{fc.count} lần</strong> trong{" "}
                  {fc.monthLabel} — vượt mức trung bình đội xe
                </p>
              </div>
            </div>

            {/* Tổng tiền đã chi cho trường hợp này */}
            <div className="text-right shrink-0">
              <p className="text-sm font-extrabold text-red-600">
                {fc.totalAmount.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-[10px] text-slate-400">Tổng chi phí</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

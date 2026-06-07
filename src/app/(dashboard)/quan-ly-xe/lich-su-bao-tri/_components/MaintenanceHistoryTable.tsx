// src/app/(dashboard)/quan-ly-xe/lich-su-bao-tri/_components/MaintenanceHistoryTable.tsx
"use client";

import { useState, useMemo } from "react";
import { useExpenseQuery } from "@/hooks/useVehicleQuery";
import { useVehicleQuery } from "@/hooks/useVehicleQuery";
import { MaintenanceExpense, Vehicle } from "@/lib/services/vehicle.service";

interface MaintenanceHistoryTableProps {
  initialExpenses: MaintenanceExpense[];
  initialVehicles: Vehicle[];
}

const CATEGORY_LABEL: Record<string, string> = {
  oil: "Thay nhớt",
  tire: "Thay lốp",
  engine: "Sửa động cơ",
  rescue: "Cứu hộ",
};

const CATEGORY_STYLE: Record<string, string> = {
  oil: "bg-blue-50 text-blue-700 border-blue-200",
  tire: "bg-amber-50 text-amber-700 border-amber-200",
  engine: "bg-purple-50 text-purple-700 border-purple-200",
  rescue: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function MaintenanceHistoryTable({
  initialExpenses,
  initialVehicles,
}: MaintenanceHistoryTableProps) {
  const { data: expenses } = useExpenseQuery(initialExpenses);
  const { data: vehicles } = useVehicleQuery(initialVehicles);

  // --- STATE CỦA BỘ LỌC ---
  const [filterPlate, setFilterPlate] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [viewingReceiptId, setViewingReceiptId] = useState<string | null>(null);

  /*
   * Tạo danh sách tháng động từ chính data thực tế.
   * useMemo để không tính lại mỗi lần render, chỉ tính lại khi expenses thay đổi.
   */
  const availableMonths = useMemo(() => {
    if (!expenses) return [];
    const monthSet = new Set<string>();
    expenses.forEach((exp) => {
      const date = new Date(exp.createdAt);
      monthSet.add(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      );
    });
    // Sắp xếp mới nhất lên trước
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  /*
   * ÁP DỤNG BỘ LỌC:
   * useMemo để filteredExpenses chỉ được tính lại khi expenses hoặc
   * một trong các filter thay đổi — không re-calculate khi UI render vì lý do khác.
   */
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter((exp) => {
      // Lọc theo biển số
      if (filterPlate !== "all" && exp.plateNumber !== filterPlate)
        return false;

      // Lọc theo loại chi phí
      if (filterCategory !== "all" && exp.category !== filterCategory)
        return false;

      // Lọc theo tháng
      if (filterMonth !== "all") {
        const date = new Date(exp.createdAt);
        const expMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (expMonth !== filterMonth) return false;
      }

      return true;
    });
  }, [expenses, filterPlate, filterCategory, filterMonth]);

  // Tổng tiền của các dòng đang hiển thị (sau khi lọc)
  const totalFiltered = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* PHẦN BỘ LỌC */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row gap-3">
        {/* Dropdown: Biển số xe */}
        <select
          value={filterPlate}
          onChange={(e) => setFilterPlate(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả xe</option>
          {vehicles?.map((v) => (
            <option key={v.id} value={v.plateNumber}>
              {v.plateNumber} — {v.model}
            </option>
          ))}
        </select>

        {/* Dropdown: Loại chi phí */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả loại</option>
          <option value="oil">Thay nhớt</option>
          <option value="tire">Thay lốp</option>
          <option value="engine">Sửa động cơ</option>
          <option value="rescue">Cứu hộ</option>
        </select>

        {/* Dropdown: Tháng — tự động từ data */}
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả tháng</option>
          {availableMonths.map((m) => {
            const [year, month] = m.split("-");
            return (
              <option key={m} value={m}>
                Tháng {parseInt(month)}/{year}
              </option>
            );
          })}
        </select>
      </div>

      {/* THANH TÓM TẮT KẾT QUẢ LỌC */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Hiển thị{" "}
          <strong className="text-slate-800">{filteredExpenses.length}</strong>{" "}
          / {expenses?.length || 0} hồ sơ
        </p>
        <p className="text-xs font-bold text-slate-700">
          Tổng:{" "}
          <span className="text-red-600">
            {totalFiltered.toLocaleString("vi-VN")} đ
          </span>
        </p>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-left text-slate-600">
          <thead className="text-[11px] text-slate-700 uppercase bg-slate-50 border-b border-slate-200 font-bold">
            <tr>
              <th className="px-4 py-3.5">Ngày tháng</th>
              <th className="px-4 py-3.5">Biển số xe</th>
              <th className="px-4 py-3.5">Loại chi phí</th>
              <th className="px-4 py-3.5">Nội dung</th>
              <th className="px-4 py-3.5 text-right">Số tiền</th>
              <th className="px-4 py-3.5 text-center">Trạng thái</th>
              <th className="px-4 py-3.5 text-center">Hóa đơn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Ngày tháng */}
                  <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                    {new Date(exp.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {new Date(exp.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>

                  {/* Biển số */}
                  <td className="px-4 py-3.5">
                    <span className="font-extrabold text-blue-600 tracking-wide">
                      {exp.plateNumber}
                    </span>
                  </td>

                  {/* Loại chi phí */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${CATEGORY_STYLE[exp.category]}`}
                    >
                      {CATEGORY_LABEL[exp.category] || exp.category}
                    </span>
                  </td>

                  {/* Nội dung mô tả */}
                  <td className="px-4 py-3.5 text-slate-600 max-w-[200px]">
                    <p className="truncate" title={exp.description}>
                      {exp.description}
                    </p>
                  </td>

                  {/* Số tiền */}
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {exp.amount.toLocaleString("vi-VN")} đ
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3.5 text-center">
                    {exp.status === "approved" ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đã duyệt
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Chờ duyệt
                      </span>
                    )}
                  </td>

                  {/* Nút xem hóa đơn */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => setViewingReceiptId(exp.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      📎 Xem
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-400 text-xs"
                >
                  Không có hồ sơ nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL XEM HÓA ĐƠN (inline, không cần tách file vì nhỏ) */}
      {viewingReceiptId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={() => setViewingReceiptId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Ảnh hóa đơn hiện trường
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gửi từ Zalo Mini App của tài xế
                </p>
              </div>
              <button
                onClick={() => setViewingReceiptId(null)}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <div className="w-full h-48 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="text-3xl">📸</span>
                <p className="text-xs font-medium">Ảnh chụp hóa đơn từ Zalo</p>
                <p className="text-[10px] text-slate-300">
                  (Sẽ hiển thị ảnh thật khi Zalo OCR pipeline hoạt động)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

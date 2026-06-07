"use client";

import { useState } from "react";
import { useVehicleMutation } from "@/hooks/useVehicleMutation";
import { toast } from "sonner";

export default function ModalAddVehicle() {
  const [isOpen, setIsOpen] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("Tải");
  const [driverName, setDriverName] = useState("");
  const [odometer, setOdometer] = useState("");

  const mutation = useVehicleMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !model || !driverName || !odometer) {
      toast.error("Vui lòng điền đầy đủ các trường thông tin xe!");
      return;
    }

    mutation.mutate(
      {
        plateNumber,
        model,
        type,
        driverName,
        odometer: Number(odometer),
        status: "waiting",
      },
      {
        onSuccess: () => {
          setPlateNumber("");
          setModel("");
          setDriverName("");
          setOdometer("");
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md shadow-blue-500/10 transition-all active:scale-95"
      >
        ✨ Thêm Xe Vào Hệ Thống
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-950 text-sm">
                Khai báo phương tiện mới
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl text-slate-400"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Biển kiểm soát *
                  </label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="Ví dụ: 29A-999.99"
                    className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Dòng xe (Model) *
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ví dụ: Hino 300"
                    className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tài xế nhận bàn giao xe *
                </label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Họ và tên tài xế phụ trách lái..."
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Số KM ban đầu (GPS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    placeholder="Nhập Odometer hiện tại..."
                    className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Loại hình phương tiện
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm bg-white font-semibold"
                  >
                    <option value="Tải">Xe Tải</option>
                    <option value="Đầu Kéo">Xe Đầu Kéo</option>
                    <option value="Bồn">Xe Bồn</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold bg-slate-50 hover:bg-slate-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-5 py-2 text-white bg-blue-600 font-bold rounded-lg shadow-sm"
                >
                  {mutation.isPending ? "Đang đồng bộ..." : "Khai báo xe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

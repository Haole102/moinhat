"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Trip {
  trip_id: string;
  vehicle_id: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  route_origin: string;
  route_dest: string;
  status: string;
  total_bot_fee: number;
}

interface OrphanedLog {
  log_id: string;
  license_plate: string;
  transaction_time: string;
  station_name: string;
  amount: number;
}

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

export default function VETCPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [orphanedLogs, setOrphanedLogs] = useState<OrphanedLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
      const [tripsRes, orphanedRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/v1/trips`),
        fetch(`${apiBaseUrl}/api/v1/vetc/orphaned`)
      ]);
      
      const tripsData = await tripsRes.json();
      const orphanedData = await orphanedRes.json();
      
      if (tripsData.success) setTrips(tripsData.data || []);
      if (orphanedData.success) setOrphanedLogs(orphanedData.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu từ máy chủ");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Định dạng file không hợp lệ. Vui lòng tải lên file Excel (.xlsx, .xls)!");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Đang xử lý file ${file.name}...`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/v1/upload-vetc`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Đối soát thành công!", { id: toastId });
        // Refresh data after successful upload
        await fetchData();
      } else {
        toast.error(result.detail || "Có lỗi xảy ra khi xử lý file", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến máy chủ", { id: toastId });
      console.error(error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đối soát VETC</h1>
          <p className="text-slate-500 mt-1">
            Tải lên file Excel từ VETC để hệ thống tự động khớp chi phí vào chuyến xe.
          </p>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoadingData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Khu vực Upload */}
      <div className="mb-10">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-slate-400 bg-white"
          } ${isUploading ? "opacity-70 pointer-events-none" : ""}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            ) : (
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-slate-600" />
              </div>
            )}
            
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {isUploading ? "Đang xử lý dữ liệu..." : "Kéo thả file Excel vào đây"}
            </h3>
            <p className="text-sm text-slate-500">
              hoặc click để chọn file từ máy tính
            </p>
          </div>
        </div>
      </div>

      {/* Hiển thị Dữ liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bảng Chuyến đi (Trips) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Chuyến xe đã khớp phí</h3>
            <span className="ml-auto bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {trips.length} chuyến
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Biển số</th>
                  <th className="px-6 py-3 font-medium">Tuyến đường</th>
                  <th className="px-6 py-3 font-medium">Phí BOT</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingData ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Chưa có chuyến xe nào
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.trip_id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{trip.vehicle_id}</td>
                      <td className="px-6 py-4 text-slate-600">{trip.route_origin} - {trip.route_dest}</td>
                      <td className="px-6 py-4 font-medium text-emerald-600">
                        {trip.total_bot_fee.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bảng Orphaned Logs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-red-50/50 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-800">Giao dịch treo (Không khớp)</h3>
            <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {orphanedLogs.length} GD
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Biển số</th>
                  <th className="px-6 py-3 font-medium">Thời gian</th>
                  <th className="px-6 py-3 font-medium">Phí</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingData ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : orphanedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Không có giao dịch treo nào
                    </td>
                  </tr>
                ) : (
                  orphanedLogs.map((log) => (
                    <tr key={log.log_id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{log.license_plate}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(log.transaction_time).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 font-medium text-red-600">
                        {log.amount.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

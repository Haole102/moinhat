"use client";

interface MainHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function MainHeader({ isCollapsed, onToggle }: MainHeaderProps) {
  return (
    <header className="h-12 border-b border-slate-200 bg-white flex items-center px-6 shrink-0 shadow-sm z-10">
      <button
        onClick={onToggle}
        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors flex items-center justify-center cursor-pointer"
        title={isCollapsed ? "Mở thanh thực đơn" : "Ẩn thanh thực đơn"}
      >
        {/* Mũi tên tự động đổi hướng chỉ (xoay 180 độ) mượt mà dựa theo trạng thái ẩn/hiện */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
    </header>
  );
}

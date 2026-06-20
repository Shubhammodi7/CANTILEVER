import React from "react";
import { RiAlertFill, RiCloseLine } from "react-icons/ri";

const ConfirmDelete = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure? This action cannot be undone.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-end p-6 sm:p-8 pointer-events-none">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 p-5 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-300">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-50 text-red-600 rounded-full flex-shrink-0">
            <RiAlertFill className="text-xl" />
          </div>

          <div className="flex-1 min-w-0 mt-0.5">
            <h3 className="text-sm font-black text-black uppercase tracking-wider">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-black transition-colors p-1 -mr-2 -mt-2"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-black hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors active:scale-95"
          >
            Yes, Delete it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;

import { useEffect, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";

let toastCount = 0;
const observers = new Set();

export function showToast(message, type = "info") {
  const id = ++toastCount;
  const toast = { id, message, type };
  observers.forEach((callback) => callback(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const addToast = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };

    observers.add(addToast);
    return () => observers.delete(addToast);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right-5 duration-300 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : toast.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <XCircle size={18} />}
          {toast.type === "warning" && <TriangleAlert size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

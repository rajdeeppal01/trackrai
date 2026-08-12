import { X } from "lucide-react";

export default function ApplicationModal({
 open,
 onClose,
 children,
}) {
 if (!open) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
 <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

 <button
 onClick={onClose}
 className="absolute right-5 top-5"
 >
 <X size={22} />
 </button>

 {children}

 </div>
 </div>
 );
}
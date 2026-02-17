import { FaDumbbell } from "react-icons/fa";

export default function ServiceCard({ title, icon: Icon = FaDumbbell }) {
  return (
    <div className="bg-[#1f1f1f] rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition">
      
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
        <Icon className="text-xl" />
      </div>

      {/* Content */}
      <div className="text-left">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-xs text-gray-400 mt-1 leading-snug">
          High-energy training sessions
        </p>
      </div>
    </div>
  );
}

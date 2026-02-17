export default function Card({ children }) {
  return (
    <div className="bg-[#1f1f1f] rounded-2xl p-6 hover:scale-105 transition">
      {children}
    </div>
  );
}

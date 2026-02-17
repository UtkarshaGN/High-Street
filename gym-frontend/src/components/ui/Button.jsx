export default function Button({ children, variant = "primary" }) {
  const styles =
    variant === "primary"
      ? "bg-accent text-black"
      : "border border-white text-white";

  return (
    <button
      className={`${styles} px-6 py-3 rounded-full font-semibold hover:scale-105 transition`}
    >
      {children}
    </button>
  );
}
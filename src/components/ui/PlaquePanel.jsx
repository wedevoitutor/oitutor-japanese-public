export default function PlaquePanel({ children, index = 0, className = '', as = 'div' }) {
  const Component = as;

  return (
    <Component
      className={`card-entrance relative bg-[#fbf7ec] shadow-md border border-[#d9cfbb] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${className}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {children}
    </Component>
  );
}

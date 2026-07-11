export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1216px] ${className}`}>
      {children}
    </div>
  );
}

'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'fab' | 'ghost';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const baseStyles = "transition-all active:scale-95 flex items-center justify-center gap-2 font-bold";
  
  const variants = {
    primary: "bg-[#b76dff] text-white px-8 py-3 rounded-xl neon-purple-glow hover:scale-105",
    fab: "fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#ddb7ff] to-[#fbabff] rounded-full shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-110",
    ghost: "text-slate-400 hover:text-purple-300 hover:bg-white/5 px-4 py-2 rounded-lg"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

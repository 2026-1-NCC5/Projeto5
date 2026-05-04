'use client';

interface SelectProps {
  options: string[];
  active: string;
  onSelect: (val: string) => void;
}

export default function PillSelect({ options, active, onSelect }: SelectProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <span className="text-xs font-bold text-slate-500 uppercase px-2">Filtrar:</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border ${
            active === opt 
            ? "bg-[#ae05c6]/20 text-[#fbabff] border-[#fbabff]/30" 
            : "bg-slate-800 text-slate-400 border-white/10 hover:bg-white/5"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
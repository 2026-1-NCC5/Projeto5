'use client';

interface CardProps {
  title: string;
  accuracy: string;
  image: string;
  id: string;
}

export default function Card({ title, accuracy, image, id }: CardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-[#fbabff]/50 transition-all duration-300 relative">
      <div className="h-40 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16111b] to-transparent"></div>
        <div className="absolute top-4 right-4 bg-[#ae05c6] px-3 py-1 rounded-full text-[10px] font-bold text-[#ffd8fd] neon-magenta-glow">
          {accuracy} ACURÁCIA
        </div>
        {/* Cantos do Scanner */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#ddb7ff]"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#eadfed]">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">ID: {id}</p>
        <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ddb7ff] to-[#fbabff]" style={{ width: '85%' }}></div>
        </div>
      </div>
    </div>
  );
}
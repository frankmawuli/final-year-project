import { User, Pencil } from "lucide-react";

export function ProfileAvatar({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative mx-auto w-24 h-24">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User className="w-12 h-12 text-primary-foreground" strokeWidth={1.5} />
        )}
      </div>
      <button
        type="button"
        aria-label="Edit photo"
        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center text-primary-foreground"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

import {Image} from "../../shared/types/image.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

interface ImageCardProps {
  img: Image;
  isSelected: boolean;
  onToggle: () => void;
}

export function ImageCard({ img, isSelected, onToggle }: ImageCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:border-primary/50'
      }`}
    >
      <div
        className={`absolute top-2 left-2 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <Checkbox
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={onToggle}
        />
      </div>
      <img
        src={`thumb://${img.id}.jpg`}
        alt={img.filename}
        className="w-full h-32 object-cover bg-muted"
        loading="lazy"
      />
      <div className="p-2 text-xs truncate bg-background/90 absolute bottom-0 w-full">
        {img.filename}
      </div>
    </div>
  );
}

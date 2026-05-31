import { memo } from 'react';
import { Image } from "../../shared/types/image.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon } from "@hugeicons/core-free-icons";

interface ImageCardProps {
  img: Image;
  isSelected: boolean;
  onToggle: (img: Image) => void;
  loaded: boolean;
}

export const ImageCard = memo(function ImageCard({ img, isSelected, onToggle, loaded }: ImageCardProps) {
  const canAttemptLoad = img.fromCache || loaded;

  return (
    <div
      onClick={() => onToggle(img)}
      className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:border-primary/50'
      }`}
    >
      <div
        className={`absolute top-2 left-2 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <Checkbox
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={() => onToggle(img)}
        />
      </div>

      {canAttemptLoad ? (
        <img
          src={`thumb://${img.id}.jpg`}
          alt={img.filename}
          className="w-full h-32 object-cover bg-muted"
        />
      ) : (
        <div className="w-full h-32 bg-muted flex items-center justify-center">
          <HugeiconsIcon icon={Image01Icon} className="w-8 h-8 text-muted-foreground animate-pulse" />
        </div>
      )}

      <div className="p-2 text-xs truncate bg-background/90 absolute bottom-0 w-full">
        {img.filename}
      </div>
    </div>
  );
});

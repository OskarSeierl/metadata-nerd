import {memo} from "react";
import {Image} from "../../../shared/types/image.ts";
import {ImageCard} from "@/components/library/ImageCard.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"; // Passe den Pfad an, falls noetig

type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
type SortDirection = 'asc' | 'desc';

interface ImageLibraryCardsProps {
  images: Image[];
  selectedImages: Set<Image>;
  loadedThumbnails: Set<string>;
  onToggleImage: (image: Image) => void;
  sortConfig: { key: SortKey; direction: SortDirection };
  onSortChange: (key: SortKey, direction: SortDirection) => void;
}

export const ImageLibraryCards = memo(function ImageLibraryCards({
                                                                   images,
                                                                   selectedImages,
                                                                   loadedThumbnails,
                                                                   onToggleImage,
                                                                   sortConfig,
                                                                   onSortChange
                                                                 }: ImageLibraryCardsProps) {

  const currentSortValue = `${sortConfig.key}-${sortConfig.direction}`;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-end items-center">
        <Select
          value={currentSortValue}
          onValueChange={(value) => {
            const [key, direction] = value.split('-');
            onSortChange(key as SortKey, direction as SortDirection);
          }}
        >
          <SelectTrigger className="w-45 h-9 bg-background">
            <SelectValue placeholder="Sortieren nach..."/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filename-asc">Name (A bis Z)</SelectItem>
            <SelectItem value="filename-desc">Name (Z bis A)</SelectItem>
            <SelectItem value="fileModificationTime-desc">Neueste zuerst</SelectItem>
            <SelectItem value="fileModificationTime-asc">Älteste zuerst</SelectItem>
            <SelectItem value="fullPath-asc">Pfad (A bis Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="grid gap-4"
        style={{gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'}}
      >
        {images.map((img) => (
          <ImageCard
            key={img.id}
            img={img}
            isSelected={selectedImages.has(img)}
            loaded={loadedThumbnails.has(img.id)}
            onToggle={onToggleImage}
          />
        ))}
      </div>
    </div>
  );
});

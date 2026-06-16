import {memo, useEffect, useRef, useState} from "react";
import {Image} from "../../../shared/types/image.ts";
import {ImageCard} from "@/components/library/ImageCard.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";

type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
type SortDirection = 'asc' | 'desc';

interface ImageLibraryCardsProps {
  images: Image[];
  selectedImages: Set<number>;
  loadedThumbnails: Set<number>;
  onToggleImage: (image: Image) => void;
  sortConfig: { key: SortKey; direction: SortDirection };
  onSortChange: (key: SortKey, direction: SortDirection) => void;
}

const MIN_CARD_WIDTH = 160;
const CARD_HEIGHT = 160;
const GAP = 16;

export const ImageLibraryCards = memo(function ImageLibraryCards({
                                                                   images,
                                                                   selectedImages,
                                                                   loadedThumbnails,
                                                                   onToggleImage,
                                                                   sortConfig,
                                                                   onSortChange,
                                                                 }: ImageLibraryCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [scrollRef]);

  // Math to figure out grid dimensions
  const columns = containerWidth > 0
    ? Math.max(1, Math.floor((containerWidth + GAP) / (MIN_CARD_WIDTH + GAP)))
    : 1;

  const rowCount = Math.ceil(images.length / columns);

  // Setup Virtualizer for ROWS (not individual cards)
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 3,
  });

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

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className="relative w-full"
          style={{height: `${rowVirtualizer.getTotalSize()}px`}}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className="absolute top-0 left-0 w-full grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                transform: `translateY(${virtualRow.start}px)`,
                height: `${CARD_HEIGHT}px`,
              }}
            >
              {Array.from({length: columns}).map((_, colIndex) => {
                const imageIndex = virtualRow.index * columns + colIndex;
                const img = images[imageIndex];

                if (!img) return <div key={`empty-${colIndex}`}/>;

                return (
                  <ImageCard
                    key={img.id}
                    img={img}
                    isSelected={selectedImages.has(img.id)}
                    loaded={loadedThumbnails.has(img.id)}
                    onToggle={onToggleImage}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

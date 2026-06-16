import {memo, useRef} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell} from "@/components/ui/table.tsx";
import {ImageTableRow} from "@/components/library/ImageTableRow.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowDown10, ArrowUp10, ArrowUpDown} from "@hugeicons/core-free-icons";
import {Image} from "../../../shared/types/image.ts";
import {useVirtualizer} from "@tanstack/react-virtual";

type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
type SortDirection = 'asc' | 'desc';

interface ImageLibraryTableProps {
  images: Image[];
  selectedImages: Set<number>;
  sortConfig: { key: SortKey; direction: SortDirection };
  onSort: (key: SortKey) => void;
  onToggleImage: (image: Image) => void;
}

export const ImageLibraryTable = memo(function ImageLibraryTable({
                                                                   images,
                                                                   selectedImages,
                                                                   sortConfig,
                                                                   onSort,
                                                                   onToggleImage
                                                                 }: ImageLibraryTableProps) {

  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: images.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0
    ? rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0)
    : 0;

  const renderSortableHeader = (label: string, key: SortKey) => {
    return (
      <Button
        variant="ghost"
        onClick={() => onSort(key)}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        <span>{label}</span>
        {sortConfig.key === key ? (
          sortConfig.direction === 'asc' ? (
            <HugeiconsIcon icon={ArrowUp10} className="ml-2 h-4 w-4"/>
          ) : (
            <HugeiconsIcon icon={ArrowDown10} className="ml-2 h-4 w-4"/>
          )
        ) : (
          <HugeiconsIcon icon={ArrowUpDown} className="ml-2 h-4 w-4 text-muted-foreground/50"/>
        )}
      </Button>
    );
  };

  return (
    <div ref={scrollRef} className="border rounded-md overflow-y-auto h-full relative">
      <Table className="w-full table-fixed">
        {/* sticky top-0 hält die Header beim Scrollen oben */}
        <TableHeader className="top-0 z-10 bg-background shadow-sm">
          <TableRow>
            <TableHead className="w-12.5"></TableHead>
            <TableHead className="w-[30%]">{renderSortableHeader('Name', 'filename')}</TableHead>
            <TableHead className="w-[50%]">{renderSortableHeader('Path', 'fullPath')}</TableHead>
            <TableHead
              className="w-[20%] text-right">{renderSortableHeader('Changed at', 'fileModificationTime')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {paddingTop > 0 && (
            <TableRow className="border-none hover:bg-transparent">
              <TableCell style={{height: `${paddingTop}px`}} className="p-0 border-none" colSpan={4}/>
            </TableRow>
          )}

          {virtualItems.map((virtualRow) => {
            const img = images[virtualRow.index];
            if (!img) return null; // Safety Check

            return (
              <ImageTableRow
                key={img.id}
                img={img}
                isSelected={selectedImages.has(img.id)}
                onToggle={onToggleImage}
              />
            );
          })}

          {paddingBottom > 0 && (
            <TableRow className="border-none hover:bg-transparent">
              <TableCell style={{height: `${paddingBottom}px`}} className="p-0 border-none" colSpan={4}/>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});

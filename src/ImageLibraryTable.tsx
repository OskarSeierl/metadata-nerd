import {memo} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {ImageTableRow} from "@/components/ImageTableRow.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowDown10, ArrowUp10, ArrowUpDown} from "@hugeicons/core-free-icons";
import {Image} from "../shared/types/image.ts";

type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
type SortDirection = 'asc' | 'desc';

interface ImageLibraryTableProps {
  images: Image[];
  selectedImages: Set<Image>;
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
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12.5"></TableHead>
            <TableHead>{renderSortableHeader('Name', 'filename')}</TableHead>
            <TableHead>{renderSortableHeader('Path', 'fullPath')}</TableHead>
            <TableHead className="text-right">{renderSortableHeader('Changed at', 'fileModificationTime')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map((img) => (
            <ImageTableRow
              key={img.id}
              img={img}
              isSelected={selectedImages.has(img)}
              onToggle={onToggleImage}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

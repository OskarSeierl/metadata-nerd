import { memo } from 'react';
import { Image } from "../../../shared/types/image.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {TableCell, TableRow} from "@/components/ui/table.tsx";

interface ImageTableRowProps {
  img: Image;
  isSelected: boolean;
  onToggle: (img: Image) => void;
}

export const ImageTableRow = memo(function ImageCard({ img, isSelected, onToggle }: ImageTableRowProps) {
  return (
    <TableRow
      key={img.id}
      data-state={isSelected ? "selected" : undefined}
      onClick={() => onToggle(img)}
      className="cursor-pointer h-[50px]"
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(img)}
        />
      </TableCell>
      <TableCell className="font-medium">{img.filename}</TableCell>
      <TableCell className="text-muted-foreground text-xs truncate max-w-[300px]" title={img.fullPath}>
        {img.fullPath}
      </TableCell>
      <TableCell className="text-right text-sm">
        {new Date(img.fileModificationTime).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
});

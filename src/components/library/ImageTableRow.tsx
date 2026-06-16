import { memo } from 'react';
import { Image } from "../../../shared/types/image.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import {formatDate} from "../../../shared/utils/time.ts";

interface ImageTableRowProps {
  img: Image;
  isSelected: boolean;
  onToggle: (img: Image) => void;
}

export const ImageTableRow = memo(function ImageTableRow({ img, isSelected, onToggle }: ImageTableRowProps) {
  return (
    <TableRow
      key={img.id}
      data-state={isSelected ? "selected" : undefined}
      onClick={() => onToggle(img)}
      className="cursor-pointer h-12.5 w-full overflow-y-auto"
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(img)}
        />
      </TableCell>

      <TableCell className="font-medium truncate max-w-0" title={img.filename}>
        {img.filename}
      </TableCell>

      <TableCell className="text-muted-foreground text-xs truncate max-w-0" title={img.fullPath}>
        {img.fullPath}
      </TableCell>

      <TableCell className="text-right text-xs text-muted-foreground font-mono">
        {formatDate(new Date(img.fileModificationTime))}
      </TableCell>
    </TableRow>
  );
});

import {memo} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {
  Clock01Icon,
  GridViewIcon,
  ListViewIcon,
  MinusSignCircleIcon
} from "@hugeicons/core-free-icons";
import {ViewMode} from "@/components/ImageLibrary.tsx";

interface ImageLibraryToolbarProps {
  selectedCount: number;
  totalCount: number;
  onToggleSelectAll: (checked: boolean) => void;
  filters: string[];
  onFiltersChange: (filters: string[]) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ImageLibraryToolbar = memo(function ImageLibraryToolbar({
                                                                       selectedCount,
                                                                       totalCount,
                                                                       onToggleSelectAll,
                                                                       filters,
                                                                       onFiltersChange,
                                                                       viewMode,
                                                                       onViewModeChange
                                                                     }: ImageLibraryToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-muted/30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 pl-2">
          <Checkbox
            checked={selectedCount === totalCount && totalCount > 0}
            onCheckedChange={onToggleSelectAll}
          />
          <span className="font-medium">
            {selectedCount}/{totalCount} ausgewählt
          </span>
        </div>

        <ToggleGroup type="multiple" value={filters} onValueChange={onFiltersChange} className="border rounded-md px-1">
          <ToggleGroupItem value="no-location" aria-label="Ohne GPS" title="Bilder ohne GPS anzeigen">
            <HugeiconsIcon icon={MinusSignCircleIcon} className="h-4 w-4 mr-2"/>
            <span className="text-xs">Ohne GPS</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="no-time" aria-label="Ohne Zeitstempel" title="Bilder ohne Zeitstempel anzeigen">
            <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 mr-2"/>
            <span className="text-xs">Ohne Zeit</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* The v && condition prevents the user from deselecting the active view mode */}
      <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && onViewModeChange(v as ViewMode)}>
        <ToggleGroupItem value="grid" aria-label="Grid Ansicht">
          <HugeiconsIcon icon={GridViewIcon} className="h-4 w-4"/>
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Listen Ansicht">
          <HugeiconsIcon icon={ListViewIcon} className="h-4 w-4"/>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
});

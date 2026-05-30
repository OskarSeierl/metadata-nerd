import {useState, useMemo, useEffect} from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  GridViewIcon,
  ListViewIcon,
  Clock01Icon,
  ArrowUpDownIcon,
  ArrowUp01Icon,
  MinusSignCircleIcon,
  ArrowDown01Icon
} from '@hugeicons/core-free-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {Image} from "../../shared/types/image.ts";
import {ImageCard} from "@/components/ImageCard.tsx";

interface ImageLibraryProps {
  images: Image[];
  onSelectedChange: (selectedImageIds: Image[]) => void;
}

type ViewMode = 'grid' | 'table';
type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
type SortDirection = 'asc' | 'desc';

export function ImageLibrary({ images, onSelectedChange }: ImageLibraryProps) {
  const [selectedImages, setSelectedImages] = useState<Set<Image>>(new Set());

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'filename',
    direction: 'asc'
  });

  useEffect(() => {
    onSelectedChange(Array.from(selectedImages));
  }, [selectedImages]);

  // --- Logic: Selection ---
  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(new Set(images));
    } else {
      setSelectedImages(new Set());
    }
  };

  const handleToggleImage = (image: Image) => {
    const newSelected = new Set(selectedImages);
    if (selectedImages.has(image)) {
      newSelected.delete(image);
    } else {
      newSelected.add(image);
    }
    setSelectedImages(newSelected);
  };

  // --- Logic: Sorting ---
  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // --- Logic: Filter & Sort Pipeline ---
  const processedImages = useMemo(() => {
    // 1. Filtern
    let result = images.filter(img => {
      if (filters.includes('no-location') && img.metadata?.latitude) return false;
      if (filters.includes('no-time') && img.metadata?.DateTimeOriginal) return false;
      return true;
    });

    // 2. Sortieren
    result.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [images, filters, sortConfig]);

  // --- Hilfsfunktion für Tabellen-Header ---
  const renderSortableHeader = (label: string, key: SortKey) => {
    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(key)}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        <span>{label}</span>
        {sortConfig.key === key ? (
          sortConfig.direction === 'asc' ? (
            <HugeiconsIcon icon={ArrowUp01Icon} className="ml-2 h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={ArrowDown01Icon} className="ml-2 h-4 w-4" />
          )
        ) : (
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4 text-muted-foreground/50" />
        )}
      </Button>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 pl-2">
            <Checkbox
              checked={selectedImages.size === images.length && images.length > 0}
              onCheckedChange={handleToggleSelectAll}
            />
            <span className="font-medium">
              {selectedImages.size} ausgewählt
            </span>
          </div>

          <ToggleGroup type="multiple" value={filters} onValueChange={setFilters} className="border rounded-md px-1">
            <ToggleGroupItem value="no-location" aria-label="Ohne GPS" title="Bilder ohne GPS anzeigen">
              <HugeiconsIcon icon={MinusSignCircleIcon} className="h-4 w-4 mr-2" />
              <span className="text-xs">Ohne GPS</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="no-time" aria-label="Ohne Zeitstempel" title="Bilder ohne Zeitstempel anzeigen">
              <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 mr-2" />
              <span className="text-xs">Ohne Zeit</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)}>
          <ToggleGroupItem value="grid" aria-label="Grid Ansicht">
            <HugeiconsIcon icon={GridViewIcon} className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Listen Ansicht">
            <HugeiconsIcon icon={ListViewIcon} className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 pt-0">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {processedImages.map(img => (
              <ImageCard
                key={img.id}
                img={img}
                isSelected={selectedImages.has(img)}
                onToggle={() => handleToggleImage(img)}
              />
            ))}
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>{renderSortableHeader('Name', 'filename')}</TableHead>
                  <TableHead>{renderSortableHeader('Pfad', 'fullPath')}</TableHead>
                  <TableHead className="text-right">{renderSortableHeader('Geändert am', 'fileModificationTime')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedImages.map(img => {
                  const isSelected = selectedImages.has(img);
                  return (
                    <TableRow
                      key={img.id}
                      data-state={isSelected ? "selected" : undefined}
                      onClick={() => handleToggleImage(img)}
                      className="cursor-pointer"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleImage(img)}
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
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

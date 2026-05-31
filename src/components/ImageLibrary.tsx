import {useCallback, useEffect, useMemo, useState} from "react";
import {Image} from "../../shared/types/image.ts";
import {ImageLibraryToolbar} from "@/components/ImageLibraryToolbar.tsx";
import {ImageLibraryCards} from "@/components/ImageLibraryCards.tsx";
import {ImageLibraryTable} from "@/ImageLibraryTable.tsx";

interface ImageLibraryProps {
  images: Image[];
  onSelectedChange: (selectedImageIds: Image[]) => void;
}

export type ViewMode = 'grid' | 'table';
export type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
export type SortDirection = 'asc' | 'desc';

export function ImageLibrary({images, onSelectedChange}: ImageLibraryProps) {
  const [selectedImages, setSelectedImages] = useState<Set<Image>>(new Set());

  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<string>>(new Set());

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [filters, setFilters] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'filename',
    direction: 'asc'
  });

  useEffect(() => {
    const cleanup = window.electron?.folder?.onThumbnailReady?.((readyId: string) => {
      setLoadedThumbnails(current => new Set(current).add(readyId));
    });
    return cleanup;
  }, []);

  useEffect(() => {
    onSelectedChange(Array.from(selectedImages));
  }, [selectedImages, onSelectedChange]);

  const handleToggleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedImages(new Set(images));
    } else {
      setSelectedImages(new Set());
    }
  }, [images]);

  const handleToggleImage = useCallback((image: Image) => {
    setSelectedImages((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(image)) {
        newSelected.delete(image);
      } else {
        newSelected.add(image);
      }
      return newSelected;
    });
  }, []);

  const handleSortChange = useCallback((key: SortKey, explicitDirection?: SortDirection) => {
    setSortConfig(current => ({
      key,
      direction: explicitDirection
        ? explicitDirection
        : (current.key === key && current.direction === 'asc' ? 'desc' : 'asc')
    }));
  }, []);

  // --- Data Pipeline ---
  const processedImages = useMemo(() => {
    let result = images.filter(img => {
      if (filters.includes('no-location') && img.metadata?.gpsAltitude) return false;
      if (filters.includes('no-time') && img.metadata?.dateTime) return false;
      return true;
    });

    result.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [images, filters, sortConfig]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <ImageLibraryToolbar
        selectedCount={selectedImages.size}
        totalCount={processedImages.length}
        onToggleSelectAll={handleToggleSelectAll}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex-1 overflow-auto p-4 pt-0">
        {viewMode === 'grid' ? (
          <ImageLibraryCards
            images={processedImages}
            selectedImages={selectedImages}
            loadedThumbnails={loadedThumbnails}
            onToggleImage={handleToggleImage}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        ) : (
          <ImageLibraryTable
            images={processedImages}
            selectedImages={selectedImages}
            sortConfig={sortConfig}
            onSort={handleSortChange}
            onToggleImage={handleToggleImage}
          />
        )}
      </div>
    </div>
  );
}

import {useCallback, useEffect, useMemo, useState} from "react";
import {Image} from "../../../shared/types/image.ts";
import {ImageLibraryToolbar} from "@/components/library/ImageLibraryToolbar.tsx";
import {ImageLibraryCards} from "@/components/library/ImageLibraryCards.tsx";
import {ImageLibraryTable} from "@/components/library/ImageLibraryTable.tsx";
import {ImageFilter, SortDirection, SortKey, ViewMode} from "@/types/image-library.ts";

interface ImageLibraryProps {
  images: Image[];
  selectedImages: Set<number>;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleImage: (image: Image) => void;
  onCloseFolder: () => void;
}

export function ImageLibrary({images, selectedImages, onToggleSelectAll, onToggleImage, onCloseFolder}: ImageLibraryProps) {
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<number>>(new Set());

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [filters, setFilters] = useState<ImageFilter[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'filename',
    direction: 'asc'
  });

  useEffect(() => {
    const cleanup = window.electron?.file?.onThumbnailReady?.((readyId: number) => {
      setLoadedThumbnails(current => new Set(current).add(readyId));
    });
    return cleanup;
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
    const result = images.filter(img => {
      return !(
        filters.includes(ImageFilter.NO_LOCATION) && img.metadata?.GPSLatitude
        || filters.includes(ImageFilter.NO_TIME) && img.metadata?.DateTimeOriginal
      );
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
    <div className="flex flex-col h-full space-y-4 overflow-hidden">
      <ImageLibraryToolbar
        selectedCount={selectedImages.size}
        totalCount={processedImages.length}
        onToggleSelectAll={onToggleSelectAll}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCloseFolder={onCloseFolder}
      />

      <div className="flex-1 p-4 pt-0 min-h-0">
        {viewMode === 'grid' ? (
          <ImageLibraryCards
            images={processedImages}
            selectedImages={selectedImages}
            loadedThumbnails={loadedThumbnails}
            onToggleImage={onToggleImage}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        ) : (
          <ImageLibraryTable
            images={processedImages}
            selectedImages={selectedImages}
            sortConfig={sortConfig}
            onSort={handleSortChange}
            onToggleImage={onToggleImage}
          />
        )}
      </div>
    </div>
  );
}



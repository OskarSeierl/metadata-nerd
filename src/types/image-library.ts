import {Image} from "../../shared/types/image.ts";

export enum ImageFilter {
  NO_LOCATION = "no_location",
  NO_TIME = "no_time"
}

export type ViewMode = 'grid' | 'table';
export type SortKey = keyof Pick<Image, 'filename' | 'fullPath' | 'fileModificationTime'>;
export type SortDirection = 'asc' | 'desc';

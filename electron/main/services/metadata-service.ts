import {Image, ImageMetadata} from "../../../shared/types/image.ts";

export const updateMetadataOfImages = async (metadata: ImageMetadata, images: Image[]): Promise<Image[]> => {
  console.log(metadata, images);
  return [];
}

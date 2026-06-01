import {protocol} from "electron";
import {promises as fs} from "fs";
import {getThumbnailPathFromFilename} from "../services/thumbnail-service.ts";

export const registerThumbnailHandler = () => {
  protocol.handle('thumb', async (request) => {
    const fileName = request.url.slice('thumb://'.length);
    const thumbPath = getThumbnailPathFromFilename(fileName);

    try {
      const buffer = await fs.readFile(thumbPath);
      return new Response(buffer, {
        headers: { 'Content-Type': 'image/jpeg' },
      });
    } catch (error) {
      console.error('Error serving thumbnail:', error);
      return new Response('Not Found', { status: 404 });
    }
  });
}

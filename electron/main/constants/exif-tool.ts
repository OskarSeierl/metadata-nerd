import { ExifTool } from "exiftool-vendored";
import path from "node:path";
import {APP_ROOT, VITE_DEV_SERVER_URL} from "./constants.ts";

export const DEFAULT_WRITE_ARGS = [
  "-n", // Numeric mode
];

export const exiftool = new ExifTool({
  maxTasksPerProcess: 500,
  taskTimeoutMillis: 4000,
  spawnTimeoutMillis: 10000,

  maxProcs: 8,
  minDelayBetweenSpawnMillis: 0,
  streamFlushMillis: 10,

  useMWG: true,

  readArgs: [
    "-fast2",
    "--MakerNotes:all",
    "--ThumbnailImage",
    "--PreviewImage",
    "-n" // Numeric mode
  ],
  writeArgs: DEFAULT_WRITE_ARGS,

  exiftoolPath: () => {
    const isWin = process.platform === "win32";
    const suffix = isWin ? "exe" : "pl";
    const executableName = isWin ? "exiftool.exe" : "exiftool";

    if (VITE_DEV_SERVER_URL) {
      return path.join(
        APP_ROOT,
        "node_modules",
        `exiftool-vendored.${suffix}`,
        "bin",
        executableName,
      );
    } else {
      const resourcesPath = process.resourcesPath;
      return path.join(
        resourcesPath,
        "app.asar.unpacked",
        "node_modules",
        `exiftool-vendored.${suffix}`,
        "bin",
        executableName,
      );
    }
  },
});

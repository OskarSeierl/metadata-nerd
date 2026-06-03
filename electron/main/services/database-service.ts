import path from 'node:path';
import { app } from 'electron';
import { Image, ImageMetadata } from '../../../shared/types/image.ts';
import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export const clearAllData = () => {
  if(!db) {
    console.warn('Database not initialized, cannot clear data.');
    return;
  }

  // Clear the main table
  db.prepare('DELETE FROM image_cache').run();
}

export const initializeDatabase = (): Database.Database => {
  if (db) {
    return db;
  }

  // Store database in user data directory
  const dbPath = path.join(app.getPath('userData'), 'metadata-cache.db');

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS image_cache (
      id TEXT PRIMARY KEY,
      file_path TEXT UNIQUE NOT NULL,
      filename TEXT NOT NULL,
      file_mtime INTEGER NOT NULL,
      metadata TEXT,
      cached_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_file_path ON image_cache(file_path);
  `);

  return db;
}

export const getDatabase = (): Database.Database => {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}


export const getCachedImage = (filePath: string, currentMtime: number): Image | null => {
  const database = getDatabase();

  const stmt = database.prepare(`
    SELECT id, file_path, filename, metadata, cached_at, file_mtime
    FROM image_cache
    WHERE file_path = ?
  `);

  const row = stmt.get(filePath) as any;

  if (!row) {
    return null;
  }

  // If file modification time changed, cache is invalid
  if (row.file_mtime !== currentMtime) {
    return null;
  }

  return {
    id: row.id,
    fullPath: row.file_path,
    filename: row.filename,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
    fileModificationTime: row.file_mtime,
    cachedAt: row.cached_at,
    fromCache: true,
  };
}

export const saveCachedImage = (
  id: string,
  filePath: string,
  filename: string,
  metadata: ImageMetadata | null,
  mtime: number
): void => {
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO image_cache (id, file_path, filename, file_mtime, metadata, cached_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(file_path) DO UPDATE SET
      id = excluded.id,
      filename = excluded.filename,
      file_mtime = excluded.file_mtime,
      metadata = excluded.metadata,
      cached_at = excluded.cached_at
  `);

  const now = Math.floor(Date.now() / 1000);
  stmt.run(id, filePath, filename, mtime, JSON.stringify(metadata), now);
}

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
}






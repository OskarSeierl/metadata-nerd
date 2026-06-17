import path from 'node:path';
import {app} from 'electron';
import {Image, ImageMetadata} from '../../../shared/types/image.ts';
import Database from 'better-sqlite3';
import {ImageCacheService, ImageCacheRow} from "../types/image-cache.ts";

export class SQLiteImageCache implements ImageCacheService {
  private db: Database.Database | null = null;

  public initialize(): void {
    if (this.db) return;

    const dbPath = path.join(app.getPath('userData'), 'metadata-cache.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS image_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT UNIQUE NOT NULL,
        filename TEXT NOT NULL,
        file_mtime INTEGER NOT NULL,
        metadata TEXT,
        cached_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_file_path ON image_cache(file_path);
    `);
  }

  // A private helper to ensure DB is ready before queries
  private getDb(): Database.Database {
    if (!this.db) {
      this.initialize();
    }
    return this.db!;
  }

  public clearAllData(): void {
    if (!this.db) {
      console.warn('Database not initialized, cannot clear data.');
      return;
    }
    this.db.prepare('DELETE FROM image_cache').run();
  }

  public getCachedImage(filePath: string, currentMtime: number): Image | null {
    const database = this.getDb();

    const stmt = database.prepare(`
      SELECT id, file_path, filename, metadata, cached_at, file_mtime
      FROM image_cache
      WHERE file_path = ?
    `);

    // We cast it to our safe type instead of 'any'
    const row = stmt.get(filePath) as ImageCacheRow | undefined;

    if (!row || row.file_mtime !== currentMtime) {
      return null;
    }

    return {
      id: parseInt(row.id),
      fullPath: row.file_path,
      filename: row.filename,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      fileModificationTime: row.file_mtime,
      cachedAt: row.cached_at,
      fromCache: true,
    };
  }

  public saveCachedImage(
    filePath: string,
    filename: string,
    metadata: ImageMetadata,
    mtime: number
  ): number { // <-- 1. Change return type to number (or string if using UUIDs)
    const database = this.getDb();

    const stmt = database.prepare(`
      INSERT INTO image_cache (file_path, filename, file_mtime, metadata, cached_at)
      VALUES (?, ?, ?, ?, ?) -- <-- Fixed to 5 question marks
        ON CONFLICT(file_path) DO
      UPDATE SET
        filename = excluded.filename,
        file_mtime = excluded.file_mtime,
        metadata = excluded.metadata,
        cached_at = excluded.cached_at
        RETURNING id -- <-- 2. Tell SQLite to hand back the ID
    `);

    const now = Math.floor(Date.now() / 1000);

    const row = stmt.get(
      filePath,
      filename,
      mtime,
      metadata ? JSON.stringify(metadata) : null,
      now
    ) as { id: number };

    return row.id;
  }

  public updateCachedImage(id: number, filePath: string, filename: string, metadata: ImageMetadata | null, mtime: number): void {
    const database = this.getDb();

    const stmt = database.prepare(`
      UPDATE image_cache
      SET file_path = ?, filename = ?, file_mtime = ?, metadata = ?, cached_at = ?
      WHERE id = ?
    `);

    const now = Math.floor(Date.now() / 1000);

    stmt.run(
      filePath,
      filename,
      mtime,
      metadata ? JSON.stringify(metadata) : null,
      now,
      id
    );
  }

  public deleteCachedImage(filePath: string) {
    const database = this.getDb();

    const stmt = database.prepare(`
      DELETE
      FROM image_cache
      WHERE file_path = ?
    `);

    stmt.run(filePath);
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

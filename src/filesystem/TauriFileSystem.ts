import { IFileSystem, BaseDirectoryType } from "@/filesystem/IFileSystem"

import { exists, BaseDirectory, writeTextFile, readTextFile, writeBinaryFile, createDir, readBinaryFile, removeFile } from '@tauri-apps/api/fs'

/**
 * Remember to set the tauri.allowlist.fs in tauri.conf.json.
 * 
 * Notice "$APPDATA/" and "$APPDATA/*" are different scope.
 * If is "$APPDATA/*", TauriFileSystem.instance.exists("./") will throw a "path not in scope" error.
 */
export class TauriFileSystem implements IFileSystem {
    public static instance: TauriFileSystem = new TauriFileSystem()

    /**
     * Remove the last part of the path.
     * If it only contains the file name, return current dir
     */
    private baseDir(path: string): string {
        let index = path.lastIndexOf("/")
        if (index == -1) {
            return "./"
        }
        return path.substring(0, index)
    }

    async exists(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<boolean> {
        return exists(path, { dir: dir })
    }

    async writeTextFile(path: string, content: string, append: boolean = true, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        // If the path does not exists, writeTextFile will throw an error.
        let base_dir = this.baseDir(path)
        await this.createDirectory(base_dir, dir)
        return writeTextFile(path, content, { dir: dir })
    }

    async readTextFile(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<string> {
        return readTextFile(path, { dir: dir })
    }
 
    async writeBinaryFile(path: string, content: Uint8Array, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        // If the path does not exists, writeTextFile will throw an error.
        let base_dir = this.baseDir(path)
        await this.createDirectory(base_dir)
        return writeBinaryFile(path, content, { dir: dir })
    }

    async readBinaryFile(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<Uint8Array> {
        return readBinaryFile(path, { dir: dir })
    }

    async removeFile(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        return removeFile(path, { dir: dir })
    }

    async createDirectory(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        if (!await this.exists(path, dir)) {
            // create the directory if it does not exists
            return createDir(path, { dir: dir, recursive: true })
        }
        return Promise.resolve()
    }
}
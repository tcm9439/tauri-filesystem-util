import { IFileSystem, BaseDirectoryType } from "@/filesystem/IFileSystem"

import { exists, BaseDirectory, writeTextFile, readTextFile, writeBinaryFile, createDir, readBinaryFile, removeFile } from '@tauri-apps/api/fs'

export class TauriFileSystem implements IFileSystem {
    public static instance: TauriFileSystem = new TauriFileSystem()

    async exists(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<boolean> {
        return exists(path, { dir: dir })
    }

    async writeTextFile(path: string, content: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        // If the path does not exists, writeTextFile will throw an error.
        await this.createDirectory(path)
        return writeTextFile(path, content, { dir: dir })
    }

    async readTextFile(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<string> {
        return readTextFile(path, { dir: dir })
    }
 
    async writeBinaryFile(path: string, content: Uint8Array, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        // If the path does not exists, writeTextFile will throw an error.
        await this.createDirectory(path)
        return writeBinaryFile(path, content, { dir: dir })
    }

    async readBinaryFile(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<Uint8Array> {
        return readBinaryFile(path, { dir: dir })
    }

    async removeFile(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        return removeFile(path, { dir: dir })
    }

    async createDirectory(path: string, dir: BaseDirectoryType = BaseDirectory.AppData): Promise<void> {
        if (!await this.exists(path)) {
            // create the directory if it does not exists
            return createDir(path, { dir: dir, recursive: true })
        }
        return Promise.resolve()
    }
}
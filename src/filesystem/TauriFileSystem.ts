import { IFileSystem, BaseDirectoryType } from "@/filesystem/IFileSystem"

import { exists, BaseDirectory, writeTextFile, readTextFile, writeBinaryFile, createDir, readBinaryFile, removeFile } from '@tauri-apps/api/fs'

/**
 * Remember to set the tauri.allowlist.fs in tauri.conf.json.
 * 
 * Notice "$APPDATA/", "$APPDATA/*", "$APPDATA/**" are different scope.
 * "$APPDATA/": only allow $APPDATA
 * "$APPDATA/*": allow $APPDATA/abc.txt but not $APPDATA/abc/abc.txt
 * "$APPDATA/**": allow $APPDATA/abc.txt and $APPDATA/abc/abc.txt
 * 
 * In order to create $APPDAT itself,
 *  createDir("", { dir: dir, recursive: true })    # works
 *  createDir(".", { dir: dir, recursive: true })   # does not work
 *  createDir("./", { dir: dir, recursive: true })  # does not work
 * Same for other API.
 * 
 * The file path selected by user via the tauri dialog api will be added to scope directly. 
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
            return ""
        }
        return path.substring(0, index)
    }

    async exists(path: string, dir?: BaseDirectoryType): Promise<boolean> {
        if (dir !== undefined){
            return exists(path, { dir: dir })
        }
        return exists(path)
    }

    async writeTextFile(path: string, content: string, append: boolean = false, dir?: BaseDirectoryType): Promise<void> {
        // If the path does not exists, writeTextFile will throw an error.
        let base_dir = this.baseDir(path)
        await this.createDirectory(base_dir, dir)
        if (dir !== undefined){
            return writeTextFile(path, content, { dir: dir, append: append })
        }
        return writeTextFile(path, content, { append: append })
    }

    async readTextFile(path: string, dir?: BaseDirectoryType): Promise<string> {
        if (dir !== undefined){
            return readTextFile(path, { dir: dir })
        }
        return readTextFile(path)
    }
 
    async writeBinaryFile(path: string, content: Uint8Array, dir?: BaseDirectoryType): Promise<void> {
        // If the path does not exists, writeTextFile will throw an error.
        let base_dir = this.baseDir(path)
        await this.createDirectory(base_dir)
        if (dir !== undefined){
            return writeBinaryFile(path, content, { dir: dir })
        }
        return writeBinaryFile(path, content)
    }

    async readBinaryFile(path: string, dir?: BaseDirectoryType): Promise<Uint8Array> {
        if (dir !== undefined){
            return readBinaryFile(path, { dir: dir })
        }
        return readBinaryFile(path)
    }

    async removeFile(path: string, dir?: BaseDirectoryType): Promise<void> {
        if (dir !== undefined){
            return removeFile(path, { dir: dir })
        }
        return removeFile(path)
    }

    async createDirectory(path: string, dir?: BaseDirectoryType): Promise<void> {
        let exists = await this.exists(path, dir)
        if (!exists) {
            // create the directory if it does not exists
            if (dir !== undefined){
                return createDir(path, { dir: dir, recursive: true })
            }
            return createDir(path, { recursive: true })
        }
        return Promise.resolve()
    }
}
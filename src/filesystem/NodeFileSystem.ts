import { BaseDirectoryType, IFileSystem } from "@/filesystem/IFileSystem"
import fspromises from "fs/promises"
import fs from "fs"
import { BaseDirectory } from '@tauri-apps/api/fs'

export class NodeFileSystem implements IFileSystem {
    public static instance: NodeFileSystem = new NodeFileSystem()
    private static test_base_dir: string = "./test/"

    public static setTestBaseDir(dir: string) {
        NodeFileSystem.test_base_dir = dir
    }

    /**
     * Map the BaseDirectoryType + path to a full path
     */
    private mapDir(dir?: BaseDirectoryType, path?: string): string {
        if (path == undefined) {
            path = ""
        }
        
        switch (dir) {
            case BaseDirectory.AppData:
                return NodeFileSystem.test_base_dir + "appdata/" + path
            case BaseDirectory.AppCache:
                return NodeFileSystem.test_base_dir + "appcache/" + path
            case BaseDirectory.AppConfig:
                return NodeFileSystem.test_base_dir + "appconfig/" + path
            case BaseDirectory.AppConfig:
                return NodeFileSystem.test_base_dir + "appconfig/" + path
            default:
                return NodeFileSystem.test_base_dir + path
        }
    }

    async exists(path: string, dir?:BaseDirectoryType): Promise<boolean> {
        return fspromises.access(this.mapDir(dir, path), fs.constants.F_OK)
            .then(() => true)
            .catch(() => false)
    }

    async writeTextFile(path: string, content: string, append: boolean = true, dir?: BaseDirectoryType): Promise<void> {
        if (append) {
            return fspromises.appendFile(this.mapDir(dir, path), content, { encoding: 'utf8' })
        }
        return fspromises.writeFile(this.mapDir(dir, path), content, { encoding: 'utf8' })
    }

    async readTextFile(path: string, dir?: BaseDirectoryType): Promise<string> {
        if (await this.exists(path, dir)){
            return fspromises.readFile(this.mapDir(dir, path), { encoding: 'utf8' })
        }
        throw new Error("File not found")
    }

    async writeBinaryFile(path: string, content: Uint8Array, dir?: BaseDirectoryType): Promise<void> {
        return fs.writeFileSync(this.mapDir(dir, path), content)
    }

    async readBinaryFile(path: string, dir?: BaseDirectoryType): Promise<Uint8Array> {
        if (await this.exists(path, dir)){
            return fspromises.readFile(this.mapDir(dir, path))
        }
        throw new Error("File not found")
    }

    async createDirectory(path: string, dir?: BaseDirectoryType): Promise<void> {
        fs.mkdirSync(this.mapDir(dir, path), { recursive: true })
        return Promise.resolve()
    }

    async removeFile(path: string, dir?: BaseDirectoryType): Promise<void> {
        if (await this.exists(path, dir)){
            fs.rmSync(this.mapDir(dir, path), { recursive: true, force: true })
            return Promise.resolve()
        }
    }

    async removeDirectory(path: string, dir?: BaseDirectoryType): Promise<void> {
        await this.removeFile(path, dir)
        return Promise.resolve()
    }
}
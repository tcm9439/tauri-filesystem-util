export type BaseDirectoryType = number

export interface IFileSystem {
    /**
     * Check if a file exists in the given directory.
     * @returns true if the file exists, false otherwise
     */
    exists(path: string, dir?: BaseDirectoryType): Promise<boolean>

    /**
     * Write a text file in the given directory.
     */
    writeTextFile(path: string, content: string, append: boolean, dir?: BaseDirectoryType): Promise<void>

    /**
     * Read a text file in the given directory.
     * @returns the content of the file
     */
    readTextFile(path: string, dir?: BaseDirectoryType): Promise<string>

    /**
     * Write a binary file in the given directory.
     */
    writeBinaryFile(path: string, content: Uint8Array, dir?: BaseDirectoryType): Promise<void>

    /**
     * Read a binary file in the given directory.
     * @returns the content of the file
     */
    readBinaryFile(path: string, dir?: BaseDirectoryType): Promise<Uint8Array>

    /**
     * Remove a file in the given directory.
     */
    removeFile(path: string, dir?: BaseDirectoryType): Promise<void>

    /**
     * Create all directories in the given path.
     */
    createDirectory(path: string, dir?: BaseDirectoryType): Promise<void>
}
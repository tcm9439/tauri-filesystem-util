import { describe, it, expect, beforeAll } from "vitest"
import { NodeFileSystem } from "@/filesystem/NodeFileSystem"

describe("NodeFileSystem", () => {
    beforeAll(() => {
        NodeFileSystem.instance.removeDirectory("test/out")
        NodeFileSystem.instance.createDirectory("test/out")
    })

	it("exists", () => {
        expect(NodeFileSystem.instance.exists("resource/simpleText.txt")).resolves.toBe(true)
        expect(NodeFileSystem.instance.exists("resource/notexists.txt")).resolves.toBe(false)
	})

    it("readTextFile", () => {
        expect(NodeFileSystem.instance.readTextFile("resource/simpleText.txt")).resolves.toBe("ABC\nCDE\n")
    })

    it("writeTextFile", () => {
        NodeFileSystem.instance.writeTextFile("out/write.txt", "Hello World!\n").then(() => {
            expect(NodeFileSystem.instance.readTextFile("out/write.txt")).resolves.toBe("Hello World!\n")
        })
    })

    it("readBinaryFile", () => {
        expect(NodeFileSystem.instance.readBinaryFile("resource/tauri.png")).resolves.toBeInstanceOf(Uint8Array)
    })

    it("writeBinaryFile", () => {
        NodeFileSystem.instance.readBinaryFile("resource/tauri.png").then((content) => {
            NodeFileSystem.instance.writeBinaryFile("out/tauri.png", content)
            expect(NodeFileSystem.instance.readBinaryFile("out/tauri.png")).resolves.toEqual(content)
        })
    })

    it("createDirectory", () => {
        NodeFileSystem.instance.createDirectory("out/testDir").then(() => {
            expect(NodeFileSystem.instance.exists("out/testDir")).resolves.toBe(true)
        })
    })

    it("removeFile", () => {
        NodeFileSystem.instance.writeTextFile("out/remove.txt", "Hello World!\n").then(() => {
            expect(NodeFileSystem.instance.exists("out/remove.txt")).resolves.toBe(true)
            NodeFileSystem.instance.removeFile("out/remove.txt")
            expect(NodeFileSystem.instance.exists("out/remove.txt")).resolves.toBe(false)
        })
    })
})

import { describe, it, expect, beforeEach } from "vitest"
import { TauriFileSystem } from "@/filesystem/TauriFileSystem"

describe("TauriFileSystem", () => {
	it("baseDir", () => {
        let path = "test/out/test.txt"
        expect(TauriFileSystem.instance["baseDir"](path)).toBe("test/out")

        path = "abc.txt"
        expect(TauriFileSystem.instance["baseDir"](path)).toBe("./")
    })
})

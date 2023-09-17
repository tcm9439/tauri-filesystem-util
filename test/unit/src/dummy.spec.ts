import { describe, it, expect, beforeEach } from "vitest"
import { add } from "@/dummy"

describe("dummy", () => {
	it("add", () => {
        expect(add(1, 2)).toBe(3)
	})
})

import { describe, expect, it } from "vitest";

import {
	getSolidSpecDisciplinePath,
	setupSolidSpecWorkspace,
} from "../../src/utils/solidspec.js";
import {
	getOpenSpexDisciplinePath,
	setupOpenSpexWorkspace,
} from "../../src/utils/openspex.js";

describe("openspex compatibility wrapper", () => {
	it("re-exports canonical solidspec helpers", () => {
		expect(getOpenSpexDisciplinePath).toBe(getSolidSpecDisciplinePath);
		expect(setupOpenSpexWorkspace).toBe(setupSolidSpecWorkspace);
	});
});

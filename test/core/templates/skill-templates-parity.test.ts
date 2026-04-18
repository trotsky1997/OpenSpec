import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
	type SkillTemplate,
	getApplyChangeSkillTemplate,
	getArchiveChangeSkillTemplate,
	getBulkArchiveChangeSkillTemplate,
	getClarifyChangeSkillTemplate,
	getContinueChangeSkillTemplate,
	getExploreSkillTemplate,
	getFeedbackSkillTemplate,
	getFfChangeSkillTemplate,
	getInspectChangeSkillTemplate,
	getNewChangeSkillTemplate,
	getOnboardSkillTemplate,
	getOpsxApplyCommandTemplate,
	getOpsxArchiveCommandTemplate,
	getOpsxBulkArchiveCommandTemplate,
	getOpsxClarifyCommandTemplate,
	getOpsxContinueCommandTemplate,
	getOpsxExploreCommandTemplate,
	getOpsxFfCommandTemplate,
	getOpsxInspectCommandTemplate,
	getOpsxNewCommandTemplate,
	getOpsxOnboardCommandTemplate,
	getOpsxSyncCommandTemplate,
	getOpsxProposeCommandTemplate,
	getOpsxProposeSkillTemplate,
	getOpsxVerifyCommandTemplate,
	getSyncSpecsSkillTemplate,
	getVerifyChangeSkillTemplate,
} from "../../../src/core/templates/skill-templates.js";
import { generateSkillContent } from "../../../src/core/shared/skill-generation.js";

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
	getExploreSkillTemplate:
		"3f73b4d7ab189ef6367fccc9d99308bee35c6a89dae4c8044582a01cb01b335b",
	getNewChangeSkillTemplate:
		"f0a8979e71b6aa0419df08817646efaaa43ddb1eae6145d953e81db0fd4511a7",
	getContinueChangeSkillTemplate:
		"f2e413f0333dfd6641cc2bd1a189273fdea5c399eecdde98ef528b5216f097b3",
	getApplyChangeSkillTemplate:
		"0bf4cc28613157bf2c1240e04977cb89198b2dfba059b3237dace39b26f826be",
	getFfChangeSkillTemplate:
		"a7332fb14c8dc3f9dec71f5d332790b4a8488191e7db4ab6132ccbefecf9ded9",
	getClarifyChangeSkillTemplate:
		"305d67b8e6863b64821cdaf1a4fcbfc481ffc144de26f2594e76e6671b18ff65",
	getInspectChangeSkillTemplate:
		"359660997459ee49e93c9417ef29fca95392ee64bde4b13670b780383e21c032",
	getSyncSpecsSkillTemplate:
		"bded184e4c345619148de2c0ad80a5b527d4ffe45c87cc785889b9329e0f465b",
	getOnboardSkillTemplate:
		"0735a146a0b35517f78dab3f902abc5f18a02ec4d7be3265dc8032cb92a6bab6",
	getOpsxExploreCommandTemplate:
		"b421b88c7a532385f7b1404736d7893eb35a05573b4a04a96f72379ac1bbf148",
	getOpsxNewCommandTemplate:
		"8cbc8b0c221d1ba69aea41e6931b77eb56d6bb3f311585ea4643c57213e1292f",
	getOpsxContinueCommandTemplate:
		"8bbaedcc95287f9e822572608137df4f49ad54cedfb08d3342d0d1c4e9716caa",
	getOpsxApplyCommandTemplate:
		"2c86d5ff5bcd653c30f129fd1b2ea61c612a21b54d8821b22dc513d20e03ca65",
	getOpsxClarifyCommandTemplate:
		"ee3b2818773d312f684cd5c3e5293e566930c6bed025b0fc3fbec7f633448e47",
	getOpsxFfCommandTemplate:
		"cdebe872cc8e0fcc25c8864b98ffd66a93484c0657db94bd1285b8113092702a",
	getOpsxInspectCommandTemplate:
		"0833b770b079aee7c9110b83cf76976c2f98d5c2988e2d414c0a1116c0ed8713",
	getArchiveChangeSkillTemplate:
		"6f8ca383fdb5a4eb9872aca81e07bf0ba7f25e4de8617d7a047ca914ca7f14b9",
	getBulkArchiveChangeSkillTemplate:
		"8049897ce1ddb2ff6c0d4b72e22636f9ecfd083b5f2c2a30cf3bb1cb828a2f93",
	getOpsxSyncCommandTemplate:
		"378d035fe7cc30be3e027b66dcc4b8afc78ef1c8369c39479c9b05a582fb5ccf",
	getVerifyChangeSkillTemplate:
		"6ed3e3553076ba3dde90b54103fc5aeb4c85f67e6eb3d440e5909da0f3ccc6b5",
	getOpsxArchiveCommandTemplate:
		"b44cc9748109f61687f9f596604b037bc3ea803abc143b22f09a76aebd98b493",
	getOpsxOnboardCommandTemplate:
		"ae3b605dff3a3d6c306cc1fb3f8c7d3b49cd74245258b9ad782bcb1169c9f1e3",
	getOpsxBulkArchiveCommandTemplate:
		"0d77c82de43840a28c74f5181cb21e33b9a9d00454adf4bc92bdc9e69817d6f5",
	getOpsxVerifyCommandTemplate:
		"a2153d85a5a7372abd0ab8f6775e390471fe838473420d922afd21033d797540",
	getOpsxProposeSkillTemplate:
		"6603c216f6e94b438ba1ebca758e5dbdcd537a446aafda5d7bd3a7ccddbe8261",
	getOpsxProposeCommandTemplate:
		"efb816056313026f1232c8676131a6b680fd0478b36f299429e6ffda0ff8755e",
	getFeedbackSkillTemplate:
		"d7d83c5f7fc2b92fe8f4588a5bf2d9cb315e4c73ec19bcd5ef28270906319a0d",
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
	"openspec-explore":
		"08e1ec9958eb04653707dd3e198c3fd69cf1b3acd3cf95a1022693cca83c60fc",
	"openspec-new-change":
		"065b6dff7a4329cd837ec5a92ed712274925b44e04c12a25b0b62f53566070d4",
	"openspec-continue-change":
		"463cf0b980ec9c3c24774414ef2a3e48e9faa8577bc8748990f45ab3d5efe960",
	"openspec-apply-change":
		"a951419c041d04b705b9e3551376517a12c1ad9b18d5d6bd526c628d4bb673ad",
	"openspec-ff-change":
		"672c3a5b8df152d959b15bd7ae2be7a75ab7b8eaa2ec1e0daa15c02479b27937",
	"openspec-clarify-change":
		"9d252c0306a71021546d6192feb4666ba24210e74e1835ad695682a1dd82c3e6",
	"openspec-inspect-change":
		"fc1355368516f8178d65bbf82c04c3449b96cff1e795063a7f0e19130d3b5449",
	"openspec-sync-specs":
		"b8859cf454379a19ca35dbf59eedca67306607f44a355327f9dc851114e50bde",
	"openspec-archive-change":
		"f83c85452bd47de0dee6b8efbcea6a62534f8a175480e9044f3043f887cebf0f",
	"openspec-bulk-archive-change":
		"10477399bb07c7ba67f78e315bd68fb1901af8866720545baf4c62a6a679493b",
	"openspec-verify-change":
		"15aa15b7263fc4a89c7825f8cc14b3d56c8731ee561f97c6197cedb8c02c9c44",
	"openspec-onboard":
		"4337c209fd72b84d35f5c5fc0fcb3d2f7bfd66ccb914ff251177b02af593eda6",
	"openspec-propose":
		"7041fc54a7c79c02d602330bc0f4955f992dab4857aa93d84a0bf66c55282df2",
};

function stableStringify(value: unknown): string {
	if (Array.isArray(value)) {
		return `[${value.map(stableStringify).join(",")}]`;
	}

	if (value && typeof value === "object") {
		const entries = Object.entries(value as Record<string, unknown>)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

		return `{${entries.join(",")}}`;
	}

	return JSON.stringify(value);
}

function hash(value: string): string {
	return createHash("sha256").update(value).digest("hex");
}

describe("skill templates split parity", () => {
	it("preserves all template function payloads exactly", () => {
		const functionFactories: Record<string, () => unknown> = {
			getExploreSkillTemplate,
			getNewChangeSkillTemplate,
			getContinueChangeSkillTemplate,
			getApplyChangeSkillTemplate,
			getFfChangeSkillTemplate,
			getClarifyChangeSkillTemplate,
			getInspectChangeSkillTemplate,
			getSyncSpecsSkillTemplate,
			getOnboardSkillTemplate,
			getOpsxExploreCommandTemplate,
			getOpsxNewCommandTemplate,
			getOpsxContinueCommandTemplate,
			getOpsxApplyCommandTemplate,
			getOpsxClarifyCommandTemplate,
			getOpsxFfCommandTemplate,
			getOpsxInspectCommandTemplate,
			getArchiveChangeSkillTemplate,
			getBulkArchiveChangeSkillTemplate,
			getOpsxSyncCommandTemplate,
			getVerifyChangeSkillTemplate,
			getOpsxArchiveCommandTemplate,
			getOpsxOnboardCommandTemplate,
			getOpsxBulkArchiveCommandTemplate,
			getOpsxVerifyCommandTemplate,
			getOpsxProposeSkillTemplate,
			getOpsxProposeCommandTemplate,
			getFeedbackSkillTemplate,
		};

		const actualHashes = Object.fromEntries(
			Object.entries(functionFactories).map(([name, fn]) => [
				name,
				hash(stableStringify(fn())),
			]),
		);

		expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
	});

	it("preserves generated skill file content exactly", () => {
		// Intentionally excludes getFeedbackSkillTemplate: skillFactories only models templates
		// deployed via generateSkillContent, while feedback is covered in function payload parity.
		const skillFactories: Array<[string, () => SkillTemplate]> = [
			["openspec-explore", getExploreSkillTemplate],
			["openspec-new-change", getNewChangeSkillTemplate],
			["openspec-continue-change", getContinueChangeSkillTemplate],
			["openspec-apply-change", getApplyChangeSkillTemplate],
			["openspec-ff-change", getFfChangeSkillTemplate],
			["openspec-clarify-change", getClarifyChangeSkillTemplate],
			["openspec-inspect-change", getInspectChangeSkillTemplate],
			["openspec-sync-specs", getSyncSpecsSkillTemplate],
			["openspec-archive-change", getArchiveChangeSkillTemplate],
			["openspec-bulk-archive-change", getBulkArchiveChangeSkillTemplate],
			["openspec-verify-change", getVerifyChangeSkillTemplate],
			["openspec-onboard", getOnboardSkillTemplate],
			["openspec-propose", getOpsxProposeSkillTemplate],
		];

		const actualHashes = Object.fromEntries(
			skillFactories.map(([dirName, createTemplate]) => [
				dirName,
				hash(generateSkillContent(createTemplate(), "PARITY-BASELINE")),
			]),
		);

		expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
	});
});

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
		"48ea2f4c4bfab1288cf4c70ec23a533f5562ccab5960650aac498122fc7ac4a9",
	getContinueChangeSkillTemplate:
		"f2e413f0333dfd6641cc2bd1a189273fdea5c399eecdde98ef528b5216f097b3",
	getApplyChangeSkillTemplate:
		"f43eeaed3bc41f55e764f0c592f6534fcc2fea75d45713c51bd8f021b702d963",
	getFfChangeSkillTemplate:
		"a7332fb14c8dc3f9dec71f5d332790b4a8488191e7db4ab6132ccbefecf9ded9",
	getClarifyChangeSkillTemplate:
		"aa4c5f3cadb7844f7cb34cf5fdbee625bd8b807d457999af05021813e8be80c7",
	getInspectChangeSkillTemplate:
		"4a6d6ed16d43f4232c628e3ae5da4a829f94d671d781161d887e99b53e256055",
	getSyncSpecsSkillTemplate:
		"bded184e4c345619148de2c0ad80a5b527d4ffe45c87cc785889b9329e0f465b",
	getOnboardSkillTemplate:
		"17cc7962e4078b0a524029a2abc87f3b14688110de5f3693a40929adffe6012e",
	getOpsxExploreCommandTemplate:
		"b421b88c7a532385f7b1404736d7893eb35a05573b4a04a96f72379ac1bbf148",
	getOpsxNewCommandTemplate:
		"655d69082b0d803e9d9b7200bbacc43afe4f8bf8a6955abaa60c9e44928a94bd",
	getOpsxContinueCommandTemplate:
		"8bbaedcc95287f9e822572608137df4f49ad54cedfb08d3342d0d1c4e9716caa",
	getOpsxApplyCommandTemplate:
		"af0b14360b16fa1b753d48051ae9a93e4ac03f6bcee1bb17daadd9c220efa87d",
	getOpsxClarifyCommandTemplate:
		"ffe426fa0db5e851a49741c97f6cb2f0ca1948318038964d231b511b0ee3d0b7",
	getOpsxFfCommandTemplate:
		"cdebe872cc8e0fcc25c8864b98ffd66a93484c0657db94bd1285b8113092702a",
	getOpsxInspectCommandTemplate:
		"039d9a68e0ba1e0012ffe86d6c70f0810c687c25870c60cd6578e8205f4caf4d",
	getArchiveChangeSkillTemplate:
		"6f8ca383fdb5a4eb9872aca81e07bf0ba7f25e4de8617d7a047ca914ca7f14b9",
	getBulkArchiveChangeSkillTemplate:
		"8049897ce1ddb2ff6c0d4b72e22636f9ecfd083b5f2c2a30cf3bb1cb828a2f93",
	getOpsxSyncCommandTemplate:
		"378d035fe7cc30be3e027b66dcc4b8afc78ef1c8369c39479c9b05a582fb5ccf",
	getVerifyChangeSkillTemplate:
		"99d2ddebd43922d8be8693f1059d1494486d33e034685fb8d8ff564d21c91f50",
	getOpsxArchiveCommandTemplate:
		"b44cc9748109f61687f9f596604b037bc3ea803abc143b22f09a76aebd98b493",
	getOpsxOnboardCommandTemplate:
		"26f8613a38e0e1b3d07fc9b706f5e68b7a71a890484af3bb198548d399c7b122",
	getOpsxBulkArchiveCommandTemplate:
		"0d77c82de43840a28c74f5181cb21e33b9a9d00454adf4bc92bdc9e69817d6f5",
	getOpsxVerifyCommandTemplate:
		"ee774a14c585c852d2a6f33dd02dc7545f229c9af9dbd8251d391933f376bed6",
	getOpsxProposeSkillTemplate:
		"2d17bd21e332e52ffae1f59c92c077aa0deb8c2d96f47b99081c01700ebed040",
	getOpsxProposeCommandTemplate:
		"e4f92070c473239b0b0bc10103e28787f00f3350edea75dcb09baad9f30629ac",
	getFeedbackSkillTemplate:
		"d7d83c5f7fc2b92fe8f4588a5bf2d9cb315e4c73ec19bcd5ef28270906319a0d",
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
	"openspec-explore":
		"08e1ec9958eb04653707dd3e198c3fd69cf1b3acd3cf95a1022693cca83c60fc",
	"openspec-new-change":
		"a302d14a462076bf08aeb20fb8fc18606d97156b04495e6c38a9adb218d9d176",
	"openspec-continue-change":
		"463cf0b980ec9c3c24774414ef2a3e48e9faa8577bc8748990f45ab3d5efe960",
	"openspec-apply-change":
		"577881ac52adff659de193883a7ceece4a72599eb66a2b7e8de1aebc1325f2f4",
	"openspec-ff-change":
		"672c3a5b8df152d959b15bd7ae2be7a75ab7b8eaa2ec1e0daa15c02479b27937",
	"openspec-clarify-change":
		"a4e43d7394ea749343a3016f44b517aed7a2f077181ed903fc844bf38223feae",
	"openspec-inspect-change":
		"1bfc17fbf35f5391d492f27fc9bdc3fce2a084e46ff61e4b0e61ac04002aedff",
	"openspec-sync-specs":
		"b8859cf454379a19ca35dbf59eedca67306607f44a355327f9dc851114e50bde",
	"openspec-archive-change":
		"f83c85452bd47de0dee6b8efbcea6a62534f8a175480e9044f3043f887cebf0f",
	"openspec-bulk-archive-change":
		"10477399bb07c7ba67f78e315bd68fb1901af8866720545baf4c62a6a679493b",
	"openspec-verify-change":
		"5eb59b469980cd0502c8f0dd0b8e89806d0aced8efaa455b52ad070cd694e239",
	"openspec-onboard":
		"eb3a439f3c8fe9fdceba3ddefa3724e8bd756146f7e006654e5a5bdb872da8e7",
	"openspec-propose":
		"9b3f66d427e932b4449e4c30ef6655f2404fa42c9da52c09e6bd389e29ad412a",
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

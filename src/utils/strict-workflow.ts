export const SOLIDSPEC_VARIANT = "solidspec";
export const OPENSPEX_VARIANT = "openspex";

export const STRICT_WORKFLOW_VARIANTS = [
	SOLIDSPEC_VARIANT,
	OPENSPEX_VARIANT,
] as const;

export type StrictWorkflowVariant = (typeof STRICT_WORKFLOW_VARIANTS)[number];

export const SOLIDSPEC_DISPLAY_NAME = "SolidSpec";
export const OPENSPEX_DISPLAY_NAME = "OpenSpeX";

export function isStrictWorkflowVariant(
	variant: string | undefined,
): variant is StrictWorkflowVariant {
	return STRICT_WORKFLOW_VARIANTS.includes(variant as StrictWorkflowVariant);
}

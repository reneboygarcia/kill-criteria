import type { FlowId } from "./types";

export type FlowMeta = {
  id: FlowId;
  fileNumber: 1 | 2 | 3;
  title: string;
  subtitle: string;
  accent: string;
};

export const flowMetaList: FlowMeta[] = [
  {
    id: "quit-job",
    fileNumber: 1,
    title: "Should I quit my current job?",
    subtitle:
      "For fresh grads, mid-level, and senior civil engineers in the Philippines · r/civilengineer_ph",
    accent: "#6366f1",
  },
  {
    id: "change-employer",
    fileNumber: 2,
    title: "Should I change employer or niche?",
    subtitle:
      "For engineers who have already tried once — is it the employer or the field? · r/civilengineer_ph",
    accent: "#818cf8",
  },
  {
    id: "leave-profession",
    fileNumber: 3,
    title: "Should I leave civil engineering entirely?",
    subtitle: "The last gate — OFW, pivot, or a clean exit · r/civilengineer_ph",
    accent: "#4f46e5",
  },
];

export const VALID_FLOW_IDS = new Set<FlowId>(
  flowMetaList.map((flow) => flow.id),
);

export function getFlowMeta(flowId: FlowId): FlowMeta | undefined {
  return flowMetaList.find((flow) => flow.id === flowId);
}

export function isValidFlowId(id: string): id is FlowId {
  return VALID_FLOW_IDS.has(id as FlowId);
}

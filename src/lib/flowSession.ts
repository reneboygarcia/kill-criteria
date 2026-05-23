import { flows, getFlow } from "../data/flows";
import type {
  FlowDefinition,
  FlowId,
  FlowSession,
  PathStep,
} from "../data/types";
import { isQuestionNode } from "../data/types";

export const STORAGE_KEY = "kill-criteria-session";

const validFlowIds = new Set<string>(Object.keys(flows));

function isFlowId(id: string): id is FlowId {
  return validFlowIds.has(id);
}

function validatePathStep(
  step: PathStep,
  flow: FlowDefinition,
): PathStep | null {
  const node = flow.nodes[step.nodeId];
  if (!node) return null;

  if (isQuestionNode(node)) {
    if (!step.choiceId) return null;
    const choice = node.choices.find((item) => item.id === step.choiceId);
    if (!choice) return null;
    return {
      nodeId: step.nodeId,
      choiceId: step.choiceId,
      choiceLabel: choice.label,
    };
  }

  if (node.type === "start") {
    return { nodeId: step.nodeId };
  }

  return null;
}

export function validateFlowSession(session: FlowSession): FlowSession | null {
  if (!isFlowId(session.flowId)) return null;

  const flow = getFlow(session.flowId);
  if (!flow) return null;
  if (!flow.nodes[session.currentNodeId]) return null;

  const path: PathStep[] = [];
  for (const step of session.path) {
    const validated = validatePathStep(step, flow);
    if (!validated) return null;
    path.push(validated);
  }

  return {
    flowId: session.flowId,
    currentNodeId: session.currentNodeId,
    path,
  };
}

export function loadStoredSession(): FlowSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as FlowSession;
    if (
      !parsed.flowId ||
      !parsed.currentNodeId ||
      !Array.isArray(parsed.path)
    ) {
      clearStoredSession();
      return null;
    }

    const validated = validateFlowSession(parsed);
    if (!validated) {
      clearStoredSession();
      return null;
    }

    return validated;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function saveStoredSession(session: FlowSession | null): void {
  if (!session) {
    clearStoredSession();
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

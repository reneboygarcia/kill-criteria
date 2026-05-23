import { isValidFlowId } from "../data/flowMeta";
import type {
  FlowDefinition,
  FlowSession,
  PathStep,
} from "../data/types";
import { isQuestionNode } from "../data/types";

export const STORAGE_KEY = "kill-criteria-session";

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

export function validateFlowSession(
  session: FlowSession,
  flow: FlowDefinition,
): FlowSession | null {
  if (!isValidFlowId(session.flowId)) return null;
  if (session.flowId !== flow.id) return null;
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
      !Array.isArray(parsed.path) ||
      !isValidFlowId(parsed.flowId)
    ) {
      clearStoredSession();
      return null;
    }

    return parsed;
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

import { useCallback, useEffect, useMemo, useState } from "react";
import { getFlow } from "../data/flows";
import type {
  FlowDefinition,
  FlowId,
  FlowNode,
  PathStep,
} from "../data/types";
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from "../lib/flowSession";

export function useFlowState(flowId: FlowId) {
  const flow = useMemo(() => getFlow(flowId), [flowId]);
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    flow?.startNodeId ?? "",
  );
  const [path, setPath] = useState<PathStep[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadStoredSession();
    if (saved?.flowId === flowId) {
      setCurrentNodeId(saved.currentNodeId);
      setPath(saved.path);
    } else if (flow) {
      setCurrentNodeId(flow.startNodeId);
      setPath([]);
    }
    setHydrated(true);
  }, [flowId, flow]);

  useEffect(() => {
    if (!hydrated || !flow) return;
    saveStoredSession({ flowId, currentNodeId, path });
  }, [flowId, currentNodeId, path, hydrated, flow]);

  const currentNode: FlowNode | undefined = flow?.nodes[currentNodeId];

  const choose = useCallback(
    (choiceId: string, choiceLabel: string, nextId: string) => {
      setPath((prev) => [
        ...prev,
        { nodeId: currentNodeId, choiceId, choiceLabel },
      ]);
      setCurrentNodeId(nextId);
    },
    [currentNodeId],
  );

  const advanceFromStart = useCallback(() => {
    if (currentNode?.type !== "start") return;
    setPath((prev) => [...prev, { nodeId: currentNodeId }]);
    setCurrentNodeId(currentNode.next);
  }, [currentNode, currentNodeId]);

  const goBack = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= path.length) return;
      const step = path[targetIndex];
      setCurrentNodeId(step.nodeId);
      setPath(path.slice(0, targetIndex));
    },
    [path],
  );

  const restart = useCallback(() => {
    if (!flow) return;
    setCurrentNodeId(flow.startNodeId);
    setPath([]);
    clearStoredSession();
  }, [flow]);

  const clearSession = useCallback(() => {
    clearStoredSession();
  }, []);

  return {
    flow: flow as FlowDefinition | undefined,
    currentNode,
    currentNodeId,
    path,
    hydrated,
    choose,
    advanceFromStart,
    goBack,
    restart,
    clearSession,
  };
}

export function buildResultSummary(
  flow: FlowDefinition,
  path: PathStep[],
  outcomeNode: FlowNode,
): string {
  const lines: string[] = [
    `Kill Criteria — ${flow.title}`,
    "",
    "Your path:",
  ];

  for (const step of path) {
    const node = flow.nodes[step.nodeId];
    if (!node) continue;
    if (node.type === "start") {
      lines.push(`• ${node.title}`);
    } else if (node.type === "question") {
      lines.push(`• ${node.label}: ${node.title}`);
      if (step.choiceLabel) {
        lines.push(`  → ${step.choiceLabel}`);
      }
    }
  }

  if (outcomeNode.type === "outcome") {
    lines.push("");
    lines.push(`Result: ${outcomeNode.title}`);
    lines.push(outcomeNode.subtitle);
  }

  lines.push("");
  lines.push("Based on Annie Duke's kill criteria framework · r/civilengineer_ph");

  return lines.join("\n");
}

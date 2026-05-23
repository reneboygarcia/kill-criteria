import type { FlowDefinition } from "./types";
import { quitJobFlow } from "./quitJob";
import { changeEmployerFlow } from "./changeEmployer";
import { leaveProfessionFlow } from "./leaveProfession";

export const flows: Record<string, FlowDefinition> = {
  "quit-job": quitJobFlow,
  "change-employer": changeEmployerFlow,
  "leave-profession": leaveProfessionFlow,
};

export const flowList: FlowDefinition[] = [
  quitJobFlow,
  changeEmployerFlow,
  leaveProfessionFlow,
];

export function getFlow(flowId: string): FlowDefinition | undefined {
  return flows[flowId];
}

export function getMaxDepth(flow: FlowDefinition): number {
  let max = 0;

  function walk(nodeId: string, depth: number, visited: Set<string>) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = flow.nodes[nodeId];
    if (!node) return;

    max = Math.max(max, depth);

    if (node.type === "start") {
      walk(node.next, depth + 1, new Set(visited));
    } else if (node.type === "question") {
      for (const choice of node.choices) {
        walk(choice.next, depth + 1, new Set(visited));
      }
    }
  }

  walk(flow.startNodeId, 1, new Set());
  return max;
}

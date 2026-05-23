import type { FlowDefinition, FlowId } from "./types";

const flowLoaders: Record<
  FlowId,
  () => Promise<FlowDefinition>
> = {
  "quit-job": () => import("./quitJob").then((module) => module.quitJobFlow),
  "change-employer": () =>
    import("./changeEmployer").then((module) => module.changeEmployerFlow),
  "leave-profession": () =>
    import("./leaveProfession").then((module) => module.leaveProfessionFlow),
};

const flowCache = new Map<FlowId, FlowDefinition>();

export async function loadFlow(
  flowId: FlowId,
): Promise<FlowDefinition | undefined> {
  const cached = flowCache.get(flowId);
  if (cached) return cached;

  const loader = flowLoaders[flowId];
  if (!loader) return undefined;

  const flow = await loader();
  flowCache.set(flowId, flow);
  return flow;
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

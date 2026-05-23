export type ChoiceTone = "yes" | "no" | "neutral";

export type OutcomeVariant = "stay" | "change" | "exit";

export type FlowId = "quit-job" | "change-employer" | "leave-profession";

export type ReferenceBlock =
  | {
      type: "salary-table";
      title: string;
      rows: { label: string; value: string }[];
    }
  | {
      type: "niche-grid";
      title: string;
      items: { title: string; description: string }[];
    }
  | {
      type: "checklist";
      title: string;
      columns: { title: string; items: string[] }[];
    }
  | {
      type: "pivot-grid";
      title: string;
      items: { title: string; description: string; skill: string }[];
    }
  | {
      type: "warning";
      title: string;
      body: string;
    };

export type Choice = {
  id: string;
  label: string;
  tone: ChoiceTone;
  next: string;
};

export type StartNode = {
  type: "start";
  id: string;
  title: string;
  subtitle: string;
  next: string;
};

export type QuestionNode = {
  type: "question";
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  reference?: ReferenceBlock;
  choices: Choice[];
};

export type OutcomeNode = {
  type: "outcome";
  id: string;
  variant: OutcomeVariant;
  label: string;
  title: string;
  subtitle: string;
  reference?: ReferenceBlock;
  handoff?: { flowId: FlowId; label: string };
};

export type FlowNode = StartNode | QuestionNode | OutcomeNode;

export type FlowDefinition = {
  id: FlowId;
  fileNumber: 1 | 2 | 3;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  startNodeId: string;
  nodes: Record<string, FlowNode>;
};

export type PathStep = {
  nodeId: string;
  choiceId?: string;
  choiceLabel?: string;
};

export type FlowSession = {
  flowId: FlowId;
  currentNodeId: string;
  path: PathStep[];
};

export function isQuestionNode(node: FlowNode): node is QuestionNode {
  return node.type === "question";
}

export function isOutcomeNode(node: FlowNode): node is OutcomeNode {
  return node.type === "outcome";
}

export function isStartNode(node: FlowNode): node is StartNode {
  return node.type === "start";
}

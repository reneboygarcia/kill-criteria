import type { FlowSession } from "../../data/types";
import { quitJobFlow } from "../../data/quitJob";
import {
  STORAGE_KEY,
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
  validateFlowSession,
} from "../flowSession";

const validSession: FlowSession = {
  flowId: "quit-job",
  currentNodeId: "q1-compensation",
  path: [
    { nodeId: "start" },
    {
      nodeId: "q1-compensation",
      choiceId: "yes-underpaid",
      choiceLabel: "Yes, underpaid",
    },
  ],
};

describe("validateFlowSession", () => {
  it("accepts a valid saved session", () => {
    expect(validateFlowSession(validSession, quitJobFlow)).toEqual(validSession);
  });

  it("rejects an unknown flow id", () => {
    expect(
      validateFlowSession(
        { ...validSession, flowId: "unknown-flow" as FlowSession["flowId"] },
        quitJobFlow,
      ),
    ).toBeNull();
  });

  it("rejects a flow id that does not match the loaded flow", () => {
    expect(
      validateFlowSession(
        { ...validSession, flowId: "change-employer" },
        quitJobFlow,
      ),
    ).toBeNull();
  });

  it("rejects an unknown current node id", () => {
    expect(
      validateFlowSession(
        { ...validSession, currentNodeId: "missing-node" },
        quitJobFlow,
      ),
    ).toBeNull();
  });

  it("rejects a path step with an unknown node id", () => {
    expect(
      validateFlowSession(
        {
          ...validSession,
          path: [{ nodeId: "missing-node" }],
        },
        quitJobFlow,
      ),
    ).toBeNull();
  });

  it("rejects a question step without a choice id", () => {
    expect(
      validateFlowSession(
        {
          ...validSession,
          path: [{ nodeId: "q1-compensation" }],
        },
        quitJobFlow,
      ),
    ).toBeNull();
  });

  it("rejects a question step with an unknown choice id", () => {
    expect(
      validateFlowSession(
        {
          ...validSession,
          path: [
            {
              nodeId: "q1-compensation",
              choiceId: "tampered-choice",
              choiceLabel: "Injected label",
            },
          ],
        },
        quitJobFlow,
      ),
    ).toBeNull();
  });

  it("re-derives choice labels from the flow graph", () => {
    const tampered: FlowSession = {
      ...validSession,
      path: [
        { nodeId: "start" },
        {
          nodeId: "q1-compensation",
          choiceId: "yes-underpaid",
          choiceLabel: "<script>alert(1)</script>",
        },
      ],
    };

    const validated = validateFlowSession(tampered, quitJobFlow);
    expect(validated?.path[1]?.choiceLabel).toBe("Yes, underpaid");
  });
});

describe("loadStoredSession", () => {
  it("returns null when nothing is stored", () => {
    expect(loadStoredSession()).toBeNull();
  });

  it("loads a structurally valid stored session", () => {
    saveStoredSession(validSession);
    expect(loadStoredSession()).toEqual(validSession);
  });

  it("clears corrupt storage and returns null", () => {
    localStorage.setItem(STORAGE_KEY, "{not-json");
    expect(loadStoredSession()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("clears sessions with unknown flow ids and returns null", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...validSession, flowId: "missing-flow" }),
    );

    expect(loadStoredSession()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("returns structurally valid sessions before graph validation", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...validSession, currentNodeId: "missing-node" }),
    );

    expect(loadStoredSession()).toEqual({
      ...validSession,
      currentNodeId: "missing-node",
    });
  });
});

describe("clearStoredSession", () => {
  it("removes the saved session key", () => {
    saveStoredSession(validSession);
    clearStoredSession();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

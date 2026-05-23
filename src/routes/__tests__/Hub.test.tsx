import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { FlowSession } from "../../data/types";
import { STORAGE_KEY, saveStoredSession } from "../../lib/flowSession";
import { Hub } from "../Hub";

const savedSession: FlowSession = {
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

function renderHub() {
  return render(
    <MemoryRouter>
      <Hub />
    </MemoryRouter>,
  );
}

describe("Hub", () => {
  it("shows a resume card when a valid session exists", async () => {
    saveStoredSession(savedSession);
    renderHub();

    expect(
      await screen.findByRole("link", {
        name: /resume — should i quit my current job\?/i,
      }),
    ).toHaveAttribute("href", "/flow/quit-job");
  });

  it("clears saved progress from the hub", async () => {
    const user = userEvent.setup();
    saveStoredSession(savedSession);
    renderHub();

    await screen.findByRole("button", { name: /clear saved progress/i });
    await user.click(
      screen.getByRole("button", { name: /clear saved progress/i }),
    );

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(
      screen.queryByRole("link", { name: /resume —/i }),
    ).not.toBeInTheDocument();
  });
});

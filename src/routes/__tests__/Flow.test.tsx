import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Flow } from "../Flow";
import { Hub } from "../Hub";

function renderFlowRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/flow/:flowId" element={<Flow />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Flow route", () => {
  it("redirects unknown flow ids to the hub", async () => {
    renderFlowRoute("/flow/not-a-real-flow");

    expect(
      await screen.findByRole("heading", {
        name: /civil engineer decision guide/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders a known flow", async () => {
    renderFlowRoute("/flow/quit-job");

    expect(
      await screen.findByRole("heading", { name: /start here/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /begin/i })).toBeInTheDocument();
  });
});

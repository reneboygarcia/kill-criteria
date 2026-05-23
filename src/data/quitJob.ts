import type { FlowDefinition } from "./types";

export const quitJobFlow: FlowDefinition = {
  id: "quit-job",
  fileNumber: 1,
  tag: "Kill Criteria — File 1 of 3",
  title: "Should I quit my current job?",
  subtitle:
    "For fresh grads, mid-level, and senior civil engineers in the Philippines · r/civilengineer_ph",
  accent: "#669df6",
  startNodeId: "start",
  nodes: {
    start: {
      type: "start",
      id: "start",
      title: "Start here",
      subtitle: "You're thinking of leaving your current employer",
      next: "q1-compensation",
    },
    "q1-compensation": {
      type: "question",
      id: "q1-compensation",
      label: "Q1 — Compensation",
      title: "Is your salary below PH market rate for your level?",
      subtitle: "Compare honestly against the benchmarks below",
      reference: {
        type: "salary-table",
        title: "PH Civil Engineering Salary Benchmarks (2026)",
        rows: [
          { label: "Fresh grad (0–2 yrs)", value: "₱18,000–25,000/mo" },
          { label: "Mid-level (3–7 yrs)", value: "₱35,000–55,000/mo" },
          { label: "Senior (8+ yrs)", value: "₱60,000–90,000+/mo" },
          {
            label: "Gov't / DPWH",
            value: "SG-12 to SG-18 (lower but stable)",
          },
        ],
      },
      choices: [
        {
          id: "yes-underpaid",
          label: "Yes, underpaid",
          tone: "yes",
          next: "q2-growth",
        },
        {
          id: "no-fair",
          label: "No, paid fairly",
          tone: "no",
          next: "q2b-environment",
        },
      ],
    },
    "q2-growth": {
      type: "question",
      id: "q2-growth",
      label: "Q2 — Growth",
      title: "Any promotion or raise in the last 2+ years?",
      subtitle: "Verbal promises don't count — actual action only",
      choices: [
        {
          id: "no-growth",
          label: "No growth",
          tone: "yes",
          next: "q3-toxic",
        },
        {
          id: "growing-slowly",
          label: "Growing slowly",
          tone: "no",
          next: "outcome-negotiate-leverage",
        },
      ],
    },
    "q3-toxic": {
      type: "question",
      id: "q3-toxic",
      label: "Q3 — Toxic check",
      title: "Is the workplace also toxic or unsafe?",
      subtitle: "No OT pay, unsafe site, harassment, micromanagement",
      choices: [
        {
          id: "yes-toxic",
          label: "Yes, toxic",
          tone: "yes",
          next: "outcome-leave-now",
        },
        {
          id: "manageable",
          label: "Manageable",
          tone: "no",
          next: "outcome-negotiate-deadline",
        },
      ],
    },
    "q2b-environment": {
      type: "question",
      id: "q2b-environment",
      label: "Q2b — Environment",
      title: "Is the environment still workable?",
      subtitle: "Gov't stability, HMO, location, team culture",
      choices: [
        {
          id: "no-toxic",
          label: "No, toxic",
          tone: "yes",
          next: "outcome-change-employer",
        },
        {
          id: "yes-fine",
          label: "Yes, fine",
          tone: "no",
          next: "outcome-stay",
        },
      ],
    },
    "outcome-leave-now": {
      type: "outcome",
      id: "outcome-leave-now",
      variant: "exit",
      label: "Kill criterion met",
      title: "Leave now",
      subtitle:
        "Job hunt while employed. Don't resign first. Activate File 2.",
      handoff: {
        flowId: "change-employer",
        label: "Continue to: Change employer or niche?",
      },
    },
    "outcome-negotiate-deadline": {
      type: "outcome",
      id: "outcome-negotiate-deadline",
      variant: "change",
      label: "Trigger: negotiate",
      title: "Set 3-month deadline",
      subtitle:
        "Document your wins. Formally request salary review. No result → activate File 2.",
      handoff: {
        flowId: "change-employer",
        label: "Continue to: Change employer or niche?",
      },
    },
    "outcome-negotiate-leverage": {
      type: "outcome",
      id: "outcome-negotiate-leverage",
      variant: "change",
      label: "Hold — negotiate",
      title: "Negotiate before moving",
      subtitle:
        "You have leverage. Request a formal salary review citing market data. Give it 90 days.",
    },
    "outcome-change-employer": {
      type: "outcome",
      id: "outcome-change-employer",
      variant: "exit",
      label: "Kill criterion met",
      title: "Change employer",
      subtitle:
        "Pay is okay but environment is not. Lateral move. Activate File 2.",
      handoff: {
        flowId: "change-employer",
        label: "Continue to: Change employer or niche?",
      },
    },
    "outcome-stay": {
      type: "outcome",
      id: "outcome-stay",
      variant: "stay",
      label: "Stay — reassess",
      title: "Stay for now",
      subtitle:
        "Set a 12-month checkpoint. Write your kill criteria now so future-you has a trigger.",
    },
  },
};

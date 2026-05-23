import type { FlowDefinition } from "./types";

const ofwChecklist = {
  type: "checklist" as const,
  title: "OFW Process Checklist — Civil Engineer from PH",
  columns: [
    {
      title: "Documents (all destinations)",
      items: [
        "PRC ID — valid and renewed",
        "DFA apostille / Red Ribbon on PRC cert",
        "TOR and diploma — authenticated",
        "NSO/PSA birth certificate",
        "NBI clearance — internationally recognized",
        "Work experience certificate per employer",
        "Passport — at least 2 years validity",
      ],
    },
    {
      title: "Country-specific requirements",
      items: [
        "Qatar / UAE — UPDA exam or equivalent eval",
        "Saudi Arabia — SASO accreditation may apply",
        "Australia — Engineers Australia (CDR report)",
        "Canada — IQAS or WES evaluation",
        "Singapore — PE registration for senior roles",
        "POEA — verify agency accreditation at poea.gov.ph",
        "OEC — required before departure",
      ],
    },
  ],
};

const pivotGrid = {
  type: "pivot-grid" as const,
  title: "Career pivots that use your CE skills",
  items: [
    {
      title: "PropTech",
      description: "Construction tech, digital twin",
      skill: "CE skill: site + technical",
    },
    {
      title: "Real estate dev",
      description: "Project management, costing",
      skill: "CE skill: QS + estimation",
    },
    {
      title: "LGU / Gov planning",
      description: "Infrastructure, zoning, permits",
      skill: "CE skill: design + compliance",
    },
    {
      title: "BIM consulting",
      description: "Revit, Navisworks, coordination",
      skill: "CE skill: drafting + modeling",
    },
    {
      title: "CE teaching",
      description: "HEIs, review centers, TESDA",
      skill: "CE skill: board passer + exp",
    },
    {
      title: "Supply / procurement",
      description: "Materials, vendor mgmt",
      skill: "CE skill: specs + costing",
    },
  ],
};

const exitWarning = {
  type: "warning" as const,
  title: "One rule before you exit",
  body: "Don't resign on emotion. Resign on a plan. Keep your PRC license active for at least 2 more renewal cycles — the cost is minimal and you never know when a CE credential opens an unexpected door abroad or locally. Burn no bridges in your resignation letter.",
};

export const leaveProfessionFlow: FlowDefinition = {
  id: "leave-profession",
  fileNumber: 3,
  tag: "Kill Criteria — File 3 of 3",
  title: "Should I leave civil engineering entirely?",
  subtitle: "The last gate — OFW, pivot, or a clean exit · r/civilengineer_ph",
  accent: "#4f46e5",
  startNodeId: "start",
  nodes: {
    start: {
      type: "start",
      id: "start",
      title: "You're seriously considering leaving CE",
      subtitle:
        "Pattern confirmed across employers. This is the final gate before you exit.",
      next: "q1-ofw",
    },
    "q1-ofw": {
      type: "question",
      id: "q1-ofw",
      label: "Q1 — Abroad track first",
      title: "Have you seriously explored working abroad as a CE?",
      subtitle:
        "Middle East, Australia, Canada, Singapore — CE demand is real and pay is 5–10× local. This is not the same as your local market experience.",
      choices: [
        {
          id: "not-viable",
          label: "Not viable for me",
          tone: "yes",
          next: "q2-pivot",
        },
        {
          id: "viable-not-tried",
          label: "Viable — haven't tried",
          tone: "no",
          next: "q2b-ofw-readiness",
        },
      ],
    },
    "q2-pivot": {
      type: "question",
      id: "q2-pivot",
      label: "Q2 — Pivot field",
      title: "Do you have a specific field to pivot to?",
      subtitle:
        "PropTech, real estate dev, LGU, BIM consulting, teaching, project management outside CE.",
      choices: [
        {
          id: "no-plan",
          label: "No clear plan",
          tone: "no",
          next: "outcome-slow-exit",
        },
        {
          id: "yes-plan",
          label: "Yes, have a plan",
          tone: "yes",
          next: "outcome-exit-dignity",
        },
      ],
    },
    "q2b-ofw-readiness": {
      type: "question",
      id: "q2b-ofw-readiness",
      label: "Q2b — OFW readiness",
      title: "Are your documents and credentials ready?",
      subtitle:
        "PRC + DFA authentication, POEA, credential evaluation for target country?",
      choices: [
        {
          id: "not-yet",
          label: "Not yet",
          tone: "yes",
          next: "outcome-prep-ofw",
        },
        {
          id: "ready",
          label: "Ready to go",
          tone: "no",
          next: "outcome-try-abroad",
        },
      ],
    },
    "outcome-slow-exit": {
      type: "outcome",
      id: "outcome-slow-exit",
      variant: "change",
      label: "Not ready yet",
      title: "Slow exit — build first",
      subtitle:
        "Upskill nights and weekends. Save 6 months of expenses. Identify the target field. Then exit cleanly.",
      reference: pivotGrid,
    },
    "outcome-exit-dignity": {
      type: "outcome",
      id: "outcome-exit-dignity",
      variant: "exit",
      label: "Kill criterion met",
      title: "Exit with dignity",
      subtitle:
        "Resign professionally. 30-day notice minimum. Get COE in writing. Keep PRC license active for 2 more cycles — costs little, burns no bridges.",
      reference: exitWarning,
    },
    "outcome-prep-ofw": {
      type: "outcome",
      id: "outcome-prep-ofw",
      variant: "change",
      label: "Prep the OFW track",
      title: "Start the paperwork now",
      subtitle:
        "Takes 3–9 months to complete. Start while employed. See OFW checklist below.",
      reference: ofwChecklist,
    },
    "outcome-try-abroad": {
      type: "outcome",
      id: "outcome-try-abroad",
      variant: "stay",
      label: "OFW track activated",
      title: "Try abroad first",
      subtitle:
        "Don't resign until you have a signed offer and visa in hand. One offer changes everything.",
      reference: ofwChecklist,
    },
  },
};

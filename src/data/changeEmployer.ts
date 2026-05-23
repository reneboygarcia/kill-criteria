import type { FlowDefinition } from "./types";

const nicheReference = {
  type: "niche-grid" as const,
  title: "PH Civil Engineering — Better-paying niches and tracks",
  items: [
    {
      title: "BIM / Digital delivery",
      description:
        "Revit, Navisworks, BIM 360. Demand growing fast in PH large-scale infra. ₱50–80k+/mo possible.",
    },
    {
      title: "Geotechnical / Soil",
      description:
        "Specialized, less competition. Mining, reclamation, foundation work. Often project-based big pay.",
    },
    {
      title: "Quantity Surveying",
      description:
        "QS roles export well to Middle East, Australia. Add RICS accreditation for OFW advantage.",
    },
    {
      title: "Private real estate dev",
      description:
        "Ayala, SMDC, DMCI — better pay than small contractors. Look for project engineer roles.",
    },
    {
      title: "OFW — Middle East",
      description:
        "Qatar, UAE, KSA. 5–10× local salary. UPDA exam for Qatar. POEA + PRC docs required.",
    },
    {
      title: "Government / DPWH infra",
      description:
        "Lower base but stable. BBB program projects give exposure. Government hospitalization, GSIS.",
    },
  ],
};

export const changeEmployerFlow: FlowDefinition = {
  id: "change-employer",
  fileNumber: 2,
  tag: "Kill Criteria — File 2 of 3",
  title: "Should I change employer or niche?",
  subtitle:
    "For engineers who have already tried once — is it the employer or the field? · r/civilengineer_ph",
  accent: "#818cf8",
  startNodeId: "start",
  nodes: {
    start: {
      type: "start",
      id: "start",
      title: "You've left or are leaving an employer",
      subtitle:
        "Now checking whether it's the company or a deeper pattern",
      next: "q1-pattern",
    },
    "q1-pattern": {
      type: "question",
      id: "q1-pattern",
      label: "Q1 — Pattern check",
      title: "Same problems at 2 or more firms?",
      subtitle:
        "Low pay, no growth, toxic culture — showing up repeatedly even after changing employers?",
      choices: [
        {
          id: "yes-pattern",
          label: "Yes — pattern",
          tone: "yes",
          next: "q2-passion",
        },
        {
          id: "no-better",
          label: "No — new firm is better",
          tone: "no",
          next: "q2b-checkin",
        },
      ],
    },
    "q2-passion": {
      type: "question",
      id: "q2-passion",
      label: "Q2 — Passion check",
      title: "Do you still care about the work itself?",
      subtitle:
        "Not the paycheck. The actual work: design, site, structures, estimation.",
      choices: [
        {
          id: "no-burned-out",
          label: "No — burned out",
          tone: "yes",
          next: "q3-exit-readiness",
        },
        {
          id: "yes-still-care",
          label: "Yes, still care",
          tone: "no",
          next: "q3b-root-cause",
        },
      ],
    },
    "q3-exit-readiness": {
      type: "question",
      id: "q3-exit-readiness",
      label: "Q3 — Exit readiness",
      title: "Do you have an exit option ready?",
      subtitle:
        "Skills for pivot, 6-month savings, OFW visa in process, or grad school funded?",
      choices: [
        {
          id: "yes-ready",
          label: "Yes, ready",
          tone: "yes",
          next: "outcome-leave-ce",
        },
        {
          id: "not-yet",
          label: "Not yet",
          tone: "no",
          next: "outcome-build-runway",
        },
      ],
    },
    "q3b-root-cause": {
      type: "question",
      id: "q3b-root-cause",
      label: "Q3b — Root cause",
      title: "What's actually wrong?",
      subtitle:
        "Wrong sector? Wrong specialization? Wrong region? The niche matters.",
      choices: [
        {
          id: "niche-switch",
          label: "Wrong niche or sector",
          tone: "neutral",
          next: "outcome-niche-switch",
        },
      ],
    },
    "q2b-checkin": {
      type: "question",
      id: "q2b-checkin",
      label: "Q2b — Check-in",
      title: "Are the key issues resolved here?",
      subtitle: "Salary fair, environment safe, some growth path visible?",
      choices: [
        {
          id: "yes-resolved",
          label: "Yes, resolved",
          tone: "yes",
          next: "outcome-build-here",
        },
        {
          id: "still-rough",
          label: "Still rough",
          tone: "no",
          next: "outcome-partial-improvement",
        },
      ],
    },
    "outcome-leave-ce": {
      type: "outcome",
      id: "outcome-leave-ce",
      variant: "exit",
      label: "Kill criterion met",
      title: "Leave CE entirely",
      subtitle: "Activate File 3. Plan the transition professionally.",
      handoff: {
        flowId: "leave-profession",
        label: "Continue to: Leave civil engineering entirely?",
      },
    },
    "outcome-build-runway": {
      type: "outcome",
      id: "outcome-build-runway",
      variant: "change",
      label: "Slow exit plan",
      title: "Build runway first",
      subtitle:
        "Upskill nights/weekends. Save 6 months. Then exit. Don't quit broke.",
    },
    "outcome-niche-switch": {
      type: "outcome",
      id: "outcome-niche-switch",
      variant: "change",
      label: "Niche / sector switch",
      title: "Try a different track",
      subtitle:
        "Private dev, infra, geotech, MEP, BIM consulting, or OFW. See niche guide below.",
      reference: nicheReference,
    },
    "outcome-build-here": {
      type: "outcome",
      id: "outcome-build-here",
      variant: "stay",
      label: "Stay — reset clock",
      title: "Build here",
      subtitle:
        "Write new kill criteria now. Set a 12–18 month checkpoint. Don't coast.",
    },
    "outcome-partial-improvement": {
      type: "outcome",
      id: "outcome-partial-improvement",
      variant: "change",
      label: "Partial improvement",
      title: "Give it 6 months max",
      subtitle:
        "Set a hard deadline. If the key issues aren't resolved by then → pattern confirmed.",
    },
  },
};

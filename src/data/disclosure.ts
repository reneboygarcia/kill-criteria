export type DisclosureSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const DISCLOSURE_LAST_UPDATED = "May 2026";

export const DISCLOSURE_SECTIONS: DisclosureSection[] = [
  {
    id: "purpose",
    title: "What this is",
    paragraphs: [
      "Kill Criteria is a free, community-built decision guide for civil engineers in the Philippines. It helps you think through career questions using Annie Duke's kill criteria framework from Quit.",
      "It is meant to organize your thinking — not to tell you what to do.",
    ],
  },
  {
    id: "not-advice",
    title: "Not professional advice",
    paragraphs: [
      "Nothing here is legal, financial, tax, immigration, licensure, or career counseling advice. Outcomes and reference material (salary ranges, niche notes, OFW checklists, and similar content) are general information only.",
      "Your situation is unique. For employment contracts, resignation, PRC matters, visas, or major financial moves, talk to qualified professionals before you act.",
      "Using this guide does not create any professional, fiduciary, or attorney-client relationship with the people who built or maintain it.",
    ],
  },
  {
    id: "accuracy",
    title: "Information may be incomplete or outdated",
    paragraphs: [
      "Market pay, employer norms, and regulatory rules change. Reference figures and examples are approximate snapshots, not guarantees of what you will earn, find, or experience.",
      "We do not warrant that any content is complete, current, or error-free. You are responsible for verifying facts that matter to your decision.",
    ],
  },
  {
    id: "your-decisions",
    title: "Your decisions are yours",
    paragraphs: [
      "You alone are responsible for choices you make — including staying, leaving, changing employers, changing niches, or leaving the profession.",
      "Past paths through this guide do not predict future results. Outcomes here are prompts for reflection, not prescriptions.",
    ],
  },
  {
    id: "no-affiliation",
    title: "No official affiliation",
    paragraphs: [
      "This tool is not affiliated with, endorsed by, or representative of the Professional Regulation Commission (PRC), the Department of Labor and Employment (DOLE), any government agency, employer, recruiter, or Reddit Inc.",
      "r/civilengineer_ph is credited as the community context; this site is an independent volunteer project unless otherwise stated.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    paragraphs: [
      "Progress through a flow may be saved in your browser's local storage so you can resume later. That data stays on your device; we do not operate user accounts or collect personal information through the app itself.",
      "This site is hosted on Vercel. Vercel may process standard server logs (such as IP address, browser type, and request metadata) under its own privacy policy. We do not receive or store those logs in the app.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "This guide is provided \"as is\" and \"as available,\" without warranties of any kind, express or implied.",
      "To the fullest extent permitted by applicable law, the authors, contributors, and maintainers disclaim liability for any direct, indirect, incidental, consequential, or special damages arising from your use of — or reliance on — this guide, including lost income, employment disputes, or missed opportunities.",
      "If you do not agree with these terms, please do not use the guide.",
    ],
  },
  {
    id: "credits",
    title: "Credits",
    paragraphs: [
      "Built and maintained by Fieldnotes (field-notes.dev) — a fellow Philippine civil engineer.",
      "Framework: Annie Duke, Quit — kill criteria as a decision tool.",
      "Community: r/civilengineer_ph.",
    ],
  },
];

export const DISCLOSURE_SUMMARY =
  "This guide is for reflection only. It is not legal, financial, immigration, or career advice. You are responsible for your own decisions.";

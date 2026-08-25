/* Project cohort data, transcribed directly from Section 1.3 of the First Edition
   (regional cohort summary, Phase 1 roster, and Phase 2 roster). Keep this file in
   sync with Section 1.3 if the underlying counts in the guide ever change. */

window.DTEG_REGIONS = [
  {
    name: "Upper West Region",
    region: "Upper West",
    intermediaries: 1,
    solutions: 1,
    note: "1 intermediary (Intermediary UW1) · 1 solution — Phase 2 only.",
    secondary: false
  },
  {
    name: "Upper East Region",
    region: "Upper East",
    intermediaries: 2,
    solutions: 3,
    note: "2 intermediaries (Intermediary N1, Intermediary U1) · 3 solutions — Phase 1 + Phase 2.",
    secondary: false
  },
  {
    name: "North East Region",
    region: "North East",
    intermediaries: 0,
    solutions: 2,
    note: "2 solutions (Phase 2), via Intermediary N1's Phase 2 role — see Section 1.3's note on region coding.",
    secondary: false
  },
  {
    name: "Northern Region",
    region: "Northern",
    intermediaries: 3,
    solutions: 8,
    note: "3 intermediaries (Intermediary N2, Intermediary N3, Intermediary N4) · 8 solutions — Phase 1 + Phase 2.",
    secondary: false
  },
  {
    name: "Ashanti Region",
    region: "Ashanti",
    intermediaries: 5,
    solutions: 11,
    note: "5 intermediaries (Intermediary A1–A5) · 11 solutions — Phase 1 + Phase 2.",
    secondary: false
  },
  {
    name: "Eastern Region",
    region: "Eastern",
    intermediaries: 3,
    solutions: 5,
    note: "3 intermediaries (Intermediary E1, Intermediary E2, Intermediary E3) · 5 solutions — Phase 1 + Phase 2.",
    secondary: false
  },
  {
    name: "Greater Accra (secondary site)",
    region: "Greater Accra",
    intermediaries: 0,
    solutions: 0,
    note: "Secondary testing site for Solution S11 (Intermediary A2), spanning Greater Kumasi and Greater Accra — not a separately coded region.",
    secondary: true
  }
];

window.DTEG_SOLUTIONS = [
  { code: "S1", phase: "Phase 1", region: "Upper East", field: "Order/logistics management", insight: "Login friction (password setup) was the single largest adoption blocker until simplified", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S2", phase: "Phase 1", region: "Northern", field: "Business management, invoicing", insight: "Provider's limited development capacity constrained how much co-creation feedback could be acted on", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S3", phase: "Phase 1", region: "Northern", field: "Business management (finance, customers)", insight: "—", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S4", phase: "Phase 1", region: "Northern", field: "Business communication (SMS)", insight: "Message templates mattered more than any other feature during busy trading periods", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S5", phase: "Phase 1", region: "Northern", field: "Loyalty/cashback", insight: "Dropped off before completion — see Section 1.3", evidence: "Full field evidence", status: "Discontinued", finalist: "" },
  { code: "S6", phase: "Phase 1", region: "Eastern", field: "Record-keeping and accounting", insight: "Unresolved bugs eroded first-time-user trust faster than any design flaw", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S7", phase: "Phase 1", region: "Eastern", field: "Inventory management (POS)", insight: "Accessibility improvements for differently-abled users improved usability for everyone", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S8", phase: "Phase 1", region: "Eastern", field: "Peer-to-peer funding / credit access", insight: "Multilingual testing (four languages) was what made findings representative", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S9", phase: "Phase 1", region: "Ashanti", field: "Agricultural e-commerce, cold storage", insight: "36.4% task failure rate on inventory updates, invisible without structured testing", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S10", phase: "Phase 1", region: "Ashanti", field: "SME management", insight: "Dropped off before completion — see Section 1.3", evidence: "Full field evidence", status: "Discontinued", finalist: "" },
  { code: "S11", phase: "Phase 1", region: "Ashanti", field: "Digital storefront / business management", insight: "Capability was not the barrier — relevance and accessibility were", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "S12", phase: "Phase 1", region: "Ashanti", field: "Financial management", insight: "Not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "S13", phase: "Phase 1", region: "Ashanti", field: "AI chatbot, business communications", insight: "The project's one AI-enabled Phase 1 solution; not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "S14", phase: "Phase 1", region: "Ashanti", field: "Integrated communications platform", insight: "Not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "S15", phase: "Phase 1", region: "Ashanti", field: "Business management, e-commerce visibility", insight: "Not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "S16", phase: "Phase 1", region: "Ashanti", field: "Business management", insight: "Not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "S17", phase: "Phase 1", region: "Ashanti", field: "Data management, analytics/reporting", insight: "Not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "S18", phase: "Phase 1", region: "Northern", field: "Mobile money / digital payments", insight: "Dropped off; not documented beyond name, region, and status", evidence: "Roster only", status: "Discontinued", finalist: "" },
  { code: "P1", phase: "Phase 2", region: "Upper East", field: "E-commerce marketplace (artisans)", insight: "Fraud on informal channels (WhatsApp) was deeper and more damaging than the team expected", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "P2", phase: "Phase 2", region: "Upper East", field: "Veterinary service booking", insight: "Guaranteed arrival time mattered more to adoption than any app feature", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "P3", phase: "Phase 2", region: "Ashanti", field: "Voice-enabled bookkeeping", insight: "Voice input, originally a secondary feature, became the most-valued feature in testing", evidence: "Full field evidence", status: "Active", finalist: "2nd place" },
  { code: "P4", phase: "Phase 2", region: "Ashanti", field: "USSD veterinary service requests", insight: "Years of no-shows had normalized unsafe self-medication; trust, not features, is the binding constraint", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "P5", phase: "Phase 2", region: "Northern", field: "Milestone-based crowdfunding", insight: "5% platform fee tested well specifically because it was compared to 40–60% informal lending rates", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "P6", phase: "Phase 2", region: "Northern", field: "Digital savings groups (susu)", insight: "Unprompted demand for pooled, return-generating group investment, beyond the original scope", evidence: "Full field evidence", status: "Active", finalist: "3rd place" },
  { code: "P7", phase: "Phase 2", region: "Northern", field: "Simple bookkeeping (low digital literacy)", insight: "Deliberately minimal design proved the concept, then immediately generated demand for more features", evidence: "Full field evidence", status: "Active", finalist: "" },
  { code: "P8", phase: "Phase 2", region: "Upper West", field: "On-demand agro-services platform", insight: "Connects smallholder farmers to agro services; not documented beyond this", evidence: "Roster only", status: "Active", finalist: "Finalist" },
  { code: "P9", phase: "Phase 2", region: "North East", field: "Mobile money fraud verification", insight: "Real-time verification of MoMo recipients before sending; not documented beyond this", evidence: "Roster only", status: "Active", finalist: "Finalist" },
  { code: "P10", phase: "Phase 2", region: "Eastern", field: "AI-enabled financial record-keeping", insight: "Not documented beyond name, region, and status", evidence: "Roster only", status: "Active", finalist: "" },
  { code: "P11", phase: "Phase 2", region: "Eastern", field: "Embedded insurance, micro-pension and advisory (AI-supported)", insight: "Validated with 500+ women farmers: bundling raised willingness to contribute, and AI works out of sight behind USSD, SMS and voice", evidence: "Full field evidence", status: "Active", finalist: "1st place" },
  { code: "P12", phase: "Phase 2", region: "North East", field: "Farmer-to-market digital solution", insight: "Reduces post-harvest losses; not documented beyond this", evidence: "Roster only", status: "Active", finalist: "Finalist" }
];

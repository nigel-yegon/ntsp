// app/components/expatriate/steps.ts
import type { PermitClass, StepId } from "./form-context";

export type DocumentSlot = {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  /** Accept attribute for the file input. */
  accept?: string;
  /** Max size in MB. */
  maxSizeMb?: number;
  /** Show only for these permit classes. Undefined = all. */
  permitClasses?: PermitClass[];
  /** Show only for renewals (or first applications). */
  renewalOnly?: boolean;
  firstApplicationOnly?: boolean;
};

export type StepDefinition = {
  id: StepId;
  title: string;
  description: string;
  /** Slots rendered on this step. Empty array for non-document steps. */
  slots: DocumentSlot[];
};

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: "applicant",
    title: "Applicant details",
    description: "Your personal and contact information.",
    slots: [],
  },
  {
    id: "purpose",
    title: "Purpose & supporting letter",
    description:
      "Upload your passport copy and the letter addressed to the Principal Secretary, Ministry of Tourism and Wildlife.",
    slots: [
      {
        id: "passport",
        label: "Valid passport",
        description: "Bio-data page. PDF or image.",
        required: true,
        accept: "application/pdf,image/png,image/jpeg",
        maxSizeMb: 5,
      },
      {
        id: "purpose-letter",
        label: "Purpose-of-entry letter",
        description:
          "Addressed to the Principal Secretary, Ministry of Tourism and Wildlife.",
        required: true,
        accept: "application/pdf",
        maxSizeMb: 10,
      },
    ],
  },
  {
    id: "company",
    title: "Company & employer documents",
    description:
      "Documents relating to the sponsoring company or employer.",
    slots: [
      {
        id: "tourism-licence",
        label: "Tourism licence",
        description: "Copy of the current tourism licence.",
        required: true,
        accept: "application/pdf",
        maxSizeMb: 10,
      },
      {
        id: "certificate-incorporation",
        label: "Certificate of Incorporation",
        description: "First application only.",
        required: true,
        firstApplicationOnly: true,
        accept: "application/pdf",
        maxSizeMb: 10,
      },
      {
        id: "memorandum",
        label: "Memorandum & Articles of Association",
        description: "First application only.",
        required: true,
        firstApplicationOnly: true,
        accept: "application/pdf",
        maxSizeMb: 20,
      },
      {
        id: "cr12",
        label: "CR 12",
        description: "Current CR 12 for the company.",
        required: true,
        accept: "application/pdf",
        maxSizeMb: 10,
      },
      {
        id: "kra-compliance",
        label: "KRA tax compliance certificate",
        description: "Valid certificate.",
        required: true,
        accept: "application/pdf",
        maxSizeMb: 5,
      },
      {
        id: "tourism-fund",
        label: "Tourism Fund clearance",
        description: "For levy payers and renewals.",
        required: false,
        renewalOnly: true,
        accept: "application/pdf",
        maxSizeMb: 5,
      },
      {
        id: "audited-accounts",
        label: "Audited accounts",
        description: "Renewals only.",
        required: false,
        renewalOnly: true,
        accept: "application/pdf",
        maxSizeMb: 20,
      },
    ],
  },
  {
    id: "supporting",
    title: "Supporting documents",
    description:
      "Additional documents depending on the permit class you're applying for.",
    slots: [
      {
        id: "proof-of-capital",
        label: "Proof of capital for investment",
        description: "Minimum USD 100,000 per investor.",
        required: true,
        permitClasses: ["class-g"],
        accept: "application/pdf,image/png,image/jpeg",
        maxSizeMb: 10,
      },
      {
        id: "employee-profile",
        label: "Employee profile",
        description:
          "Details of all employees (citizen and non-citizen) with ID and passport numbers.",
        required: true,
        accept: "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        maxSizeMb: 10,
      },
      {
        id: "academic-qualifications",
        label: "Academic qualifications",
        description: "Notarised copies. Class D only.",
        required: true,
        permitClasses: ["class-d"],
        accept: "application/pdf",
        maxSizeMb: 20,
      },
      {
        id: "contract-offer",
        label: "Contract offer of employment",
        description: "Authored by the employer. Class D only.",
        required: true,
        permitClasses: ["class-d"],
        accept: "application/pdf",
        maxSizeMb: 10,
      },
      {
        id: "cv",
        label: "Comprehensive curriculum vitae",
        description: "With testimonials translated into English.",
        required: true,
        permitClasses: ["class-d"],
        accept: "application/pdf",
        maxSizeMb: 10,
      },
      {
        id: "understudy-proof",
        label: "Understudy proof",
        description:
          "Academic certificates, CV, ID copy, and contract of employment for the understudy.",
        required: true,
        permitClasses: ["class-d"],
        accept: "application/pdf",
        maxSizeMb: 20,
      },
    ],
  },
  {
    id: "review",
    title: "Review & submit",
    description: "Check your information before submitting.",
    slots: [],
  },
];

/** Slots filtered for the current application context. */
export function visibleSlots(
  step: StepDefinition,
  permitClass: PermitClass | "",
  isRenewal: boolean
): DocumentSlot[] {
  return step.slots.filter((slot) => {
    if (slot.permitClasses && !slot.permitClasses.includes(permitClass as PermitClass)) {
      return false;
    }
    if (slot.renewalOnly && !isRenewal) return false;
    if (slot.firstApplicationOnly && isRenewal) return false;
    return true;
  });
}
// append to app/components/expatriate/steps.ts
export const SLOT_LOOKUP: Record<string, DocumentSlot> = Object.fromEntries(
  STEP_DEFINITIONS.flatMap((step) => step.slots).map((slot) => [slot.id, slot])
);
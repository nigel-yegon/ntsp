// app/components/expatriate/form-context.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PermitClass = "class-g" | "class-d" | "special-pass";

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  /** Local File — present only for files picked this session. */
  file?: File;
  /** Present only for documents already saved server-side. */
  serverUrl?: string;
};

export type ApplicantDetails = {
  fullName: string;
  nationality: string;
  passportNumber: string;
  email: string;
  phone: string;
  permitClass: PermitClass | "";
  isRenewal: boolean;
};

export type StepId =
  | "applicant"
  | "purpose"
  | "company"
  | "supporting"
  | "review";

export type FormState = {
  applicationId: string | null;
  referenceNo: string | null;
  status: "DRAFT" | "SUBMITTED" | null;
  step: StepId;
  applicant: ApplicantDetails;
  documents: Record<string, UploadedFile[]>;
};

const STORAGE_KEY = "ntsp:expatriate-draft";

const initialState: FormState = {
  applicationId: null,
  referenceNo: null,
  status: null,
  step: "applicant",
  applicant: {
    fullName: "",
    nationality: "",
    passportNumber: "",
    email: "",
    phone: "",
    permitClass: "",
    isRenewal: false,
  },
  documents: {},
};

export type DraftPayload = {
  id: string;
  referenceNo: string;
  status: "DRAFT" | "SUBMITTED";
  applicant: ApplicantDetails;
  documents: {
    id: string;
    slotId: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    url: string;
  }[];
};

type ContextValue = {
  state: FormState;
  setApplicant: (patch: Partial<ApplicantDetails>) => void;
  addFiles: (slotId: string, files: File[]) => void;
  removeFile: (slotId: string, fileId: string) => void;
  setStep: (step: StepId) => void;
  loadDraft: (draft: DraftPayload) => void;
  markSaved: (payload: {
    id: string;
    referenceNo: string;
    status: "DRAFT" | "SUBMITTED";
  }) => void;
  reset: () => void;
};

const FormContext = createContext<ContextValue | null>(null);

export function ExpatriateFormProvider({
  children,
  initialDraft,
}: {
  children: ReactNode;
  initialDraft?: DraftPayload;
}) {
  const [state, setState] = useState<FormState>(initialState);

  useEffect(() => {
    if (initialDraft) {
      setState(stateFromDraft(initialDraft));
      return;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<FormState>;
      setState({
        ...initialState,
        step: parsed.step ?? "applicant",
        applicant: { ...initialState.applicant, ...parsed.applicant },
        documents: {},
      });
    } catch {
      /* ignore */
    }
  }, [initialDraft]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, documents: {} }),
      );
    } catch {
      /* ignore */
    }
  }, [state]);

  const setApplicant = useCallback((patch: Partial<ApplicantDetails>) => {
    setState((s) => ({ ...s, applicant: { ...s.applicant, ...patch } }));
  }, []);

  const addFiles = useCallback((slotId: string, files: File[]) => {
    setState((s) => {
      const existing = s.documents[slotId] ?? [];
      const mapped: UploadedFile[] = files.map((file) => ({
        id: `local-${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      }));
      return {
        ...s,
        documents: { ...s.documents, [slotId]: [...existing, ...mapped] },
      };
    });
  }, []);

  const removeFile = useCallback((slotId: string, fileId: string) => {
    setState((s) => {
      const existing = s.documents[slotId] ?? [];
      return {
        ...s,
        documents: {
          ...s.documents,
          [slotId]: existing.filter((f) => f.id !== fileId),
        },
      };
    });
  }, []);

  const setStep = useCallback((step: StepId) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const loadDraft = useCallback((draft: DraftPayload) => {
    setState(stateFromDraft(draft));
  }, []);

  const markSaved = useCallback(
    (payload: { id: string; referenceNo: string; status: "DRAFT" | "SUBMITTED" }) => {
      setState((s) => ({
        ...s,
        applicationId: payload.id,
        referenceNo: payload.referenceNo,
        status: payload.status,
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState(initialState);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ContextValue>(
    () => ({
      state,
      setApplicant,
      addFiles,
      removeFile,
      setStep,
      loadDraft,
      markSaved,
      reset,
    }),
    [state, setApplicant, addFiles, removeFile, setStep, loadDraft, markSaved, reset],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useExpatriateForm() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error(
      "useExpatriateForm must be used within ExpatriateFormProvider",
    );
  }
  return ctx;
}

function stateFromDraft(draft: DraftPayload): FormState {
  const documents: Record<string, UploadedFile[]> = {};
  for (const d of draft.documents) {
    if (!documents[d.slotId]) documents[d.slotId] = [];
    documents[d.slotId].push({
      id: d.id,
      name: d.fileName,
      size: d.sizeBytes,
      type: d.mimeType,
      serverUrl: d.url,
    });
  }
  return {
    applicationId: draft.id,
    referenceNo: draft.referenceNo,
    status: draft.status,
    step: "applicant",
    applicant: draft.applicant,
    documents,
  };
}
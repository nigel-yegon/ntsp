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
  file: File;
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
  step: StepId;
  applicant: ApplicantDetails;
  /** Keyed by document slot id, e.g. "passport", "tourism-licence". */
  documents: Record<string, UploadedFile[]>;
};

const STORAGE_KEY = "ntsp:expatriate-draft";

const initialState: FormState = {
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

type ContextValue = {
  state: FormState;
  setApplicant: (patch: Partial<ApplicantDetails>) => void;
  addFiles: (slotId: string, files: File[]) => void;
  removeFile: (slotId: string, fileId: string) => void;
  setStep: (step: StepId) => void;
  reset: () => void;
};

const FormContext = createContext<ContextValue | null>(null);

export function ExpatriateFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<FormState>(initialState);

  // Restore draft on mount. Files can't be serialized, so we only
  // restore metadata and drop the actual File objects — user re-picks.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FormState;
        setState({
          ...initialState,
          step: parsed.step ?? "applicant",
          applicant: { ...initialState.applicant, ...parsed.applicant },
          documents: {}, // files don't survive serialization
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist on change (files excluded).
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, documents: {} })
      );
    } catch {
      // ignore
    }
  }, [state]);

  const setApplicant = useCallback((patch: Partial<ApplicantDetails>) => {
    setState((s) => ({ ...s, applicant: { ...s.applicant, ...patch } }));
  }, []);

  const addFiles = useCallback((slotId: string, files: File[]) => {
    setState((s) => {
      const existing = s.documents[slotId] ?? [];
      const mapped: UploadedFile[] = files.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
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

  const reset = useCallback(() => {
    setState(initialState);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<ContextValue>(
    () => ({ state, setApplicant, addFiles, removeFile, setStep, reset }),
    [state, setApplicant, addFiles, removeFile, setStep, reset]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useExpatriateForm() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error(
      "useExpatriateForm must be used within ExpatriateFormProvider"
    );
  }
  return ctx;
}
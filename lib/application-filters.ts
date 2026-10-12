// lib/application-filters.ts
import type {
  ApplicationStatus,
  ApplicationType,
  PermitClass,
} from "@/lib/db-types";

export const PAGE_SIZES = [10, 25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export type ApplicationFilters = {
  q: string;
  status: ApplicationStatus | "";
  permitClass: PermitClass | "";
  applicationType: ApplicationType | "";
  companyId: string;
  from: string; // ISO date or ""
  to: string;
  page: number;
  pageSize: PageSize;
};

const VALID_STATUSES = new Set<ApplicationStatus>([
  "DRAFT",
  "SUBMITTED",
  "UNDER_PERUSAL",
  "UNDER_VERIFICATION",
  "AWAITING_COMMITTEE",
  "COMMITTEE_APPROVED",
  "COMMITTEE_DECLINED",
  "AWAITING_PS_APPROVAL",
  "PS_APPROVED",
  "PS_DECLINED",
  "WITHDRAWN",
  "FORWARDED_TO_INTERIOR",
]);

const VALID_PERMIT_CLASSES = new Set<PermitClass>([
  "CLASS_G",
  "CLASS_D",
  "SPECIAL_PASS",
]);

const VALID_APPLICATION_TYPES = new Set<ApplicationType>([
  "FIRST_APPLICATION",
  "RENEWAL",
]);

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>
): ApplicationFilters {
  const get = (key: string): string => {
    const v = searchParams[key];
    if (Array.isArray(v)) return v[0] ?? "";
    return v ?? "";
  };

  const rawPageSize = Number(get("pageSize"));
  const pageSize: PageSize = (PAGE_SIZES as readonly number[]).includes(
    rawPageSize
  )
    ? (rawPageSize as PageSize)
    : 25;

  const rawPage = Number(get("page"));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const status = get("status");
  const permitClass = get("permitClass");
  const applicationType = get("applicationType");

  return {
    q: get("q").trim(),
    status: VALID_STATUSES.has(status as ApplicationStatus)
      ? (status as ApplicationStatus)
      : "",
    permitClass: VALID_PERMIT_CLASSES.has(permitClass as PermitClass)
      ? (permitClass as PermitClass)
      : "",
    applicationType: VALID_APPLICATION_TYPES.has(
      applicationType as ApplicationType
    )
      ? (applicationType as ApplicationType)
      : "",
    companyId: get("companyId").trim(),
    from: get("from").trim(),
    to: get("to").trim(),
    page,
    pageSize,
  };
}

export function toQueryString(
  filters: Partial<ApplicationFilters>
): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.permitClass) params.set("permitClass", filters.permitClass);
  if (filters.applicationType)
    params.set("applicationType", filters.applicationType);
  if (filters.companyId) params.set("companyId", filters.companyId);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  if (filters.pageSize && filters.pageSize !== 25)
    params.set("pageSize", String(filters.pageSize));
  const s = params.toString();
  return s ? `?${s}` : "";
}
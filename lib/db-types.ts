// lib/db-types.ts  — insert in alphabetical position
export type {
  Account,
  Accommodation,
  Application,
  ApplicationEvent,
  ApplicationStatus,
  ApplicationType,
  Assignment,
  AssignmentRole,
  Attraction,
  Booking,
  BookingStatus,
  BusinessProfile,
  BusinessVerification,
  CommitteeVote,
  Company,
  Destination,
  Document,
  DocumentReviewStatus,
  Event,
  EventType,
  Incident,              // ← new
  IncidentAttachment,    // ← new
  IncidentCategory,      // ← new
  IncidentStatus,        // ← new
  Message,
  MessageThread,
  PermitClass,
  Post,
  Role,
  ThreadSubject,
  TourPackage,
  User,
  VoteDecision,
} from "./generated/prisma/client";
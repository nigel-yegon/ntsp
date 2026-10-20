// lib/db-types.ts  — insert in alphabetical position
// export type Role =
//   | "EMPLOYER"
//   | "CUSTOMER"
//   | "BUSINESS"
//   | "OPERATOR"
//   | "PERUSER"
//   | "VERIFIER"
//   | "COMMITTEE_MEMBER"
//   | "PERMANENT_SECRETARY"
//   | "ADMIN";

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
  Incident,              
  IncidentAttachment,    
  IncidentCategory,      
  IncidentStatus, 
  InvestorInquiry, 
  InvestorType,
  InvestmentInterest,
  InvestmentScale,
  InquiryStatus,       
  Message,
  MessageThread,
  PermitClass,
  Post,
  Resource,
  ResourceCategory,
  Role,
  ThreadSubject,
  TourPackage,
  User,
  VoteDecision,
} from "./generated/prisma/client";
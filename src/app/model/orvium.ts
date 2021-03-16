import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';

export enum PUBLICATION_TYPE {
  book = 'book',
  bookSection = 'book section',
  conferencePaper = 'conference paper',
  article = 'article',
  patent = 'patent',
  preprint = 'preprint',
  report = 'report',
  softwareDocumentation = 'software documentation',
  thesis = 'thesis',
  technicalNote = 'technical note',
  workingPaper = 'working paper',
  policyReport = 'policy report',
  registeredReport = 'registered report',
  proposal = 'proposal',
  reviewArticle = 'review article',
  video = 'video',
  other = 'other'
}

export enum ACCESS_RIGHT {
  CCBY = 'cc by',
  CCBYND = 'cc by-nd',
  CC0 = 'cc0'
}

export enum REVIEW_TYPE {
  openReview = 'open review',
  singleBlind = 'single blind',
  doubleBlind = 'double blind'
}

export enum DEPOSIT_STATUS {
  draft = 'draft',
  pendingApproval = 'pending approval',
  preprint = 'preprint',
  inReview = 'in review',
  published = 'published'
}

export enum INVITE_STATUS {
  pending = 'draft',
  accepted = 'accepted',
  rejected = 'rejected',
}

export enum REVIEW_STATUS {
  draft = 'draft',
  published = 'published'
}

export enum CREDIT_TYPE {
  methodology = 'methodology',
  conceptualization = 'conceptualization',
  software = 'software',
  validation = 'validation',
  formalAnalysis = 'formal analysis',
  investigation = 'investigation',
  resources = 'resources',
  dataCuration = 'data curation',
  writingOriginalDraft = 'writing original draft',
  writingReviewEditing = 'writing review and editing',
  visualization = 'visualization',
  supervision = 'supervision',
  projectAdministration = 'project administration',
  fundingAcquisition = 'funding acquisition',
}

export enum REVIEW_DECISION {
  accepted = 'accepted',
  minorRevision = 'minor revision',
  mayorRevision = 'mayor revision'
}

export enum USER_TYPE {
  student = 'student',
  medical = 'medical',
  business = 'business',
  researcher = 'researcher',
  citizen = 'citizen'
}

export class Deposit {
  _id: string;
  owner: string;
  title: string;
  abstract: string;
  publicationType: PUBLICATION_TYPE;
  accessRight: ACCESS_RIGHT;
  submissionDate?: string;
  publicationDate?: string;
  status: DEPOSIT_STATUS;
  peerReviews: PeerReview[];
  reviewType: REVIEW_TYPE;
  authors: Author[];
  transactions?: Record<string, TransactionResponse | TransactionReceipt>;
  publicationFile?: OrviumFile;
  files: OrviumFile[];
  gravatar?: string;
  keywords: string[];
  keccak256?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  disciplines?: string[];
  references?: Reference[];
  createdOn?: Date;
  version?: number;
  community?: Community;
  html?: string;
}

export class DepositsQuery {
  deposits: Deposit[];
  count: number;
}

export class Reference {
  reference: string;
  url: string;
}

export class Citation {
  apa: string;
}

export class Author {
  name: string;
  surname: string;
  email?: string;
  orcid?: string;
  credit?: CREDIT_TYPE[];
}

export class OrviumFile {
  filename: string;
  contentType: string;
  keccak256: string;
  contentLength: number;
}

export class Profile {
  starredDeposits?: string[];
  userId: string;
  isReviewer: boolean;
  isOnboarded: boolean;
  firstName?: string;
  lastName?: string;
  institution?: string;
  email?: string;
  emailConfirmed: boolean;
  orcid?: string;
  userType: string;
  disciplines: string[];
  aboutMe?: string;
  gravatar?: string;
  blog?: string;
  role?: string;
  roles: string[];
  linkedin?: string;
  percentageComplete: number;
  inviteToken?: string;
  communities?: string[];
  simultaneousReviews?: number;
}

export class Institution {
  name: string;
  domain: string;
  country: string;
  city: string;
  synonym: string;
}

export class Discipline {
  name: string;
}

export class Domain {
  emailDomain: string;
}


export class PeerReview {
  _id: string;
  owner: string;
  author?: string;
  comments?: string;
  decision?: REVIEW_DECISION;
  file?: OrviumFile;
  transactions?: Record<string, TransactionResponse | TransactionReceipt>;
  url?: string;
  fileUrl?: string;
  status: REVIEW_STATUS;
  gravatar?: string;
  reward?: number;
  revealReviewerIdentity?: boolean;
  deposit: Deposit;
  creationDate: string;
  publicationDate: string;
  wasInvited?: boolean;
}

export class Network {
  name: string;
  networkId: number;
  displayName: string;
  tokenAddress: string;
  escrowAddress: string;
  appAddress: string;
  explorerUrl: string;
}

export class AppNotification {
  _id: string;
  title: string;
  body: string;
  icon: string;
  date: Date;
  isRead: boolean;
  action: string;
}

export class Invite {
  _id: string;
  inviteType: string;
  status: string;
  deadline: Date;
  sender: string;
  addressee: string;
  createdOn: Date;
  data: unknown;
}

export const PUBLICATION_TYPE_LOV = [
  // { value: PUBLICATION_TYPE.book, viewValue: 'Book' },
  // { value: PUBLICATION_TYPE.bookSection, viewValue: 'Book section' },
  { value: PUBLICATION_TYPE.conferencePaper, viewValue: 'Conference paper' },
  { value: PUBLICATION_TYPE.article, viewValue: 'Research article' },
  // { value: PUBLICATION_TYPE.patent, viewValue: 'Patent' },
  { value: PUBLICATION_TYPE.preprint, viewValue: 'Preprint' },
  { value: PUBLICATION_TYPE.report, viewValue: 'Research report' },
  { value: PUBLICATION_TYPE.softwareDocumentation, viewValue: 'Software documentation' },
  // { value: PUBLICATION_TYPE.thesis, viewValue: 'Thesis' },
  { value: PUBLICATION_TYPE.technicalNote, viewValue: 'Method paper' },
  // { value: PUBLICATION_TYPE.workingPaper, viewValue: 'Working paper' },
  { value: PUBLICATION_TYPE.policyReport, viewValue: 'Policy report' },
  { value: PUBLICATION_TYPE.registeredReport, viewValue: 'Registered report' },
  { value: PUBLICATION_TYPE.proposal, viewValue: 'Research proposal' },
  { value: PUBLICATION_TYPE.reviewArticle, viewValue: 'Review article' },
  { value: PUBLICATION_TYPE.video, viewValue: 'Video abstract' },
  { value: PUBLICATION_TYPE.other, viewValue: 'Other' },
];

export const ACCESS_RIGHT_LOV = [
  { value: 'cc0', viewValue: 'CC0' },
  { value: 'cc by', viewValue: 'CC BY' },
  { value: 'cc by-nd', viewValue: 'CC BY-ND' },
];

export const DEPOSIT_STATUS_LOV = [
  { value: DEPOSIT_STATUS.draft, viewValue: 'Draft' },
  { value: DEPOSIT_STATUS.pendingApproval, viewValue: 'Pending approval' },
  { value: DEPOSIT_STATUS.preprint, viewValue: 'Preprint' },
  { value: DEPOSIT_STATUS.inReview, viewValue: 'In review' },
  { value: DEPOSIT_STATUS.published, viewValue: 'Published' },
];

export const REVIEW_TYPE_LOV = [
  {
    value: 'open review',
    viewValue: 'Open Review',
    description: 'Authors and reviewers know each others names'
  },
  {
    value: 'single blind',
    viewValue: 'Single Blind',
    description: 'The authors do not know who the reviewers are but the reviewers know who the authors are'
  },
  {
    value: 'double blind',
    viewValue: 'Double Blind',
    description: 'Neither authors nor reviewers know each others names'
  }
];

export const CREDIT_LOV = [
  {
    value: CREDIT_TYPE.conceptualization,
    viewValue: 'Conceptualization',
    description: 'Ideas; formulation or evolution of overarching research goals and aims'
  },
  {
    value: CREDIT_TYPE.methodology,
    viewValue: 'Methodology',
    description: 'Development or design of methodology; creation of models'
  },
  {
    value: CREDIT_TYPE.software,
    viewValue: 'Software',
    description: 'Programming, software development; designing computer programs; ' +
      'implementation of the computer code and supporting algorithms; testing of existing code components'
  },
  {
    value: CREDIT_TYPE.validation,
    viewValue: 'Validation',
    description: 'Verification, whether as a part of the activity or separate, of the overall replication/ reproducibility ' +
      'of results/experiments and other research outputs'
  },
  {
    value: CREDIT_TYPE.formalAnalysis,
    viewValue: 'Formal analysis',
    description: 'Application of statistical, mathematical, computational, or other formal techniques to analyze or synthesize study data'
  },
  {
    value: CREDIT_TYPE.investigation,
    viewValue: 'Investigation',
    description: 'Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection'
  },
  {
    value: CREDIT_TYPE.resources,
    viewValue: 'Resources',
    description: 'Provision of study materials, reagents, materials, patients, laboratory samples, animals, instrumentation, ' +
      'computing resources, or other analysis tools'
  },
  {
    value: CREDIT_TYPE.dataCuration,
    viewValue: 'Data Curation',
    description: 'Management activities to annotate (produce metadata), scrub data and maintain research data ' +
      '(including software code, where it is necessary for interpreting the data itself) for initial use and later reuse'
  },
  {
    value: CREDIT_TYPE.writingOriginalDraft,
    viewValue: 'Writing - Original Draft',
    description: 'Preparation, creation and/or presentation of the published work, specifically writing the initial draft ' +
      '(including substantive translation)'
  },
  {
    value: CREDIT_TYPE.writingReviewEditing,
    viewValue: 'Writing - Review & Editing',
    description: 'Preparation, creation and/or presentation of the published work by those from the original research group, ' +
      'specifically critical review, commentary or revision – including pre-or postpublication stages'
  },
  {
    value: CREDIT_TYPE.visualization,
    viewValue: 'Visualization',
    description: 'Preparation, creation and/or presentation of the published work, specifically visualization/ data presentation'
  },
  {
    value: CREDIT_TYPE.supervision,
    viewValue: 'Supervision',
    description: 'Oversight and leadership responsibility for the research activity planning and execution, including mentorship ' +
      'external to the core team'
  },
  {
    value: CREDIT_TYPE.projectAdministration,
    viewValue: 'Project administration',
    description: 'Management and coordination responsibility for the research activity planning and execution'
  },
  {
    value: CREDIT_TYPE.fundingAcquisition,
    viewValue: 'Funding acquisition',
    description: 'Acquisition of the financial support for the project leading to this publication'
  },
];

export interface ReviewDecisionLov {
  value: REVIEW_DECISION;
  viewValue: string;
  description: string;
  icon: string;
  color: string;
}

export const REVIEW_DECISION_LOV: ReviewDecisionLov[] = [
  {
    value: REVIEW_DECISION.accepted,
    viewValue: 'Accepted',
    description: 'The publication is ready to be published',
    icon: 'play_arrow',
    color: 'primary'
  },
  {
    value: REVIEW_DECISION.minorRevision,
    viewValue: 'Minor Revision Required',
    description: 'The publication needs some small changes to be published',
    icon: 'pause',
    color: 'accent'
  },
  {
    value: REVIEW_DECISION.mayorRevision,
    viewValue: 'Major Revision Required',
    description: 'The publication contains errors that must be corrected',
    icon: 'stop',
    color: 'warn'
  }
];

// **************************
// Community
// **************************

export class Community {
  _id: string;
  name: string;
  description: string;
  country: string;
  twitterURL: string;
  facebookURL: string;
  websiteURL: string;
  users: CommunityUser[];
  logoURL: string;
  guidelinesURL: string;
  acknowledgement: string;
}

export class CommunityUser {
  userId: string;
  role: string;
}

export enum COMMUNITY_ROLES {
  contributor = 'contributor',
}

export const COMMUNITY_ROLES_LOV = [
  {
    value: COMMUNITY_ROLES.contributor,
    viewValue: 'Contributor',
  },
];


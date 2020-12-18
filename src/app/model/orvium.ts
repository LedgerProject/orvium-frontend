import { TransactionReceipt, TransactionResponse } from 'ethers/providers';

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
  other = 'other'
}

export enum ACCESS_RIGHT {
  openAccess = 'open access'
}

export enum REVIEW_TYPE {
  openReview = 'open review',
  singleBlind = 'single blind',
  doubleBlind = 'double blind'
}

export enum DEPOSIT_STATUS {
  draft = 'draft',
  inReview = 'in review',
  published = 'published'
}

export enum REVIEW_STATUS {
  draft = 'draft',
  published = 'published'
}

export class Deposit {
  // tslint:disable-next-line:variable-name
  _id: ObjectId;
  owner: string;
  title: string;
  abstract: string;
  publicationType?: PUBLICATION_TYPE;
  accessRight?: ACCESS_RIGHT;
  publicationDate?: string;
  status?: DEPOSIT_STATUS;
  peerReviews?: PeerReview[];
  reviewType?: REVIEW_TYPE;
  authors?: string[];
  transactions?: Record<string, TransactionResponse | TransactionReceipt>;
  files?: OrviumFile[];
  gravatar?: string;
  keywords?: string[];
  keccak256?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  disciplines?: string[];
}

export class DepositsQuery {
  deposits: Deposit[];
  count: number;
}

export class ObjectId {
  $oid: string;
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
  userType?: string;
  disciplines?: string[];
  aboutMe?: string;
  gravatar?: string;
  birthdate?: string;
  blog?: string;
  role?: string;
  linkedin?: string;
  percentageComplete?: number;
}

export class Institution {
  name: string;
  domain: string;
  country: string;
  city: string;
  synonym: string;
}

export class PeerReview {
  // tslint:disable-next-line:variable-name
  _id: ObjectId;
  owner: string;
  author: string;
  comments: string;
  file?: OrviumFile;
  transactions?: Record<string, TransactionResponse | TransactionReceipt>;
  url?: string;
  fileUrl?: string;
  status?: REVIEW_STATUS;
  gravatar?: string;
  reward?: number;
  revealReviewerIdentity?: boolean;
  deposit?: ObjectId;
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
  // tslint:disable-next-line:variable-name
  _id: ObjectId;
  title: string;
  body: string;
  icon: string;
  date: Date;
  isRead: boolean;
  action: string;
}

export const PUBLICATION_TYPE_LOV = [
  { value: PUBLICATION_TYPE.book, viewValue: 'Book' },
  { value: PUBLICATION_TYPE.bookSection, viewValue: 'Book section' },
  { value: PUBLICATION_TYPE.conferencePaper, viewValue: 'Conference paper' },
  { value: PUBLICATION_TYPE.article, viewValue: 'Journal article' },
  { value: PUBLICATION_TYPE.patent, viewValue: 'Patent' },
  { value: PUBLICATION_TYPE.preprint, viewValue: 'Preprint' },
  { value: PUBLICATION_TYPE.report, viewValue: 'Report' },
  { value: PUBLICATION_TYPE.softwareDocumentation, viewValue: 'Software documentation' },
  { value: PUBLICATION_TYPE.thesis, viewValue: 'Thesis' },
  { value: PUBLICATION_TYPE.technicalNote, viewValue: 'Technical note' },
  { value: PUBLICATION_TYPE.workingPaper, viewValue: 'Working paper' },
  { value: PUBLICATION_TYPE.other, viewValue: 'Other' }
];

export const ACCESS_RIGHT_LOV = [
  { value: 'open access', viewValue: 'Open Access' }
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


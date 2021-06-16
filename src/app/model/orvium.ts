import { COMMUNITY_TYPE, CREDIT_TYPE, DEPOSIT_STATUS, DepositDTO, PUBLICATION_TYPE, REVIEW_DECISION } from './api';

export class DepositsQuery {
  deposits!: DepositDTO[];
  count!: number;
}

export class TopDisciplinesQuery {
  _id!: string;
  count!: number;
}

export class Citation {
  apa!: string;
}

export const PUBLICATION_TYPE_LOV = [
  { value: PUBLICATION_TYPE.conferencePaper, viewValue: 'Conference paper' },
  { value: PUBLICATION_TYPE.article, viewValue: 'Research article' },
  { value: PUBLICATION_TYPE.preprint, viewValue: 'Preprint' },
  { value: PUBLICATION_TYPE.report, viewValue: 'Research report' },
  { value: PUBLICATION_TYPE.softwareDocumentation, viewValue: 'Software documentation' },
  { value: PUBLICATION_TYPE.technicalNote, viewValue: 'Method paper' },
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

export const DEPOSIT_STATUS_PUBLIC_LOV = [
  { value: DEPOSIT_STATUS.preprint, viewValue: 'Preprint' },
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

export enum COMMUNITY_ROLES {
  contributor = 'contributor',
}

export const COMMUNITY_ROLES_LOV = [
  {
    value: COMMUNITY_ROLES.contributor,
    viewValue: 'Contributor',
  },
];

export const COMMUNITY_TYPE_LOV = [
  {
    value: COMMUNITY_TYPE.university,
    viewValue: 'University',
  },
  {
    value: COMMUNITY_TYPE.business,
    viewValue: 'Business',
  },
];

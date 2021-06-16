import { DepositsQuery } from '../model/orvium';
import {
  ACCESS_RIGHT,
  CallForPapers,
  COMMUNITY_TYPE,
  CommunityDTO,
  DEPOSIT_STATUS,
  DepositDTO,
  FileMetadata,
  PUBLICATION_TYPE,
  REVIEW_DECISION,
  REVIEW_STATUS,
  REVIEW_TYPE,
  ReviewDTO,
  USER_TYPE,
  UserPrivateDTO,
  UserSummaryDTO
} from '../model/api';

export function profilePrivateTest(): UserPrivateDTO {
  return {
    userId: 'willian',
    email: 'test@orvium.io',
    userType: USER_TYPE.researcher,
    isReviewer: false,
    firstName: 'Willian',
    lastName: 'Wallace',
    isOnboarded: false,
    emailConfirmed: false,
    percentageComplete: 0,
    roles: [],
    disciplines: [],
    acceptedTC: true,
    communities: [],
    gravatar: '',
    nickname: 'will-123',
    actions: []
  };
}

export function profileSummaryTest(): UserSummaryDTO {
  return {
    userId: 'willian',
    firstName: 'Willian',
    lastName: 'Wallace',
    communities: [],
    gravatar: '',
    nickname: '',
  };
}

export function depositDraft(): DepositDTO {
  return {
    _id: '123412341234',
    nickname: 'nickname',
    owner: 'theowner',
    ownerProfile: profileSummaryTest(),
    title: 'the title',
    abstract: 'the abstract',
    comments: [],
    publicationType: PUBLICATION_TYPE.article,
    accessRight: ACCESS_RIGHT.CCBY,
    status: DEPOSIT_STATUS.draft,
    reviewType: REVIEW_TYPE.openReview,
    authors: [],
    peerReviews: [],
    keywords: [],
    publicationFile: {
      filename: 'file', contentType: 'pdf', contentLength: 1, tags: []
    },
    files: [{ filename: 'file', contentType: 'pdf', contentLength: 1, tags: [] }],
    canBeReviewed: true,
    actions: [],
    disciplines: []
  };
}

export function depositPublished(): DepositDTO {
  return {
    _id: '123412341234',
    nickname: 'nickname',
    owner: 'theowner',
    ownerProfile: profileSummaryTest(),
    title: 'the title',
    abstract: 'An abstract',
    comments: [],
    publicationType: PUBLICATION_TYPE.article,
    accessRight: ACCESS_RIGHT.CCBY,
    status: DEPOSIT_STATUS.published,
    reviewType: REVIEW_TYPE.openReview,
    authors: [],
    peerReviews: [],
    keywords: [],
    publicationFile: {
      filename: 'file', contentType: 'pdf', contentLength: 1, tags: []
    },
    files: [{ filename: 'file', contentType: 'pdf', contentLength: 1, tags: [] }],
    canBeReviewed: true,
    actions: [],
    disciplines: []
  };
}


export function fileTest(): FileMetadata {
  return {
    filename: 'file',
    contentType: 'image/png',
    contentLength: 21500,
    tags: []
  };
}

export function reviewDraft(): ReviewDTO {
  return {
    _id: '123412341234',
    deposit: depositPublished(),
    owner: 'theowner',
    ownerProfile: profileSummaryTest(),
    author: 'theauthor',
    decision: REVIEW_DECISION.accepted,
    comments: 'the comments',
    gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
    creationDate: '01/01/2020',
    publicationDate: '01/01/2020',
    status: REVIEW_STATUS.draft,
    revealReviewerIdentity: true,
    actions: []
  };
}

export function reviewPublished(): ReviewDTO {
  return {
    _id: '123412341234',
    deposit: depositPublished(),
    owner: 'theowner',
    ownerProfile: profileSummaryTest(),
    author: 'theauthor',
    decision: REVIEW_DECISION.accepted,
    comments: 'the comments',
    gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
    creationDate: '01/01/2020',
    publicationDate: '01/01/2020',
    status: REVIEW_STATUS.published,
    revealReviewerIdentity: true,
    actions: []
  };
}

export const depositsQueryTest: DepositsQuery = {
  deposits: [
    {
      _id: '123412341231',
      owner: 'theowner1',
      ownerProfile: profileSummaryTest(),
      nickname: 'nickname',
      authors: [{ name: 'John', surname: 'Doe' }, { name: 'William', surname: 'Wallace' }],
      title: 'the title1',
      abstract: 'the abstract1',
      comments: [],
      status: DEPOSIT_STATUS.published,
      reviewType: REVIEW_TYPE.openReview,
      gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
      publicationType: PUBLICATION_TYPE.article,
      accessRight: ACCESS_RIGHT.CCBY,
      peerReviews: [],
      keywords: [],
      files: [],
      canBeReviewed: true,
      actions: [],
      disciplines: []
    },
    {
      _id: '123412341232',
      owner: 'theowner1',
      ownerProfile: profileSummaryTest(),
      nickname: 'nickname',
      authors: [],
      title: 'the title2',
      abstract: 'the abstract2',
      comments: [],
      status: DEPOSIT_STATUS.inReview,
      reviewType: REVIEW_TYPE.openReview,
      gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
      publicationType: PUBLICATION_TYPE.article,
      accessRight: ACCESS_RIGHT.CCBY,
      peerReviews: [],
      keywords: [],
      files: [],
      canBeReviewed: true,
      actions: [],
      disciplines: []
    },
  ],
  count: 2
};

export function communityTest(): CommunityDTO {
  return {
    _id: '123412341234',
    name: 'Delft University of Technology (TU Delft)',
    description: 'Top education and research are at the heart of the oldest and largest technical university in the Netherlands. ' +
      'Our 8 faculties offer 16 bachelors and more than 30 masters programmes. ' +
      'Our more than 25,000 students and 6,000 employees share a fascination for science, design and technology. ' +
      'Our common mission: impact for a better society.',
    country: 'Delft, Netherlands',
    twitterURL: 'https://twitter.com/tudelft',
    facebookURL: 'https://www.facebook.com/TUDelft/',
    websiteURL: 'https://www.tudelft.nl/',
    users: [],
    logoURL: '',
    acknowledgement: '',
    guidelinesURL: '',
    type: COMMUNITY_TYPE.university,
    callForPapers: new CallForPapers(),
    actions: []
  };
}

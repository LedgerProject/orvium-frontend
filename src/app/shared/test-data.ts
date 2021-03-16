import { ACCESS_RIGHT, Deposit, DEPOSIT_STATUS, DepositsQuery, Profile, PUBLICATION_TYPE, REVIEW_TYPE } from '../model/orvium';

export const profileTest: Profile = {
  userId: 'antonio',
  email: 'test@orvium.io',
  userType: 'researcher',
  isReviewer: false,
  isOnboarded: false,
  emailConfirmed: false,
  percentageComplete: 0,
  roles: [],
  disciplines: []
};

export const depositDraft: Deposit = {
  _id: '123412341234',
  owner: 'theowner',
  title: 'the title',
  abstract: '',
  publicationType: PUBLICATION_TYPE.article,
  accessRight: ACCESS_RIGHT.CCBY,
  status: DEPOSIT_STATUS.draft,
  reviewType: REVIEW_TYPE.openReview,
  authors: [],
  peerReviews: [],
  keywords: [],
  files: []
};

export const depositsQueryTest: DepositsQuery = {
  deposits: [
    {
      _id: '123412341231',
      owner: 'theowner1',
      authors: [{ name: 'John', surname: 'Doe' }, { name: 'William', surname: 'Wallace' }],
      title: 'the title1',
      abstract: 'the abstract1',
      status: DEPOSIT_STATUS.published,
      reviewType: REVIEW_TYPE.openReview,
      gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
      publicationType: PUBLICATION_TYPE.article,
      accessRight: ACCESS_RIGHT.CCBY,
      peerReviews: [],
      keywords: [],
      files: []
    },
    {
      _id: '123412341232',
      owner: 'theowner1',
      authors: [],
      title: 'the title2',
      abstract: 'the abstract2',
      status: DEPOSIT_STATUS.inReview,
      reviewType: REVIEW_TYPE.doubleBlind,
      gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
      publicationType: PUBLICATION_TYPE.article,
      accessRight: ACCESS_RIGHT.CCBY,
      peerReviews: [],
      keywords: [],
      files: []
    },
  ],
  count: 2
};

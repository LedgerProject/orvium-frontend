import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { depositDraft, depositPublished, profilePrivateTest, reviewDraft, reviewPublished } from '../shared/test-data';
import { UserPrivateDTO } from '../model/api';

describe('ReviewService', () => {
  let service: ReviewService;
  let profile: UserPrivateDTO;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewService);
    profile = profilePrivateTest();
  });

  it('anyone should be able to read if published', () => {
    expect(service.canReadReview(undefined, reviewPublished())).toBeTrue();
  });

  it('author should be able to read, update and delete in draft', () => {
    const review = reviewDraft();
    review.owner = profile.userId;
    expect(service.canReadReview(profile, review)).toBeTrue();
    expect(service.canUpdateReview(profile, review)).toBeTrue();
    expect(service.canDeleteReview(profile, review)).toBeTrue();
  });

  it('admin should be able to create, read, update and remove in any status', () => {
    profile.roles.push('admin');
    expect(service.canReadReview(profile, reviewDraft())).toBeTrue();
    expect(service.canUpdateReview(profile, reviewDraft())).toBeTrue();
    expect(service.canDeleteReview(profile, reviewDraft())).toBeTrue();
    expect(service.canCreateReview(profile, depositPublished())).toBeTrue();
  });

  it('if not logged should NOT be able to create, update, delete or read a draft', () => {
    expect(service.canReadReview(undefined, reviewDraft())).toBeFalse();
    expect(service.canUpdateReview(undefined, reviewDraft())).toBeFalse();
    expect(service.canDeleteReview(undefined, reviewDraft())).toBeFalse();
    expect(service.canCreateReview(undefined, depositPublished())).toBeFalse();
  });

  it('deposit owner should NOT be able to create a review', () => {
    const deposit = depositPublished();
    deposit.owner = profile.userId;
    expect(service.canCreateReview(profile, deposit)).toBeFalse();
  });

  it('a reviewer should be able to create a review', () => {
    profile.isReviewer = true;
    expect(service.canCreateReview(profile, depositPublished())).toBeTrue();
  });

  it('if its NOT a reviewer should NOT be able to create a review', () => {
    profile.isReviewer = false;
    expect(service.canCreateReview(profile, depositPublished())).toBeFalse();
  });

  it('if deposit is draft should NOT be able to create a review', () => {
    profile.isReviewer = true;
    expect(service.canCreateReview(profile, depositDraft())).toBeFalse();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

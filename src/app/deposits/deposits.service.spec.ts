import { TestBed } from '@angular/core/testing';
import { DepositsService } from './deposits.service';
import { communityTest, depositDraft, depositPublished, profilePrivateTest } from '../shared/test-data';
import { CommunityDTO, UserPrivateDTO } from '../model/api';

describe('DepositsService', () => {
  let service: DepositsService;
  let profile: UserPrivateDTO;
  let community: CommunityDTO;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepositsService);

    profile = profilePrivateTest();
    community = communityTest();

  });

  it('user should not be able to update deposit', () => {
    const deposit = depositDraft();
    deposit.actions = [];
    expect(service.canUpdateDeposit(deposit)).toBe(false);
  });

  it('user should be able to update deposit', () => {
    const deposit = depositDraft();
    deposit.actions = ['update'];
    expect(service.canUpdateDeposit(deposit)).toBeTrue();
  });

  it('author should be able to manage deposit', () => {
    const deposit = depositDraft();
    deposit.owner = profile.userId;
    expect(service.canManageDeposit(profile, deposit)).toBe(true);
  });

  it('moderator should be able to manage deposit', () => {
    const deposit = depositDraft();
    deposit.community = community;
    profile.roles.push(`moderator:${community._id}`);
    expect(service.canManageDeposit(profile, deposit)).toBeTrue();
  });

  it('admin should be able to manage deposit', () => {
    profile.roles.push('admin');
    expect(service.canManageDeposit(profile, depositDraft())).toBeTrue();
  });

  it('if its not the owner it should NOT be able to manage deposit', () => {
    profile.userId = '2';
    expect(service.canManageDeposit(profile, depositDraft())).toBeFalse();
  });

  it('moderator should be able to moderate deposit', () => {
    const deposit = depositPublished();
    deposit.community = community;
    profile.roles.push(`moderator:${community._id}`);
    expect(service.canModerateDeposit(profile, deposit)).toBe(true);
  });

  it('admin should be able to moderate deposit', () => {
    profile.roles.push('admin');
    expect(service.canModerateDeposit(profile, depositPublished())).toBe(true);
  });

  it('author should be able to invite reviewers', () => {
    const deposit = depositPublished();
    deposit.owner = profile.userId;
    expect(service.canInviteReviewers(profile, deposit)).toBeTrue();
  });

  it('admin should be able to invite reviewers', () => {
    profile.roles.push('admin');
    expect(service.canInviteReviewers(profile, depositPublished())).toBeTrue();
  });

  it('neither admin nor author should be able to invite reviewers', () => {
    profile.roles.push('admin');
    expect(service.canInviteReviewers(profile, depositDraft())).toBeFalse();
  });

  it('if its not the owner it should NOT be able to invite reviewers', () => {
    profile.userId = '2';
    expect(service.canInviteReviewers(profile, depositPublished())).toBeFalse();
  });

  it('admin and author should be able to create versions', () => {
    profile.roles.push('admin');
    expect(service.canCreateVersion(profile, depositPublished())).toBeTrue();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { AppCustomValidators } from './AppCustomValidators';
import { FormControl } from '@angular/forms';


describe('CustomValidators', () => {
  let validatorsClass: AppCustomValidators;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: []
    });
    validatorsClass = new AppCustomValidators();
  });

  it('should be created', () => {
    expect(validatorsClass).toBeTruthy();
  });

  it('should validate emails', () => {
    expect(AppCustomValidators.validateEmails(new FormControl('test@test.com'))).toEqual({ email: true });
  });

  it('should not validate email', () => {
    expect(AppCustomValidators.validateEmail(new FormControl('testtest.com'))).toEqual({ invalidEmail: 'Not a valid email address' });
  });

  it('should validate orcid', () => {
    expect(AppCustomValidators.validateOrcid(new FormControl('https://orcid.org/0000-0002-1825-0097'))).toEqual(null);
  });

  it('should validate twitter', () => {
    expect(AppCustomValidators.validateTwitter(new FormControl('https://twitter.com/orvium'))).toEqual(null);
  });

  it('should validate facebook', () => {
    expect(AppCustomValidators.validateFacebook(new FormControl('https://www.facebook.com/orvium.io/'))).toEqual(null);
  });
});

import { canOpenOverleaf } from './shared-functions';
import { AppCustomValidators } from './AppCustomValidators';
import { FormControl } from '@angular/forms';

describe('shared-function', () => {
  const pdfFile = canOpenOverleaf('test.pdf');
  const emails = AppCustomValidators.validateEmails(new FormControl(['test1@test.com', 'test2@test.com']));
  const invalidEmails = AppCustomValidators.validateEmails(new FormControl(['test1@test.com', 'test2test.com']));
  const email = AppCustomValidators.validateEmail(new FormControl('test@test.com'));
  const invalidEmail = AppCustomValidators.validateEmail(new FormControl('testtest.com'));
  const linkedin = AppCustomValidators.validateLinkedin(
    new FormControl('https://www.linkedin.com/in/sergio-rodríguez-hernández-0576b41a2'));
  const invalidLinkedin = AppCustomValidators.validateLinkedin(
    new FormControl('https://www.linkedin.com/sergio-rodríguez-hernández-0576b41a2'));
  const orcid = AppCustomValidators.validateOrcid(
    new FormControl('https://orcid.org/0000-0002-9079-5933'));
  const invalidOrcid = AppCustomValidators.validateOrcid(new FormControl('https://orcid.org/09-5933'));

  it('is not latex file', () => {
    expect(pdfFile).toBe(null);
  });

  it('should validate emails', () => {
    expect(emails).toBe(null);
  });

  it('should not validate emails', () => {
    expect(invalidEmails).toEqual({ email: true });
  });

  it('should validate email', () => {
    expect(email).toBe(null);
  });

  it('should not validate email', () => {
    expect(invalidEmail).toEqual({ invalidEmail: 'Not a valid email address' });
  });

  it('should validate linkedin', () => {
    expect(linkedin).toBe(null);
  });

  it('should not validate linkedin', () => {
    expect(invalidLinkedin).toEqual({ invalidLinkedIn: true });
  });

  it('should validate OrcidID', () => {
    expect(orcid).toEqual(null);
  });

  it('should not validate OrcidId', () => {
    expect(invalidOrcid).toEqual({ invalidORCID: true });
  });

});

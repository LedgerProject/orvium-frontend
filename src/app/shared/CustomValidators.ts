import { FormControl } from '@angular/forms';

export class CustomValidators {

  static validateEmails(c: FormControl) {
    const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    let inValid = null;
    c.value.forEach((item) => {
      if (!EMAIL_REGEXP.test(item)) {
        inValid = { email: true };
      }
    });
    return inValid;
  }

  static validateRequired(c: FormControl) {
    if (c.value.length === 0) {
      return { required: true };
    } else {
      return null;
    }
  }

  static validateEmail(c: FormControl) {
    const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (EMAIL_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidEmail: 'Not a valid email address' };
  }

  static validateLinkedin(c: FormControl) {
    const LINKEDIN_REGEXP = /^https:\/\/www\.linkedin\.com\/in\/\S+$/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (LINKEDIN_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidLinkedIn: true };
  }

  static validateOrcid(c: FormControl) {
    const ORCID_REGEXP = /^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (ORCID_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidORCID: true };
  }

}

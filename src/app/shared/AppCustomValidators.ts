import { FormControl } from '@angular/forms';

export class AppCustomValidators {

  static validateEmails(c: FormControl): { email: boolean } | null {
    // eslint-disable-next-line max-len
    const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    for (const item of c.value) {
      if (!EMAIL_REGEXP.test(item)) {
        return { email: true };
      }
    }
    return null;
  }

  static validateRequired(c: FormControl): { required: boolean } | null {
    if (c.value.length === 0) {
      return { required: true };
    } else {
      return null;
    }
  }

  static validateEmail(c: FormControl): { invalidEmail: string } | null {
    // eslint-disable-next-line max-len
    const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (EMAIL_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidEmail: 'Not a valid email address' };
  }

  static validateLinkedin(c: FormControl): { invalidLinkedIn: boolean } | null {
    const LINKEDIN_REGEXP = /^(https:\/\/)?www\.linkedin\.com\/in\/\S+$/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (LINKEDIN_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidLinkedIn: true };
  }

  static validateOrcid(c: FormControl): { invalidORCID: boolean } | null {
    const ORCID_REGEXP = /^(https:\/\/)?orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (ORCID_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidORCID: true };
  }

  static validateDOI(c: FormControl): { invalidDOI: boolean } | null {
    const DOI_REGEXP = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (DOI_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidDOI: true };
  }

  static validateTwitter(c: FormControl): { invalidTwitter: boolean } | null {
    const TWITTER_REGEXP = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (TWITTER_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidTwitter: true };
  }

  static validateFacebook(c: FormControl): { invalidFacebook: boolean } | null {
    const FACEBOOK_REGEXP = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (FACEBOOK_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidFacebook: true };
  }

  static url(control: FormControl): | { invalidUrl: boolean } | null {
    const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    if (control.value == null || control.value === '') {
      return null;
    }

    if (urlRegex.test(control.value)) {
      return null;
    }

    return { invalidUrl: true };
  };

  static gitHubURL(control: FormControl): | { invalidUrl: boolean } | null {
    const urlRegex = /https:\/\/github\.com\/.+$/i;

    if (control.value == null || control.value === '') {
      return null;
    }

    if (urlRegex.test(control.value)) {
      return null;
    }

    return { invalidUrl: true };
  };

  static validateIsNotBlank(c: FormControl): { invalidString: boolean } | null {
    const NOTBLANK_REGEXP = /.*\S.*/;

    if (c.value == null || c.value === '') {
      return null;
    }
    if (NOTBLANK_REGEXP.test(c.value)) {
      return null;
    }

    return { invalidString: true };
  }
}

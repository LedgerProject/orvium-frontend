export class Feedback {
  public description!: string;
  public email?: string;
  public screenshot?: string;
  public data?: unknown;
}

export enum FEEDBACK_TYPE {
  general = 'general',
  bug = 'bug',
  inappropriate = 'inappropriate',
  other = 'other',
}

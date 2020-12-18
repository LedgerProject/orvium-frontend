import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  AppNotification,
  Deposit,
  DEPOSIT_STATUS,
  DepositsQuery,
  Institution,
  Network,
  PeerReview,
  Profile,
  REVIEW_STATUS
} from '../model/orvium';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class OrviumService {

  networks: Network[] = [];
  deposits: Deposit[] = [];
  notifications: AppNotification[] = [];
  host: string;

  public profile = new BehaviorSubject<Profile>(null);

  constructor(private router: Router) {
    this.deposits = [
      {
        _id: { $oid: 'deposit1' },
        owner: 'myuserid',
        title: 'Big data analytics as a service infrastructure: challenges, desired properties and solutions',
        abstract: 'CERN’s accelerator complex generates a very large amount of data. A large volumen of heterogeneous data is constantly generated from control equipment and monitoring agents. These data must be stored and analysed. Over the decades, CERN’s researching and engineering teams have applied different approaches, techniques and technologies for this purpose. This situation has minimised the necessary collaboration and, more relevantly, the cross data analytics over different domains. These two factors are essential to unlock hidden insights and correlations between the underlying processes, which enable better and more efficient daily-based accelerator operations and more informed decisions. The proposed Big Data Analytics as a Service Infrastructure aims to: (1) integrate the existing developments; (2) centralise and standardise the complex data analytics needs for CERN’s research and engineering community; (3) deliver real-time, batch data analytics and information discovery capabilities; and (4) provide transparent access and Extract, Transform and Load (ETL), mechanisms to the various and mission-critical existing data repositories. This paper presents the desired objectives and properties resulting from the analysis of CERN’s data analytics requirements; the main challenges: technological, collaborative and educational and; potential solutions.',
        gravatar: '2e7854c294602808422223306eff0e33',
        peerReviews: []
      }
    ];
  }

  // *************************
  // Profile
  // *************************

  updateProfile(profile: Profile): Observable<Profile> {
    let tempProfile = this.profile.getValue();
    tempProfile = {
      ...tempProfile,
      ...profile
    };
    console.log(tempProfile);
    this.profile.next(tempProfile);
    return of(tempProfile);
  }

  getProfile(): Observable<Profile> {
    return this.profile.asObservable();
  }

  getProfileFromApi(): Observable<Profile> {
    const profile: Profile = {
      userId: 'myuserid',
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@orvium.io',
      isReviewer: true,
      isOnboarded: true,
      emailConfirmed: true,
      userType: 'student',
      starredDeposits: [],
      gravatar: '2e7854c294602808422223306eff0e33'
    };

    this.profile.next(profile);

    return of(profile);
  }

  initNetworks() {
    this.getAllNetworkConfigs().subscribe(networks => this.networks = networks);
  }

  getDeposit(id: string): Observable<Deposit> {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == id);
    return of(deposit);
  }

  getDeposits(query = '', page = 1, size = 10,
              drafts = 'no', starred = 'no', inReview = 'no'): Observable<DepositsQuery> {

    let filteredDeposits = this.deposits;
    if (query) {
      filteredDeposits = this.deposits.filter(deposit => JSON.stringify(deposit).includes(query));
    }


    const depositsQuery: DepositsQuery = {
      deposits: filteredDeposits,
      count: filteredDeposits.length
    };
    return of(depositsQuery);
  }

  createDeposit(payload: Deposit): Observable<Deposit> {
    payload = {
      ...payload,
      _id: { $oid: Math.random().toString(12) },
      owner: this.profile.getValue().userId,
      status: DEPOSIT_STATUS.draft,
      peerReviews: [],
      gravatar: this.profile.getValue().gravatar,
      disciplines: [],
      keywords: [],
      authors: []
    };
    this.deposits.push(payload);
    return of(payload);
  }


  updateDeposit(deposit: Deposit) {
    return of(deposit);
  }

  deleteDeposit(id: string) {
    this.deposits.forEach((item, index) => {
      if (item._id.$oid === id) {
        this.deposits.splice(index, 1);
      }
    });
    return of(this.deposits);
  }


  getPeerReviews(id: string): Observable<PeerReview[]> {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == id);
    return of(deposit.peerReviews);
  }

  // **************************
  // Deposit files
  // **************************

  deleteDepositFiles(depositId: string, fileId: string) {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == depositId);

    return of(deposit);
  }

  getAllNetworkConfigs(): Observable<Network[]> {
    return of([]);
  }

  getNetworkByName(networkName: string): Network {
    for (const network of this.networks) {
      if (network.name === networkName) {
        return network;
      }
    }
  }

  getNetworkConfig(networkId: number): Network {
    for (const network of this.networks) {
      if (network.networkId === networkId) {
        return network;
      }
    }
  }

  toggleDepositStar(id: string): Observable<Profile> {
    const profile = this.profile.getValue();
    if (profile.starredDeposits.includes(id)) {
      let index = profile.starredDeposits.indexOf(id);
      profile.starredDeposits.splice(index, 1);
    } else {
      profile.starredDeposits.push(id);
    }
    this.profile.next(profile);

    return of(profile);
  }

  // **************************
  // Peer Reviews
  // **************************
  extractReviews() {
    let reviews: PeerReview[] = [];
    for (const deposit of this.deposits) {
      reviews = reviews.concat(deposit.peerReviews);
    }

    return reviews;
  }

  getReviews(): Observable<PeerReview[]> {
    return of(this.extractReviews());
  }

  getPeerReview(depositId: string, reviewId: string): Observable<PeerReview> {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == depositId);
    let review = deposit.peerReviews.find(review => review._id.$oid == reviewId);
    return of(review);
  }

  createReview(depositId: string, payload: PeerReview): Observable<PeerReview> {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == depositId);
    payload = {
      ...payload,
      _id: { $oid: Math.random().toString(12) },
      owner: this.profile.getValue().userId,
      deposit: { $oid: deposit._id.$oid },
      status: REVIEW_STATUS.draft
    };
    deposit.peerReviews.push(payload);
    return of(payload);
  }

  updatePeerReview(depositId: string, peerReview: PeerReview) {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == depositId);
    let review = deposit.peerReviews.find(review => review._id.$oid == peerReview._id.$oid);
    review = peerReview;
    return of(review);
  }

  deleteReview(depositId: string, reviewId: string) {
    let deposit = this.deposits.find(deposit => deposit._id.$oid == depositId);
    let index = deposit.peerReviews.findIndex(review => review._id.$oid == reviewId);
    deposit.peerReviews.splice(index, 1);

    return of(deposit);
  }


  // *************************
  // Institutions
  // *************************

  getInstitutionByDomain(domain: string): Observable<Institution> {
    const institution: Institution = {
      domain: domain,
      city: 'Vitoria',
      country: 'Spain',
      name: 'Orvium',
      synonym: 'Orvium'
    };
    return of(institution);
  }

  // *************************
  // Notifications
  // *************************
  getNotifications(): Observable<AppNotification[]> {
    return of(this.notifications);
  }

  readNotification(notificationId: string) {
    let notification = this.notifications.find(notification => notification._id.$oid === notificationId);
    return of(notification);
  }

  login() {
    this.getProfileFromApi();
  }

  logout() {
    this.profile.next(null);
    this.router.navigate(['']);
  }
}

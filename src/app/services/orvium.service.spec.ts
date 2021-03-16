import { OrviumService } from './orvium.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { Deposit, DepositsQuery, PeerReview } from '../model/orvium';

import jsonDeposit from './deposit.json';
import jsonReview from './review.json';
import { environment } from '../../environments/environment';

describe('OrviumService', () => {
  let deposit: Deposit;
  let review: PeerReview;
  let orviumService: OrviumService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const newBaseUrl = environment.apiEndpoint;

  beforeEach(() => {
    deposit = JSON.parse(JSON.stringify(jsonDeposit));
    review = JSON.parse(JSON.stringify(jsonReview));

    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
      ]
    });

    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;

    httpClientSpy.get.and.returnValue(of(deposit));

    orviumService = new OrviumService(httpClientSpy);
  });

  it('should return a deposit', () => {
    httpClientSpy.get.and.returnValue(of(deposit));

    orviumService.getDeposit('id').subscribe(
      result => expect(result).toEqual(deposit, 'expected deposit'), fail);
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should return deposits', () => {
    const page = 1;
    const query = 'title';
    const params = new HttpParams()
      .set('page', page.toString())
      .set('query', query);
    const depositsQuery: DepositsQuery = {
      deposits: [deposit],
      count: 1
    };
    httpClientSpy.get.and.returnValue(of(depositsQuery));

    orviumService
      .getDeposits(query, page)
      .subscribe(deposits => expect(deposits).toEqual(depositsQuery, 'expected deposits'), fail);
    // TODO check this call
    // expect(httpClientSpy.get).toHaveBeenCalledWith(baseUrl, {params: params});
  });

  it('should create a deposit', () => {
    httpClientSpy.post.and.returnValue(of(deposit));

    orviumService.createDeposit(deposit).subscribe(result => expect(result).toEqual(deposit, 'created deposit'), fail);
    expect(httpClientSpy.post).toHaveBeenCalled();
  });

  it('should get reviews', () => {
    httpClientSpy.get.and.returnValue(of([review]));

    orviumService.getPeerReviews('id').subscribe(result => expect(result).toEqual([review], 'expected reviews'), fail);
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  // ******************
  // Deposits
  // ******************

  it('should update a deposit', () => {
    httpClientSpy.patch.and.returnValue(of(deposit));
    const url = `${newBaseUrl}/deposits/${deposit._id}`;

    orviumService.updateDeposit(deposit._id, { abstract: 'New abstract' }).subscribe(result => expect(result).toEqual(deposit), fail);
    expect(httpClientSpy.patch).toHaveBeenCalledWith(url, { abstract: 'New abstract' });
  });

  it('should delete a deposit', () => {
    httpClientSpy.delete.and.returnValue(of('true'));

    orviumService.deleteDeposit('depositId').subscribe(result => expect(result).toEqual('true'), fail);
    expect(httpClientSpy.delete).toHaveBeenCalled();
  });

  it('should delete deposit files', () => {
    httpClientSpy.delete.and.returnValue(of(deposit));

    orviumService.deleteDepositFiles('depositId', 'fileId').subscribe(result => expect(result).toEqual(deposit), fail);
    expect(httpClientSpy.delete).toHaveBeenCalled();
  });

  // ******************
  // Reviews
  // ******************

  it('should get a review', () => {
    httpClientSpy.get.and.returnValue(of(review));

    orviumService.getPeerReview('reviewId').subscribe(result => expect(result).toEqual(review), fail);
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should create a review', () => {
    httpClientSpy.post.and.returnValue(of(review));
    const url = `${newBaseUrl}/reviews`;

    orviumService.createReview(review).subscribe(result => expect(result).toEqual(review), fail);
    expect(httpClientSpy.post).toHaveBeenCalledWith(url, review);
  });

  it('should update a review', () => {
    httpClientSpy.patch.and.returnValue(of(review));
    const url = `${newBaseUrl}/reviews/${review._id}`;

    orviumService.updatePeerReview(review._id, review).subscribe(result => expect(result).toEqual(review), fail);
    delete review.file;
    expect(httpClientSpy.patch).toHaveBeenCalledWith(url, review);
  });

  it('should increase reviewer reward', () => {
    httpClientSpy.patch.and.returnValue(of(1));
    const url = `${newBaseUrl}/reviews/reviewId`;

    orviumService.updatePeerReview('reviewId', { reward: 100 }).subscribe(() => {
    }, fail);
    expect(httpClientSpy.patch).toHaveBeenCalledWith(url, { reward: 100 });
  });

  it('should delete a review', () => {
    httpClientSpy.delete.and.returnValue(of('deleted'));

    orviumService
      .deleteReview(review._id)
      .subscribe(result => expect(result).toEqual('deleted'), fail);
    expect(httpClientSpy.delete).toHaveBeenCalled();
  });
});

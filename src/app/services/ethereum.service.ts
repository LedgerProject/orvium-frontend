import { Injectable } from '@angular/core';
import PublicationManagement from '../../contracts/PublicationManagement.json';
import Escrow from '../../contracts/Escrow.json';
import Token from '../../contracts/OrviumToken.json';

import { MatSnackBar } from '@angular/material/snack-bar';
import { OrviumService } from './orvium.service';
import { Deposit, Network } from '../model/orvium';
import { timeout } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Contract, ethers } from 'ethers';
import { TransactionResponse, Web3Provider } from 'ethers/providers';
import { fromPromise } from 'rxjs/internal-compatibility';
import { NGXLogger } from 'ngx-logger';

declare global {
  interface Window {
    ethereum: any;
  }
}
const tokenDecimals = '000000000000000000';

@Injectable({ providedIn: 'root' })
export class EthereumService {
  public appContract: Contract;
  public escrowContract: Contract;
  public tokenContract: Contract;
  private ethereum: any;
  public networkConfig: Network;
  public isInitialized = false;
  currentNetwork = new BehaviorSubject<Network>(null);
  private provider: Web3Provider;


  constructor(private snackBar: MatSnackBar,
              private orviumService: OrviumService,
              private logger: NGXLogger) {

    if (window.ethereum) {
      this.ethereum = window.ethereum;
      this.ethereum.on('networkChanged', networkId => {
        document.location.reload();
      });
    }
  }

  public account: string;

  async init() {
    let accounts;
    this.isInitialized = false;
    localStorage.setItem('metamask', 'false');

    if (!this.isAvailable()) {
      this.snackBar.open('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!', null,
        { panelClass: ['info-snackbar'] });
      return false;
    }

    const promise = from(this.ethereum.enable()).pipe(
      timeout(10000)).toPromise();
    try {
      accounts = await promise;
    } catch (error) {
      console.warn(error);
      this.snackBar.open('Ethereum: Provider cannot be enabled', null, { panelClass: ['error-snackbar'] });
      return false;
    }

    try {
      this.provider = new ethers.providers.Web3Provider(this.ethereum);
      const network = await this.provider.getNetwork();
      this.networkConfig = await this.orviumService.getNetworkConfig(network.chainId);
      this.logger.debug('Blockchain Network', this.networkConfig);
      this.currentNetwork.next(this.networkConfig);
      const signer = this.provider.getSigner();

      this.appContract = new ethers.Contract(this.networkConfig.appAddress, PublicationManagement.abi, signer);
      this.escrowContract = new ethers.Contract(this.networkConfig.escrowAddress, Escrow.abi, signer);
      this.tokenContract = new ethers.Contract(this.networkConfig.tokenAddress, Token.abi, signer);

    } catch (error) {
      console.warn(error);
      this.snackBar.open('Ethereum: This network is not supported, please select another one', null,
        { panelClass: ['error-snackbar'] });
      return false;
    }


    if (accounts.length > 0) {
      this.account = accounts[0];
    } else {
      this.snackBar.open('Ethereum: ETH accounts not found', null, { panelClass: ['error-snackbar'] });
      return false;
    }

    this.isInitialized = true;
    localStorage.setItem('metamask', 'true');

    return true;
  }

  public close() {
    localStorage.setItem('metamask', 'false');
    this.isInitialized = false;
  }

  public isAvailable() {
    return !!(this.ethereum);
  }

  public isReady() {
    return this.isInitialized && this.ethereum._metamask.isUnlocked();
  }


  async getTokenBalance(deposit: Deposit) {
    if (!this.isReady()) {
      return;
    }

    const tx = await this.escrowContract.balance(
      this.account,
      '0x' + deposit._id.$oid);
    return tx;
  }

  getTokenAllowance(): Observable<number> {
    const allowance = this.tokenContract.allowance(
      this.account,
      this.networkConfig.escrowAddress);

    return fromPromise(allowance);
  }

  depositTokens(value, deposit: Deposit): Observable<TransactionResponse> {
    const tokens = Number(value);
    const orviumsEthFormat = value + tokenDecimals;

    return fromPromise(this.escrowContract.deposit(
      '0x' + deposit._id.$oid,
      orviumsEthFormat));
  }

  approveDepositTokens(value): Observable<TransactionResponse> {
    const orviumsEthFormat = value + tokenDecimals;

    return fromPromise(this.tokenContract.approve(
      this.networkConfig.escrowAddress,
      orviumsEthFormat
    ));
  }


  payReviewer(value, deposit: Deposit, reviewerAddress): Observable<TransactionResponse> {
    const tokens = Number(value);
    const orviumsEthFormat = value + tokenDecimals;

    return fromPromise(this.escrowContract.payment(
      '0x' + deposit._id.$oid,
      reviewerAddress,
      orviumsEthFormat));
  }

  publicationProofOwnership(keccak: string): Observable<TransactionResponse> {
    return fromPromise(this.appContract.addPublication(keccak, keccak, { gasLimit: 750000 }));
  }


  getUserTokenBalance(wallet, deposit: Deposit): Observable<number> {
    const balance = this.escrowContract.balance(
      wallet,
      '0x' + deposit._id.$oid);
    return fromPromise(balance);
  }

  getUserTokenAllowance(wallet): Observable<number> {
    const allowance = this.tokenContract.balanceOf(wallet);

    return fromPromise(allowance);
  }

}

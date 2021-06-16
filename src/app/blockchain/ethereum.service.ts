import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import PublicationManagement from 'src/contracts/PublicationManagement.json';
import Escrow from 'src/contracts/Escrow.json';
import Token from 'src/contracts/OrviumToken.json';
import { timeout } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { NGXLogger } from 'ngx-logger';
import { isPlatformBrowser } from '@angular/common';
import { BlockchainService } from './blockchain.service';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { Contract, Signer } from 'ethers';
import { AppSnackBarService } from '../services/app-snack-bar.service';
import { keccak256 } from 'ethers/lib.esm/utils';
import { BlockchainNetworkDTO, DepositDTO } from '../model/api';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}
const tokenDecimals = '000000000000000000';

@Injectable({ providedIn: 'root' })
export class EthereumService {
  public appContract?: Contract;
  public escrowContract?: Contract;
  public tokenContract?: Contract;
  public networkConfig?: BlockchainNetworkDTO;
  public isInitialized = false;
  currentNetwork = new BehaviorSubject<BlockchainNetworkDTO | undefined>(undefined);
  public account?: string;
  public isAvailable = new BehaviorSubject<boolean>(false);
  private provider?: Web3Provider;
  private signer?: Signer;
  private isPlatformBrowser = false;

  constructor(private snackBar: AppSnackBarService,
              private blockchainService: BlockchainService,
              private logger: NGXLogger,
              @Inject(PLATFORM_ID) private platformId: string) {
    this.isPlatformBrowser = isPlatformBrowser(platformId);
    if (this.isPlatformBrowser) {
      if (window.ethereum) {
        this.isAvailable.next(true);
      }
    }
  }

  async init(): Promise<boolean> {
    this.isInitialized = false;

    if (!this.isPlatformBrowser) {
      console.log('This is only available in browser');
      return false;
    }

    if (!window.ethereum) {
      console.log('Ethereum not detected in this browser');
      return false;
    }

    const promise = from(window.ethereum.enable()).pipe(
      timeout(20000)).toPromise();
    try {
      await promise;
    } catch (error) {
      console.warn(error);
      this.snackBar.error('Ethereum: Provider cannot be enabled');
      return false;
    }

    // lazy load ethers js library
    const ethers = await import('ethers');

    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    // The Metamask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    this.signer = this.provider.getSigner();
    this.account = await this.signer.getAddress();
    this.provider.on('networkChanged', (networkId: unknown) => {
      document.location.reload();
    });

    try {
      const network = await this.provider.getNetwork();
      const networkConfig = this.blockchainService.getNetworkConfig(network.chainId);
      this.networkConfig = networkConfig;
      if (!this.networkConfig) {
        this.snackBar.error('Ethereum: This network is not supported, please select another one');
        return false;
      }
      this.logger.debug('Blockchain Network', this.networkConfig);
      this.currentNetwork.next(this.networkConfig);
      this.signer = this.provider.getSigner();

      this.appContract = new ethers.Contract(this.networkConfig.appAddress, PublicationManagement.abi, this.signer);
      this.escrowContract = new ethers.Contract(this.networkConfig.escrowAddress, Escrow.abi, this.signer);
      this.tokenContract = new ethers.Contract(this.networkConfig.tokenAddress, Token.abi, this.signer);

    } catch (error) {
      console.warn(error);
      this.snackBar.error('Ethereum: This network is not supported, please select another one');
      return false;
    }

    this.isInitialized = true;
    localStorage.setItem('metamask', 'true');

    return true;
  }

  public close(): void {
    localStorage.setItem('metamask', 'false');
    this.isInitialized = false;
  }

  public isReady(): boolean {
    return this.isInitialized && window.ethereum._metamask.isUnlocked();
  }


  async getTokenBalance(deposit: DepositDTO): Promise<string> {
    if (!this.isReady()) {
      throw new Error('Ethereum service is not ready');
    }

    if (!this.escrowContract || !this.signer) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const tx = await this.escrowContract.balance(
      await this.signer.getAddress(),
      '0x' + deposit._id);
    return tx;
  }

  async getTokenAllowance(): Promise<number> {
    if (!this.tokenContract || !this.signer || !this.networkConfig) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const allowance = this.tokenContract.allowance(
      await this.signer.getAddress(),
      this.networkConfig.escrowAddress);

    return allowance;
  }

  depositTokens(value: string, deposit: DepositDTO): Observable<TransactionResponse> {
    if (!this.escrowContract) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const orviumsEthFormat = value + tokenDecimals;

    return fromPromise(this.escrowContract.deposit(
      '0x' + deposit._id,
      orviumsEthFormat));
  }

  approveDepositTokens(value: string): Observable<TransactionResponse> {
    if (!this.tokenContract || !this.networkConfig) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const orviumsEthFormat = value + tokenDecimals;

    return fromPromise(this.tokenContract.approve(
      this.networkConfig.escrowAddress,
      orviumsEthFormat
    ));
  }


  payReviewer(value: string, deposit: DepositDTO, reviewerAddress: string): Observable<TransactionResponse> {
    if (!this.escrowContract) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const orviumsEthFormat = value + tokenDecimals;

    return fromPromise(this.escrowContract.payment(
      '0x' + deposit._id,
      reviewerAddress,
      orviumsEthFormat));
  }

  publicationProofOwnership(keccak: string): Observable<TransactionResponse> {
    if (!this.appContract) {
      throw new Error('Ethereum service not initialized correctly');
    }

    return fromPromise(this.appContract.addPublication('0x' + keccak, '0x' + keccak, { gasLimit: 750000 }));
  }


  getUserTokenBalance(wallet: string, deposit: DepositDTO): Observable<number> {
    if (!this.escrowContract) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const balance = this.escrowContract.balance(
      wallet,
      '0x' + deposit._id);
    return fromPromise(balance);
  }

  getUserTokenAllowance(wallet: string): Observable<number> {
    if (!this.tokenContract) {
      throw new Error('Ethereum service not initialized correctly');
    }

    const allowance = this.tokenContract.balanceOf(wallet);
    return fromPromise(allowance);
  }

  hashFile(body: ArrayBuffer, hexPrefix = false): string {
    let hash = keccak256(new Uint8Array(body));
    if (!hexPrefix) {
      hash = hash.substring(2);
    }
    return hash;
  }

}

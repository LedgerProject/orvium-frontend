import { TestBed } from '@angular/core/testing';

import { BlockchainService } from './blockchain.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BlockchainNetworkDTO } from '../model/api';

describe('BlockchainService', () => {
  let service: BlockchainService;

  const networks: BlockchainNetworkDTO[] = [{
    name: 'ropsten',
    networkId: 3,
    displayName: 'Ropsten',
    tokenAddress: '0x45B89a627AF99DcCdF25a03F6f4986F55e9EB491',
    escrowAddress: '0x0C1FAB9103564258F7173f5849BcB433Cf5513B2',
    appAddress: '0x992419b34A8ec785E07842804878d6d799f8Eaac',
    explorerUrl: 'https://ropsten.etherscan.io/tx/'
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BlockchainService);
    service.networks = networks;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get ethereum network', () => {
    expect(service.getNetworkConfig(3)).toEqual(networks[0]);
  });
});

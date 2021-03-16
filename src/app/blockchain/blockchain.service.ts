import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Network } from '../model/orvium';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  networks: Network[];

  constructor(private http: HttpClient) {
  }

  initNetworks(): void {
    this.getAllNetworkConfigs().subscribe(networks => this.networks = networks);
  }

  getAllNetworkConfigs(): Observable<Network[]> {
    return this.http.get<Network[]>(`${environment.apiEndpoint}/blockchain`);
  }

  getNetworkByName(networkName: string): Network | null {
    for (const network of this.networks) {
      if (network.name === networkName) {
        return network;
      }
    }
    return null;
  }

  getNetworkConfig(networkId: number): Network | undefined {
    for (const network of this.networks) {
      if (network.networkId === networkId) {
        return network;
      }
    }
    return undefined;
  }
}

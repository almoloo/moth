import { Contract } from '@algorandfoundation/tealscript';

type profile = {
  titel: string;
  logo: string;
  description: string;
  url: string;
  loyaltyEnabled: boolean;
  loyaltyPercentage: uint64;
};

export class Moth extends Contract {
  defultPercentage = GlobalStateKey<uint64>();

  siteFee = GlobalStateKey<uint64>();

  createApplication(defultPercentage: uint64, siteFee: uint64): void {
    this.defultPercentage.value = defultPercentage;
    this.siteFee.value = siteFee;
  }

  GetSiteFee(): uint64 {
    return this.siteFee.value;
  }
}

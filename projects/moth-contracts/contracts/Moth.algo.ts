import { Contract } from '@algorandfoundation/tealscript';

type profile = {
  title: string;
  logo: string;
  description: string;
  url: string;
  loyaltyEnabled: boolean;
  loyaltyPercentage: uint64;
};

export class Moth extends Contract {
  defultPercentage = GlobalStateKey<uint64>();

  // in uAlgo
  siteFee = GlobalStateKey<uint64>();

  profiles = BoxMap<Address, profile>();

  createApplication(defultPercentage: uint64, siteFee: uint64): void {
    this.defultPercentage.value = defultPercentage;
    this.siteFee.value = siteFee;
  }

  // eslint-disable-next-line no-unused-vars
  getMBR(boxMBRPayment: PayTxn): uint64 {
    const preAppMBR = this.app.address.minBalance;
    this.profiles(this.txn.sender).value = {
      title: 'string',
      logo: 'string',
      description: 'string',
      url: 'string',
      loyaltyEnabled: true,
      loyaltyPercentage: 10,
    };
    const Mbr = this.app.address.minBalance - preAppMBR;
    this.profiles(this.txn.sender).delete();
    return Mbr;
  }

  CreateProfile(
    boxMBRPayment: PayTxn,
    title: string,
    logo: string,
    description: string,
    url: string,
    loyaltyEnabled: boolean,
    loyaltyPercentage: uint64
  ): profile {
    const preAppMBR = this.app.address.minBalance;
    this.profiles(this.txn.sender).value = {
      title: title,
      logo: logo,
      description: description,
      url: url,
      loyaltyEnabled: loyaltyEnabled,
      loyaltyPercentage: loyaltyPercentage,
    };

    // verifyTxn(boxMBRPayment, {
    //   receiver: this.app.address,
    //   amount: this.app.address.minBalance - preAppMBR,
    // });

    return this.profiles(this.txn.sender).value;
  }

  EditProfile(
    title: string,
    logo: string,
    description: string,
    url: string,
    loyaltyEnabled: boolean,
    loyaltyPercentage: uint64
  ): profile {
    assert(this.profiles(this.txn.sender).exists);
    this.profiles(this.txn.sender).value = {
      title: title,
      logo: logo,
      description: description,
      url: url,
      loyaltyEnabled: loyaltyEnabled,
      loyaltyPercentage: loyaltyPercentage,
    };

    return this.profiles(this.txn.sender).value;
  }

  GetSiteFee(): uint64 {
    return this.siteFee.value;
  }

  getProfile(address: Address): profile {
    assert(this.profiles(address).exists);
    const values = this.profiles(address).value;

    return values;
  }
}

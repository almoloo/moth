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

  /** Our payment fee in uAlgo */
  contractFee = GlobalStateKey<uint64>();

  /** Moth Royalty piont Token */
  royaltyPointToken = GlobalStateKey<AssetID>();

  contractBalance = GlobalStateKey<uint64>();

  profiles = BoxMap<Address, profile>();

  createApplication(defultPercentage: uint64, siteFee: uint64): void {
    this.defultPercentage.value = defultPercentage;
    this.contractFee.value = siteFee;
  }

  /** Ensure the caller is app creator */
  private OnlyCreator(): void {
    assert(this.app.creator === this.txn.sender);
  }

  CreateAsa(): AssetID {
    this.OnlyCreator();
    assert(!this.royaltyPointToken.exists);

    const createAsset = sendAssetCreation({
      configAssetName: 'Mathak',
      configAssetUnitName: 'MAK',
      configAssetTotal: 100000,
      configAssetDecimals: 0,
      configAssetClawback: this.app.address,
      configAssetManager: this.app.address,
    });

    this.royaltyPointToken.value = createAsset;

    return createAsset;
  }

  OptIn(optInTxn: AssetTransferTxn): boolean {
    // assert(this.royaltyPointToken.exists);

    verifyAssetTransferTxn(optInTxn, {
      sender: this.txn.sender,
      xferAsset: this.royaltyPointToken.value,
      assetAmount: 0,
      assetReceiver: this.txn.sender,
    });

    return this.txn.sender.isOptedInToAsset(this.royaltyPointToken.value);
  }

  CheckOptedIn(): boolean {
    return this.txn.sender.isOptedInToAsset(this.royaltyPointToken.value);
  }

  Gateway(payment: PayTxn, toAddress: Address, amount: uint64): void {
    assert(this.royaltyPointToken.exists);
    assert(this.profiles(toAddress).exists);
    this.txn.sender.isOptedInToAsset(this.royaltyPointToken.value);

    verifyTxn(payment, {
      amount: amount,
      receiver: this.app.address,
    });

    sendPayment({
      amount: amount,
      receiver: toAddress,
      sender: this.app.address,
    });

    sendAssetTransfer({
      xferAsset: this.royaltyPointToken.value,
      assetAmount: amount / 100,
      assetReceiver: this.txn.sender,
      sender: this.app.address,
    });
  }

  // eslint-disable-next-line no-unused-vars
  GetMBR(
    title: string,
    logo: string,
    description: string,
    url: string,
    loyaltyEnabled: boolean,
    loyaltyPercentage: uint64
  ): uint64 {
    if (this.profiles(this.txn.sender).exists) {
      this.profiles(this.app.address).value = this.profiles(this.txn.sender).value;
    }

    const preAppMBR = this.app.address.minBalance;
    this.profiles(this.app.address).value = {
      title: title,
      logo: logo,
      description: description,
      url: url,
      loyaltyEnabled: loyaltyEnabled,
      loyaltyPercentage: loyaltyPercentage,
    };

    if (preAppMBR > this.app.address.minBalance) {
      this.profiles(this.app.address).delete();
      return 0;
    }

    const Mbr = this.app.address.minBalance - preAppMBR;
    this.profiles(this.app.address).delete();
    return Mbr;
  }

  EditProfile(
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

    if (preAppMBR >= this.app.address.minBalance) {
      sendPayment({
        amount: preAppMBR - this.app.address.minBalance,
        receiver: this.txn.sender,
        sender: this.app.address,
      });
    } else {
      verifyTxn(boxMBRPayment, {
        receiver: this.app.address,
        amount: this.app.address.minBalance - preAppMBR,
      });
    }

    return this.profiles(this.txn.sender).value;
  }
}

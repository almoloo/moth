import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import algosdk from 'algosdk';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { algos, getOrCreateKmdWalletAccount } from '@algorandfoundation/algokit-utils';
import * as algokit from '@algorandfoundation/algokit-utils';
import { MothClient } from '../contracts/clients/MothClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: MothClient;

const defultPercentage: number = 5;
const siteFee: number = 1;
let tokenId: bigint | undefined;
let algod: algosdk.Algodv2;

describe('HelloWorld', () => {
  let sender: algosdk.Account;
  let creator: algosdk.Account;

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount, kmd } = fixture.context;
    const { algorand } = fixture;

    algod = algorand.client.algod;
    creator = testAccount;

    sender = await getOrCreateKmdWalletAccount(
      {
        name: 'tealscript-dao-sender',
        fundWith: algos(10000),
      },
      algod,
      kmd
    );

    appClient = new MothClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    await appClient.create.createApplication({ defultPercentage, siteFee });
  });

  test('create asset', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();
    const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      to: appAddress,
      amount: 200000,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });
    const signedTxn = ptxn.signTxn(creator.sk);
    const { txId } = await algod.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algod, txId, 4);

    const createAsa = await appClient.createAsa(
      {},
      {
        sendParams: {
          fee: algokit.microAlgos(2_000),
        },
      }
    );
    tokenId = createAsa.return?.valueOf();
  });

  test('get contract Fee', async () => {
    const getSiteFee = await appClient.getContractFee({});

    expect(getSiteFee.return?.valueOf()).toEqual(BigInt(siteFee));
  });

  test('getmbr', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();

    const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: appAddress,
      amount: 100000,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });

    const proposalFromMethod = await appClient.getMbr(
      { boxMBRPayment },
      { sender, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
    );
    expect(proposalFromMethod.return?.valueOf()).toBe(BigInt(34_900));
  });

  test('create profile', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();

    const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: appAddress,
      amount: 134_900,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });

    const newProfile = await appClient.createProfile(
      {
        boxMBRPayment,
        title: 'shop',
        logo: 'logo id',
        description: 'a site to sell',
        url: 'site url',
        loyaltyEnabled: true,
        loyaltyPercentage: 5,
      },
      { sender, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
    );

    expect(newProfile.return?.valueOf()).toStrictEqual([
      'shop',
      'logo id',
      'a site to sell',
      'site url',
      true,
      BigInt(5),
    ]);
  });

  test('edit Profile', async () => {
    const editProfile = await appClient.editProfile(
      {
        title: 'new shop',
        logo: 'logo id',
        description: 'a site to sell',
        url: 'site url',
        loyaltyEnabled: true,
        loyaltyPercentage: 5,
      },
      { sender, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
    );

    expect(editProfile.return?.valueOf()).toStrictEqual([
      'new shop',
      'logo id',
      'a site to sell',
      'site url',
      true,
      BigInt(5),
    ]);
  });

  test('get profile', async () => {
    const profile = await appClient.getProfile({
      address: sender.addr,
    });

    expect(profile.return?.valueOf()).toStrictEqual([
      'new shop',
      'logo id',
      'a site to sell',
      'site url',
      true,
      BigInt(5),
    ]);
  });
});

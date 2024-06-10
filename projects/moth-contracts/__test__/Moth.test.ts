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
        fundWith: algos(50000),
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
      amount: 3000000,
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

  test('create profile', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();

    const calculateMbr = await appClient.getMbr(
      {
        title: 'shopppppppppppppppppppppppppppppppppppppppppp',
        logo: 'logo id',
        description: 'a site to sell',
        url: 'site url',
        loyaltyEnabled: true,
        loyaltyPercentage: 5,
      },
      { sender, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
    );

    const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: appAddress,
      amount: BigInt(calculateMbr.return?.valueOf()!),
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });
    const newProfile = await appClient.editProfile(
      {
        boxMBRPayment,
        title: 'shopppppppppppppppppppppppppppppppppppppppppp',
        logo: 'logo id',
        description: 'a site to sell',
        url: 'site url',
        loyaltyEnabled: true,
        loyaltyPercentage: 5,
      },
      { sender, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
    );

    expect(newProfile.return?.valueOf()).toStrictEqual([
      'shopppppppppppppppppppppppppppppppppppppppppp',
      'logo id',
      'a site to sell',
      'site url',
      true,
      BigInt(5),
    ]);
  });

  test('edit profile', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();

    const calculateMbr = await appClient.getMbr(
      {
        title: 'shop',
        logo: 'logo id',
        description: 'a site to sell',
        url: 'site url',
        loyaltyEnabled: true,
        loyaltyPercentage: 5,
      },
      { sender, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
    );

    const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: appAddress,
      amount: BigInt(calculateMbr.return?.valueOf()!),
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });
    const newProfile = await appClient.editProfile(
      {
        boxMBRPayment,
        title: 'shop',
        logo: 'logo id',
        description: 'a site to sell',
        url: 'site url',
        loyaltyEnabled: true,
        loyaltyPercentage: 5,
      },
      { sender, sendParams: { fee: algokit.microAlgos(2_000) }, boxes: [algosdk.decodeAddress(sender.addr).publicKey] }
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

  test('optIn', async () => {
    const optIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      to: creator.addr,
      assetIndex: Number(tokenId),
      amount: 0,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });
    const optIncall = await appClient.optIn({ optInTxn: optIn }, { sender: creator });
    expect(optIncall.return?.valueOf()).toBe(true);
  });

  test('geteway full', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();

    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      to: appAddress,
      amount: 3000,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });

    const info = await algokit.getAccountInformation(sender.addr, algod);
    const gatewayTxn = await appClient.gatewayFull(
      { payment: paymentTxn, amount: 3000, toAddress: sender.addr },
      { sender: creator, sendParams: { fee: algokit.microAlgos(3_000) } }
    );

    console.warn(gatewayTxn.return?.valueOf()!);

    const def = (await algokit.getAccountInformation(sender.addr, algod)).amount - info.amount;

    // const infoo = await algokit.getAccountInformation(creator.addr, algod);
    // console.warn(tokenId);
    // console.warn(infoo);

    expect(def).toBe(2849);
  });

  test('getway spend token', async () => {
    const { appAddress } = await appClient.appClient.getAppReference();
    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      to: appAddress,
      amount: 1850,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });

    const info = await algokit.getAccountInformation(sender.addr, algod);
    await appClient.gatewaySpendToken(
      { payment: paymentTxn, totalAmount: 2000, toAddress: sender.addr, tokenToSpend: 150 },
      { sender: creator, sendParams: { fee: algokit.microAlgos(3_000) } }
    );

    const def = (await algokit.getAccountInformation(sender.addr, algod)).amount - info.amount;

    expect(def).toBe(1999);
  });
});

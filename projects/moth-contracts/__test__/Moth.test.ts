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

describe('HelloWorld', () => {
  let sender: algosdk.Account;

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount, kmd, algod } = fixture.context;
    const { algorand } = fixture;

    sender = await getOrCreateKmdWalletAccount(
      {
        name: 'tealscript-dao-sender',
        fundWith: algos(100),
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

    test('get Site Fee', async () => {
      const getSiteFee = await appClient.getSiteFee({});

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
      expect(proposalFromMethod.return?.valueOf()).toBe(BigInt(24_900));
    });
  });
});

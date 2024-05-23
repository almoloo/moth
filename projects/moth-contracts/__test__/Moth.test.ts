import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { MothClient } from '../contracts/clients/MothClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: MothClient;

const defultPercentage: number = 5;
const siteFee: number = 1;

describe('HelloWorld', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    const { algorand } = fixture;

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

  test('get Site Fee', async () => {
    const getSiteFee = await appClient.getSiteFee({});

    expect(getSiteFee.return?.valueOf()).toEqual(BigInt(siteFee));
  });
});

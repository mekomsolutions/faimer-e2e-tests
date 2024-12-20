import * as dotenv from 'dotenv';
import {
  APIRequestContext,
  Page,
  PlaywrightWorkerArgs,
  WorkerFixture,
  request,
  test as base
}
  from '@playwright/test';

dotenv.config();


async function globalSetup() {
  const requestContext = await request.newContext();
  const token = Buffer.from(`${process.env.O3_USERNAME}:${process.env.O3_PASSWORD}`).toString(
    'base64',
  );
  await requestContext.post(`${process.env.O3_URL_DEV}/ws/rest/v1/session`, {
    data: {
      sessionLocation: '',
      locale: 'en',
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  await requestContext.storageState({ path: 'tests/storageState.json' });
  await requestContext.dispose();
}

export const api: WorkerFixture<APIRequestContext, PlaywrightWorkerArgs> = async ({ playwright }, use) => {
  const ctx = await playwright.request.newContext({
    baseURL: `${process.env.O3_URL_DEV}/ws/rest/v1/`,
    httpCredentials: {
      username: process.env.O3_USERNAME ?? "",
      password: process.env.O3_PASSWORD ?? "",
    },
  });

  await use(ctx);
};

export interface CustomTestFixtures {
  loginAsAdmin: Page;
}

export interface CustomWorkerFixtures {
  api: APIRequestContext;
}

export const test = base.extend<CustomTestFixtures, CustomWorkerFixtures>({
  api: [api, { scope: 'worker' }],
});

export default globalSetup;

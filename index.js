'use strict';

require('dotenv').config();
var timing = require("time-anything");

async function main(name = 'projects/my-project/secrets/my-secret') {
  // [START secretmanager_get_secret]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const name = 'projects/my-project/secrets/my-secret';

  // Imports the Secret Manager library
  const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

  // Instantiates a client
  const client = new SecretManagerServiceClient({
    projectId: 'credentials-vault-test',
    keyFilename: process.env.GCP_SECRET_MANAGER_API_CREDENTIALS_FILE
  });

  async function getSecret() {
    timing.start();
    const [secret] = await client.accessSecretVersion({
      name: name,
    });

    // const policy = secret.replication.replication;

    // console.info(`Found secret ${secret.name} (${policy})`);

    console.log('SECRET DATA:\n', secret.payload.data.toString('utf8'));

    timing.end();

    console.log("Timing Ms = " + timing.timeTakenMs() + "ms");
    console.log("Timing Ns = " + timing.timeTakenNanoSeconds() + "ns");
  }

  getSecret();
  // [END secretmanager_get_secret]
}

const args = process.argv.slice(2);

main(...args).catch(console.error);

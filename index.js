'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const timing = require("time-anything");

const app = express();

app.set('case sensitive routing', true);
app.use(bodyParser.json());

async function getSecretData(secretName, version = 'latest') {
  timing.start();

  const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

  // Instantiates a client
  const client = new SecretManagerServiceClient({
    projectId: 'credentials-vault-test',
    keyFilename: process.env.GCP_SECRET_MANAGER_API_CREDENTIALS_FILE
  });

  const [secret] = await client.accessSecretVersion({
    name: 'projects/credentials-vault-test/secrets/' + secretName + '/versions/' + version,
  });

  timing.end();

  let response = {
    key_data: secret.payload.data.toString('utf8'),
    timming_ms: timing.timeTakenMs()
  }

  return response;
}

app.get('/secret/:key/:version?', async (req, res) => {
  try {
    let data = await getSecretData(req.params.key, req.params.version);

    res.status(200).json(data).end();
  } catch (error) {
    res.status(500).send(error).end();
  }
});

if (module === require.main) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}

module.exports = app;

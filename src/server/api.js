// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors')
const configs = require('./models/configs')

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

app.get('/api/v1/config', async (req, res) => {
  try {
    const respond = await configs.AppConfigTable.select();
    res.json(respond ? respond : {});
  } catch (error) {
    res.status(500).json({ error: 'Something wrong!' });
  }
});

app.post('/api/v1/config', async (req, res) => {
  try {
    await configs.AppConfigTable.upsert(req.body);
    res.json({ status: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something wrong!' });
  }
});

app.listen(PORT, () =>
  console.log(
    `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
  )
);

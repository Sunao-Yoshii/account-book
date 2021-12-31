// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const common = require("./models/DBCommon");
const configs = require('./models/configs');
const brand = require('./models/brands');

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

app.get('/api/v1/brand', async (req, res) => {
  try {
    res.json(await brand.BrandTable.selectAll());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something wrong!' });
  }
});

app.get('/api/v1/brand/:id', async (req, res) => {
  try {
    res.json(await brand.BrandTable.select(req.params.id));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something wrong!' });
  }
});

app.put('/api/v1/brand', async (req, res) => {
  try {
    const db = common.DBCommon.get();
    db.serialize(async () => {
      await brand.BrandTable.insert(req.body, db);
      const latest = await brand.BrandTable.selectLatest(db);
      res.json({ status: 'success', id: latest });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something wrong!' });
  }
});

app.delete('/api/v1/brand', async (req, res) => {
  const id = req.query.id;
  try {
    if (id) {
      await brand.BrandTable.delete(id);
    }
    res.json({ status:'success' });
  } catch (error) {
    res.status(500).json({ error: 'SomethingWrong!' });
  }
});

app.listen(PORT, () =>
  console.log(
    `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
  )
);

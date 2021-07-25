const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const brands = require('./database/brands');
const purchases = require('./database/purchase');
const amountLogs = require('./database/amountLog');
const logic = require('./logic');

// server setting
const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

// all table definition.
const BrandTable = brands.BrandTable;
const PurchaseTable = purchases.PurchaseTable;
const AmountLogTable = amountLogs.AmountLogTable;
BrandTable.createTable();
PurchaseTable.createTable();
AmountLogTable.createTable();

app.delete('/api/brand/:id', async (req, res) => {
  try {
    await logic.AssetsLogic.deleteBrand(req.params['id']);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error});
  }
});

app.get('/api/brand/:id', async (req, res) => {
  try {
    res.json(await BrandTable.select(req.params['id']));
  } catch (error) {
    res.status(500).json({ success: false, message: error});
  }
});

app.get('/api/brands', async (req, res) => {
  try {
    res.json(await BrandTable.selectAll());
  } catch (error) {
    res.status(500).json({ success: false, message: error});
  }
});

app.post('/api/brands', async (req, res) => {
  try {
    await BrandTable.insert(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Has error!' });
  }
});

app.get('/api/purchase/:id', async (req, res) => {
  try {
    res.json(await PurchaseTable.selectByBrand(req.params['id']));
  } catch (error) {
    res.status(500).json({ success: false, message: error });    
  }
});

app.post('/api/purchases', async (req, res) => {
  try {
    // create insert data.
    let baseObject = Object.assign({}, new purchases.defaults());
    baseObject = Object.assign(baseObject, req.body);

    // insert
    await PurchaseTable.insert(baseObject);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Has error!' });
  }
});

app.post('/api/purchase/:id', async (req, res) => {
  try {
    // create update data.
    const id = req.params['id'];
    let baseObject = new purchases.Purchase(req.body);
    baseObject.id = id;

    // update.
    await PurchaseTable.update(baseObject);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Has error!' });
  }
});

app.post('/api/currentAmount', async (req, res) => {
  try {
    // create update data.
    let baseObject = new logic.CurrentAmount(req.body);

    // update.
    await logic.AssetsLogic.putCurrentAmount(baseObject);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Has error!' });
  }
});

app.listen(PORT, () => {
  console.log(
    `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
  )
});

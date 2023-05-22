const express = require('express');
const paypal = require('paypal-rest-sdk');
const app = express();

paypal.configure({
  mode: 'sandbox',
  client_id: 'AUivzSo2kEz5orGcDC17MZc3h24MAgO5zqgw6EbCRfEKqdg7lVKBQZRC1moDCIqSN_Vsxk48JSkknLPy',
  client_secret: 'AUivzSo2kEz5orGcDC17MZc3h24MAgO5zqgw6EbCRfEKqdg7lVKBQZRC1moDCIqSN_Vsxk48JSkknLPy'
});

app.post('/api/paypal/create-payment', (req, res) => {
  const amount = req.body.amount;

  const createPaymentJson = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'http://your-domain.com/success',
      cancel_url: 'http://your-domain.com/cancel'
    },
    transactions: [{
      amount: {
        total: amount,
        currency: 'USD'
      },
      description: 'Payment for your order'
    }]
  };

  paypal.payment.create(createPaymentJson, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error creating PayPal payment');
    } else {
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
      res.json({ approvalUrl });
    }
  });
});

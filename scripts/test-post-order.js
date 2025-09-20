const http = require('http');

const data = JSON.stringify({
  userId: 'u_mfk8ebbsxdhy7l',
  phone: '9142801457',
  customerName: 'Local Test',
  items: [{ plan: { id: 'breakfast-lunch-dinner', title: 'Breakfast, Lunch & Dinner', duration: '1 Month', discountedPrice: 3399 }, qty: 1 }],
  status: 'pending',
  deliveryAddress: { address: 'Ritudih, sec-4, Bokaro Steel City' },
  subtotal: 3399,
  total: 3399,
  paymentMethod: 'cash-on-delivery',
  specialInstructions: ''
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error('problem with request:', e.message);
});

req.write(data);
req.end();

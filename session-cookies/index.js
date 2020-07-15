const express = require('express');
const session = require('express-session');

const app = express();
app.use(session({
  // Don't save cookie every time a change is made
  resave: false,
  // Don't save by default a uninitialized cookie
  saveUninitialized: false,
  secret: '256_bit_string',
}));

app.get('/', (req, res) => {
  // Increment session.count every time the page is loads
  req.session.count = req.session.count
    ? req.session.count + 1
    : 1;

  res.status(200).json({
    hello: 'world',
    counter: req.session.count,
  });
});

app.listen(3000, (err) => {
  if (err) throw new Error('Server Error');
  console.log(`App listen on http://localhost:3000`);
});

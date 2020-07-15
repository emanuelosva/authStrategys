const jwt = require('jsonwebtoken');

// Require all arguments
const [, , option, secret, nameOrToken] = process.argv;
if (!option || !secret || !nameOrToken) {
  return console.log('Missing arguments');
};

// JWT actions
const signToken = (payload, secret) => {
  return jwt.sign(payload, secret);
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// Process
switch (option) {
  case 'sign': {
    console.log(signToken({ sub: nameOrToken }, secret));
    break;
  };
  case 'verify': {
    console.log(verifyToken(nameOrToken, secret));
    break;
  };
  default: {
    console.error('Options needs to be "sign" or "verify"')
    break;
  };
};

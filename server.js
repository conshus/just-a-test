// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const OpenTok = require("opentok");
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
let appSession;

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
};

// Initialize OpenTok
const opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store it in the express app
opentok.createSession({mediaMode:"routed"},function (err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  appSession = session; 
  // We will wait on starting the app until this is done
  init();
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  const sessionId = app.get('sessionId');
  const token = opentok.generateToken(sessionId);
  response.render(__dirname + "/views/index.html",{apiKey: process.env.API_KEY, sessionId: sessionId, token: token});
});

function init() {
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
};
require('dotenv').config()
const connectionLink =
`mongodb+srv://${process.env.DB_UNAME}:${process.env.DB_PW}@cmulter.3pssnnc.mongodb.net/`
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connect = (connectionLink, connectedCallback) => {
  mongoose
    .connect(connectionLink)
    .then(() => {
      connectedCallback();
    })
    .catch((error) => {
      console.info(error);
    });
};

module.exports = {
  connect,
  connectionLink,
};
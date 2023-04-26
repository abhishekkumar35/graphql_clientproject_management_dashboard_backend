const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema/schema");
const { connectDB } = require("./configDB/db");

const app = express();
connectDB();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.use(morgan("dev"));
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(PORT, (error) => {
  if (error) {
    console.log("Error in server");
  }
  console.log(`Listening to ${PORT}`);
  console.log(process.env.PORT);
  console.log(process.env.NODE_ENV);
});

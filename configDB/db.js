const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await connect(
      "mongodb+srv://abhishek:abhishek@cluster0.ahdum8p.mongodb.net/db"
    );
    console.log("Database Connected!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };

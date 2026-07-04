const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Brand = require("./src/models/Brand");
const Member = require("./src/models/Member");
const Pen = require("./src/models/Pen");

const mapMongoIds = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(mapMongoIds);
  if (typeof doc === 'object') {
    const newDoc = {};
    for (const key in doc) {
      if (doc[key] && doc[key].$oid) {
        newDoc[key] = doc[key].$oid;
      } else {
        newDoc[key] = mapMongoIds(doc[key]);
      }
    }
    return newDoc;
  }
  return doc;
};

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/SDN302_SP26_SE191034DB";
    console.log(`Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    console.log("Clearing existing collections...");
    await Brand.deleteMany({});
    await Member.deleteMany({});
    await Pen.deleteMany({});
    console.log("Cleared collections.");

    // Read files
    const brandsData = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/brands.json"), "utf8"));
    const membersData = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/members.json"), "utf8"));
    const pensData = JSON.parse(fs.readFileSync(path.join(__dirname, "src/data/pens.json"), "utf8"));

    // Map IDs
    const mappedBrands = mapMongoIds(brandsData);
    const mappedMembers = mapMongoIds(membersData);
    const mappedPens = mapMongoIds(pensData);

    // Insert
    console.log("Inserting Brands...");
    await Brand.insertMany(mappedBrands);
    console.log(`Successfully seeded ${mappedBrands.length} Brands!`);

    console.log("Inserting Members...");
    await Member.insertMany(mappedMembers);
    console.log(`Successfully seeded ${mappedMembers.length} Members!`);

    console.log("Inserting Pens...");
    await Pen.insertMany(mappedPens);
    console.log(`Successfully seeded ${mappedPens.length} Pens!`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js")
const initData = require("./data.js")

main()
.then(()=>{
    console.log("connected to Database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj)=>({...obj, owner: '689c563d0a3434a54d7abcf5' }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
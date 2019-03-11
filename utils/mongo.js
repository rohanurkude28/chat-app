const mongodb= require("mongodb");
const client=mongodb.MongoClient;
var _db;
let connect =()=>{
client.connect("mongodb://localhost:27017",(error,mongo)=>{
    if(error){
        console.error("Error while connecting to DB");
        process.exit(1);
        }
        console.info("Mongo Connected.......");
        _db=mongo.db("travelex_db")
})
}

let read = () => {
    return _db.collection("users");
}

let create = (doc) => {
    _db.collection("chats").insert(doc, (error, result)=>{
        if(error){
            console.log("Can't insert.")
        }
        console.log("Data inserted.")
    })
}

module.exports={connect,create,read}
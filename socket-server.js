const mongo=require("./utils/mongo");
var express = require("express");

var port=process.env.PORT || 3000;
var app = express();

var http = require("http");

var server = http.createServer(app);

var io = require("socket.io")(server);
var chatRecord=[];
var chatterNamesPairs={};

mongo.connect();
io.on("connection", client =>{
    console.log("New client connected...", client.id);
    client.emit("acknowledge", {data : "Connected"});

    client.on("msgToServer", (chatterName, msg) => {
        console.log(chatterName + " says : " + msg);

        delete chatterName[chatterName];
        chatterNamesPairs[chatterName]=client.id;

        client.broadcast.emit("msgToClient", chatterName , msg);
        client.emit("msgToClient", 'Me', msg);
        chatRecord.push({chatterName:chatterName,id:client.id,message:msg});
        console.log("Messages: "+chatRecord);
    })

    client.on("disconnect", ()=>{
        console.log("Client disconnected." + client.id+" chatter list "+JSON.stringify(chatterNamesPairs));
        
        // mongo.find({
        //     chatterName: req.body.username,
        // }, (err, body) => {
        //     if (err) { console.log(err) }
        //     if (body.found === true) { 
        //         console.log("Username : ", body.result[0].username)
        //         user = body.result[0].username;
        //         return res.redirect("/welcome"); }
        // });

        // mongo.create(chatRecord);
        //Save data into DB
    })

})

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/public/socket-client.html');
})

server.listen(port, ()=>{
    console.log("Socket server running on port 3000");
})
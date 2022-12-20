//import express library
let express = require("express")
let mongoose = require("mongoose")
let song = require('./song')
let cors = require("cors")

//create express app
let app = express()
// make express app use cors()
app.use(cors())
// enable api to receive
app.use(express.json())

let PORT= 8000 

// connect to mongodb database
let connectionString = "mongodb+srv://mongouser:mongopassword@cluster0.0kd8tme.mongodb.net/youtube"

//2. connect to mongodb server usign connection string
mongoose.connect(connectionString)
let db = mongoose.connection

// 3. check if is mongodb server->database is connected
db.once("once", ()=>{
    console.log("Connected to mongodb database in cloud!");
})

//setup api for root (/) endpoint
//http://localhost:PORTNUMBER
//http://localhost:8000/

//define the code for accepting and processing the request
//and send back the response. The request is of type GET and coming from 
// root (/) endpoint
//app.get("endpoint to which this get request must response", "callback function which deals with incoming request and outgoing response")
//API -> http://localhost:8000/
//app.get("/end/point", (incoming_request, outgoing_response)=>{})
app.get("/", (request, response)=>{
    console.log("Request received for / endpoint for GET request")
    response.json({
        "message":"HELLO from root-> /",
        "request_type":"GET"
    })
})

//API -> http://localhost:8000/welcome
app.get("/welcome", (request, response)=>{
    console.log("Request received for /welcome endpoint for GET request")
    response.json({
        "message":"HELLO from welcome-> /welcome",
        "request_type":"GET",
        "data":[{
            "userId": 1,
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
          },
          {
            "userId": 1,
            "id": 2,
            "title": "quis ut nam facilis et officia qui",
            "completed": false
          },
          {
            "userId": 1,
            "id": 3,
            "title": "fugiat veniam minus",
            "completed": false
          },
          {
            "userId": 1,
            "id": 4,
            "title": "et porro tempora",
            "completed": true
          }]
    })
})

//API -> http://localhost:8000/get/song/all
app.get("/get/song/all", (request, response)=>{
    //connect to mongodb database and get the 
    //list of all documents from youtube db->song collection
    console.log("Connecting to mongodb database")
    song.find({}, (error, data)=>{
        if (error) {
            response.json(error)
        }else{
            console.log(data)
            response.json(data)
        }
    })
    //send the list as response to the client
})

// API -> http://localhost:8000/add/song
app.post("/add/song", (request, response)=>{
    //console.log(request)
    console.log(request.body)
    //extract request body/payload from the incoming request
    let receivedVideoid = request.body.videoid
    let receivedLikes = request.body.likes
    let receivedDislikes = request.body.dislikes
    let receivedViews = request.body.views
    //create a new song
    let newSong = new song()
    //update newSong with values received in request body/payload
    newSong.videoid = receivedVideoid
    newSong.likes = receivedLikes
    newSong.dislikes = receivedDislikes
    newSong.views = receivedViews
    //save the newSong using model in mongodb database
    newSong.save((error, data)=>{
        if (error) {
            response.json(error)
        }else{
            console.log(data)
            response.json(data)
        }
    })
   

})
app.listen(PORT, ()=>{
    console.log("Listening on port:" + PORT)
})
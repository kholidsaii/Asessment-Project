const express = require("express");
const router = require ("./routes/api");


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(router);


app.listen(3000, ()=>{
    console.log("Server berjalan di port 3000");
});
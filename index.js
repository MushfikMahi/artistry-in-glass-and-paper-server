const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewere

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Artistry server is running')
})

app.listen(port, ()=>{
    console.log(`Artistry server is running on port : ${port}`);
})

app.post('/crafts', async(req, res)=>{
    const craft = req.body;
    console.log(craft)
    // res.send(craft)
})
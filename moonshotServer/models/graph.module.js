const mongoose = require("mongoose");
const rawData = require("../data/data");

const graphSchema = new mongoose.Schema({
    day:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    A:{
        type:String,
        required:true
    },
    B:{
        type:String,
        required:true
    },
    C:{
        type:String,
        required:true
    }
})

const Graph = mongoose.model("Graph",graphSchema);

// Graph.create(rawData).then(()=>console.log('data created'));
module.exports = Graph;
const express = require('express');
const router = express.Router();
const moment = require("moment");
const fs = require('fs');

let rawdata = fs.readFileSync('./data.json');
let regras = JSON.parse(rawdata);

router.get('/', function (req, res){
    return res.send(regras);
});

router.post('/', function (req, res){    
    if(moment(req.body.data, "DD-MM-YYYY", true).isValid()){
        var newId = regras[regras.length-1].id + 1;
        regras.push({"id":newId,"data":req.body.data});
        fs.writeFileSync('./data.json', JSON.stringify(regras));    
        return res.send(regras);
    }else{
        return res.send({message:"Data inválida"});
    }    
});

router.delete('/:id', function (req, res){
    regras = regras.filter(function(jsonObject) {
        return jsonObject.id != req.params.id;
    });
    fs.writeFileSync('./data.json', JSON.stringify(regras));
    return res.send(regras);
});

router.get('/interval/', function (req, res){    

    if(moment(req.query.start, "DD-MM-YYYY").isValid() == false){
        return res.send({message: "Data inicial inválida."})
    }
    if(moment(req.query.end, "DD-MM-YYYY").isValid() == false){
        return res.send({message: "Data final inválida."})
    }

    var start = moment(req.query.start, "DD-MM-YYYY");
    var end = moment(req.query.end, "DD-MM-YYYY");

    var tempRegras = regras.filter(function(jsonObject) {       
        return start.diff(moment(jsonObject.data, "DD-MM-YYYY")) <= 0;
    });

    tempRegras = tempRegras.filter(function(jsonObject) {
        return end.diff(moment(jsonObject.data, "DD-MM-YYYY")) >= 0;
    });
    
    return res.send(tempRegras);
});

module.exports = router;
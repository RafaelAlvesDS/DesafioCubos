const express = require('express');
const router = express.Router();
const moment = require("moment");
const fs = require('fs');

let rawdata = fs.readFileSync('./data.json');
let rules = JSON.parse(rawdata);

router.get('/', function (req, res){
    return res.send(rules);
});

router.post('/', function (req, res){
    var days = ["Domingo","Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sábado"];
    var tempJson = req.body;
    tempJson['id'] = rules[rules.length-1].id + 1;

    if(req.body.type != "normal" && req.body.type != "daily" && req.body.type != "weekly"){
        return res.send({message:"Tipo não especificado."});
    }
    if(req.body.type == "weekly"){
        for(var i = 0; i<days.length;i++){
            if(req.body.weekday == days[i]){
                var weekdayIsValid = true;
            }
        }
        if(weekdayIsValid != true){
            return res.send({message:"Dia da semana inválido"});
        }        
    }
        
    if(req.body.type == "normal" && !(moment(req.body.date, "DD-MM-YYYY", true).isValid())){
        return res.send({message:"Data inválida"});
    }

    var newId = rules[rules.length-1].id + 1;
    rules.push(tempJson);
    fs.writeFileSync('./data.json', JSON.stringify(rules));    
    return res.send(rules);
});

router.delete('/:id', function (req, res){
    rules = rules.filter(function(jsonObject) {
        return jsonObject.id != req.params.id;
    });
    fs.writeFileSync('./data.json', JSON.stringify(rules));
    return res.send(rules);
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

    var tempRules = rules.filter(function(jsonObject) {       
        return start.diff(moment(jsonObject.date, "DD-MM-YYYY")) <= 0;
    });

    tempRules = tempRules.filter(function(jsonObject) {
        return end.diff(moment(jsonObject.date, "DD-MM-YYYY")) >= 0;
    });
    
    return res.send(tempRules);
});

module.exports = router;
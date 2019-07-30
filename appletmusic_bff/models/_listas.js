var connection = require('../connection');
var mongoose = require('mongoose')
, Schema = mongoose.Schema
var mySelf = { 
   getMongoObj: function(params){
       mongoObj = {
        users:[{ type: Schema.Types.ObjectId, ref: 'users' }]
        ,nombreLista:String
        ,traks:Number
        ,items:String

}
 
       return mongoObj;
   },
   insert: function(params, _function){
           schema = mySelf.getMongoObj();
           connection.open('listas',schema ,function(collection,error) {
               if(error){ _function(undefined,error); return false; }
               collection.create(params,function(err, docs){
                   _function(docs,err)
               })
           })
   },
   find: function(id, _function){
           schema = mySelf.getMongoObj();
           connection.open('listas',schema ,function(collection,error) {
           var query = collection.find({_id:connection.ObjetId(id)})
           query.populate('users')
.exec(function(err, docs) { 
                   _function(docs,err)
               })
           })
   },
   list: function(params,page, _function){
           schema = mySelf.getMongoObj();
           if(typeof page === "function"){_function = page; page = 0 ;}
           connection.open('listas',schema ,function(collection,error) {
               var query = collection.find({})
               query.populate('users')
.exec(function(err, docs) { 
                   _function(docs,err)
               })
           })
   },
   update: function(params,id, _function){
           schema = mySelf.getMongoObj();
           var whereObject ;
           if(typeof id === "function"){_function = id; id = 0 ;}
           if(id===0){
               whereObject = {'users':params[0]};
           }else{
               whereObject = {_id:connection.ObjetId(id)};
           }
           connection.open('listas',schema ,function(collection,error) {
               collection.update(whereObject,{$set:params},{multi:true},function(err, docs) { 
                   _function(docs,err) 
               })
           })
   },
   delete: function(params,id, _function){
           var whereObject ;
           if(typeof id === "function"){_function = id; id = 0 ;}
           if(id===0){
               whereObject = {'users':params[0]};
           }else{
               whereObject = {_id:id};
           }
           schema = mySelf.getMongoObj();
           connection.open('listas',schema ,function(collection,error) {
               if(error){ _function(undefined,error); return false; }
               collection.remove(whereObject,function () {
               })
               mySelf.list([],0, _function) 
           })
   }
}
module.exports = mySelf;
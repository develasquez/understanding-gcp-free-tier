var mongoose  = require('mongoose');
mongoose.connect('mongodb+srv://cotizacion:U03EAIv36IDmwEl9@mongodb-cgzlj.gcp.mongodb.net/appletmusic?retryWrites=true');
collections = {};
module.exports = {
    ObjetId:function(string){
        return mongoose.Types.ObjectId(string);
    },
   open:function (collection,schema,fun){
        var Schema = mongoose.Schema;
       var newSchema = new Schema(schema);
       var listOfReferences = [];
        for (prop in schema){ 
            try{
                var collectionRef = schema[prop][0].ref
                listOfReferences[listOfReferences.length] = collectionRef;
                var reference =  require('./models/_' + collectionRef);
                var schemaRef = new Schema(reference.getMongoObj());
                if (!collections[collectionRef]){
                    collections[collectionRef]=  mongoose.model(collectionRef,schemaRef);
                }
            }
            catch(ex){
            }
        }
        if (!collections[collection]){
            collections[collection]=  mongoose.model(collection,newSchema);
        }
        fun(collections[collection],undefined,listOfReferences)
    }
}
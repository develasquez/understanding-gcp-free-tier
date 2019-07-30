var redis = require('./redis');

exports.updateMp3Cache = (data, context) => {
    const file = data;
    const name = file.name.substring(0,file.name.length -4)
    console.log("name", name);
    redis.init().then(() => {
      redis.set(name,file.mediaLink);

    });
    
};

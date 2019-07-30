const request = require("request");
const { Storage } = require("@google-cloud/storage");


exports.saveMp3 = (event, callback) => {
  const data = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : '{}';
  console.log(data);
  const CLOUD_BUCKET = "mp3_desamovil";
  const storage = new Storage({
    projectId: 'buscarsalud-cloud'
  });

  const bucket = storage.bucket(CLOUD_BUCKET);

  const { url, name } = JSON.parse(data);
  const files = bucket.file(name + '.mp3');

  request(url)
    .pipe(files.createWriteStream({
      metadata: {
        contentType: 'audio/mpeg'
      }
    }));
};

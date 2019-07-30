var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: '.',
  port: process.env.PORT || 8080,
  name: 'help',
  host: '0.0.0.0',
  cors: '*',            
  followSymlink: true, 
  templates: {
    index: 'index.html',
    notFound: '404.html'
  }
});
 
server.start(function () {
  console.log('Server listening to', server.port);
});
 
server.on('request', function (req, res) {
});
 
server.on('symbolicLink', function (link, file) {
  console.log('File', link, 'is a link to', file);
});
 
server.on('response', function (req, res, err, file, stat) {
});
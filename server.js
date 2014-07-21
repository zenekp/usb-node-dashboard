var static = require('node-static');

var fileServer = new static.Server('./app/');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (err, result) {
            if (err) { // File couldnt be found in the file system serve project root.1
				request.url = '/';
				fileServer.serve(request, response);
            }
        });
    }).resume();
}).listen(8085);
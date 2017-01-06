var fs = require("fs");

var readFile = function (path) {
    return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};

var print = function (obj) {
    console.log(obj);
};


var http = require("http");

var n = 0;

var obtenirDocument = function (url) {

    print(++n + " " + url);

    if (url == "/apple-touch-icon-precomposed.png" ||
        url == "/apple-touch-icon.png" ||
        url == "/favicon.ico")
        return ""; // ignorer ces URL
    
    return readFile("documents" + url);
};

var extension = function (path) {
    var i = path.lastIndexOf(".");
    if (i < 0) {
        return "";
    } else {
        return path.slice(i+1, path.length);
    }
};

http.createServer(function (requete, reponse) {

    var url = requete.url;
    var doc = obtenirDocument(url);
    var ext = extension(url);
    var type = "text/plain";

    if (ext == "html") {
        type = "text/html";
    } else if (ext == "css") {
        type = "text/css";
    } else if (ext == "js") {
        type = "text/javascript";
    } else if (ext == "svg") {
        type = "image/svg+xml";
    }

    reponse.writeHead(200, {"Content-Type": type});

    reponse.end(doc);
}).listen(8000);

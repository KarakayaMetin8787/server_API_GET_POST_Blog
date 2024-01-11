const fs = require("fs");
const http = require("http");

function loadFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

function writeJSONFile(path, jsonObj) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(jsonObj, null, 2), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(jsonObj);
            }
        })
    })
}

function parseRequestBody(request) {
    return new Promise((resolve, reject) => {
        let requestBodyChunks = [];
        request
        .on("data", (chunk) => requestBodyChunks.push(chunk))
        .on("end", () => {
            const body = JSON.parse(Buffer.concat(requestBodyChunks).toString());
            resolve(body);
        })
        .on("error", (error) => reject(error))
    })
}

const server = http.createServer(function serverRequestHandler(
    request,
    response
) {
    console.log("New Request: ", request.method, request.url);

    if (request.url === "/api/guestbook" && request.method === "GET") {
        console.log("API loaded");
        loadFile("./guestbook.json")
        .then((jsonString) => response.end(jsonString))
        .catch((err) => {
            console.log(err);
            const INTERNAL_SERVER_ERROR = 500;
            const error = {success: false, error: "Could not retrieve guestbook entries"};
            const errorJSONString = JSON.stringify(error);
            response.writeHead(INTERNAL_SERVER_ERROR).end(errorJSONString);
        })
    } else if (request.url === "/api/guestbook" && request.method === "POST") {
        const guestbookArrayPromise = loadFile("./guestbook.json")
        .then((JSONBuffer) => JSON.parse(JSONBuffer.toString()));
        
        const bodyPromise = parseRequestBody(request);

        Promise.all([guestbookArrayPromise, bodyPromise])
        .then(([guestbookArray, body]) => [...guestbookArray, body])
        .then((newGuestbookArray) => writeJSONFile("./guestbook.json", newGuestbookArray))
        .then((newGuestbookArray) => response.end(JSON.stringify(newGuestbookArray)));
    } else {
        console.log("API skipped and Server loading");

        const filePath = 
        request.url === "/" ? "./public/index.html" : "./public" + request.url;
        loadFile(filePath)
        .then((text) => response.end(text))
        .catch((err) => {
            console.log(err);
            response.writeHead(301, { Location: `/pages/error.html` }).end(); 
        })
    }
})

const PORT = 3000;
server.listen(PORT, () => console.log("Server ready at port: " + PORT));
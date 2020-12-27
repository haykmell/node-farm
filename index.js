const http = require("http");
const fs = require("fs");
const url = require("url");
const replaceProperties = require("./modules/replaceProperties");

// html
const cardTemplate = fs.readFileSync("./templates/card.html", "utf-8");
const overviewTemplate = fs.readFileSync("./templates/overview.html", "utf-8");
const productTemplate = fs.readFileSync("./templates/product.html", "utf-8");

// json
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

// server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // routing
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const htmlCards = dataObj
      .map((el) => replaceProperties(cardTemplate, el))
      .join("");
    const output = overviewTemplate.replace(/{%PRODUCT_CARDS%}/, htmlCards);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceProperties(productTemplate, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("Page not found!");
  }
});

server.listen(process.env.PORT || 3000);

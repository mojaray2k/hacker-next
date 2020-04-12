const next = require("next");
const http = require("http");
const url = require("url");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";

const port = process.env.PORT || 3115;

const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      /* parse the request url to get its pathname */
      const parsedUrl = url.parse(req.url, true);
      const { pathname } = parsedUrl;

      /* If a service worker is requested serve it as a static file  */
      if (pathname === "/service-worker.js") {
        const filePath = path.join(__dirname, ".next", pathname);
        app.serveStatic(req, res, filePath);
      } else {
        /* otherwise let next take care of it */
        handle(req, res, parsedUrl);
      }
    })
    .listen(port, () => {
      console.log(`Listening on PORT ${port}`);
    });
});

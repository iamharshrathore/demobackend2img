import { readFile } from "fs/promises";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer(async (req, res) => {
  if (req.method === "GET") {
    let filePath;
    
    if (req.url === "/" || req.url === "/index.html") {
      filePath = join(__dirname, "index.html");
    } else {
      filePath = join(__dirname, req.url);
    }

    try {
      const data = await readFile(filePath, "utf-8");  // UTF-8 encoding
      
      const ext = req.url.split('.').pop()?.toLowerCase() || 'txt';
      const contentTypes = {
        'html': 'text/html; charset=utf-8',      // Fixed: added charset
        'css': 'text/css; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'ico': 'image/x-icon'
      };
      
      res.writeHead(200, { 
        "Content-Type": contentTypes[ext] || 'text/plain; charset=utf-8',
        "Cache-Control": "public, max-age=3600"
      });
      res.end(data);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 - File not found</h1>");
    }
  } else {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

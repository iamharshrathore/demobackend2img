import { readFile } from "fs/promises";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer(async (req, res) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.method === "GET") {
    let filePath;
    
    if (req.url === "/" || req.url === "/index.html") {
      filePath = join(__dirname, "index.html");
    } else {
      filePath = join(__dirname, req.url);
    }

    try {
      const data = await readFile(filePath);
      
      // Set content type based on file extension
      const ext = req.url.split('.').pop().toLowerCase();
      const contentTypes = {
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'ico': 'image/x-icon'
      };
      
      res.writeHead(200, { 
        "Content-Type": contentTypes[ext] || 'text/plain',
        "Cache-Control": "public, max-age=3600"
      });
      res.end(data);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 - File not found</h1>");
    }
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static frontend (index.html)
app.use(express.static("public"));

// Live connected users
let viewers = 0;

wss.on("connection", (ws) => {
    viewers++;
    broadcastViewers();

    ws.on("close", () => {
        viewers--;
        broadcastViewers();
    });
});

// Function to send viewers count to all clients
function broadcastViewers() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ viewers }));
        }
    });
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

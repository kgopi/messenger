module.exports = (wss) => {
    return (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, function (ws) {
            wss.emit('connection', ws, req);
        });    
    }
}
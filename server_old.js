var path = require('path');
var scHotReboot = require('sc-hot-reboot');
var fsUtil = require('socketcluster/fsutil');
var waitForFile = fsUtil.waitForFile;
var SocketCluster = require('socketcluster');
var environment = process.env.ENV || 'dev';
const env = require("node-env-file");
env("./.env");

var argv = require('minimist')(process.argv.slice(2));

const workerController = path.join(__dirname, 'worker.js');
const brokerController = path.join(__dirname, 'broker.js');
var options = {
  workers: Number(process.env.SOCKETCLUSTER_WORKERS) || require('os').cpus().length,
  brokers: Number(process.env.SOCKETCLUSTER_BROKERS) || 1,
  port: Number(process.env.SOCKETCLUSTER_PORT) || 8000,
  // You can switch to 'sc-uws' for improved performance.
  wsEngine: process.env.SOCKETCLUSTER_WS_ENGINE || 'ws',
  appName: process.env.SOCKETCLUSTER_APP_NAME || "vaani",
  workerController,
  brokerController,
  socketChannelLimit: Number(process.env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000,
  environment: environment,
  rebootWorkerOnCrash: true
};

var start = function () {
  var socketCluster = new SocketCluster(options);

  socketCluster.on(socketCluster.EVENT_WORKER_CLUSTER_START, function (workerClusterInfo) {
    console.log('   >> WorkerCluster PID:', workerClusterInfo.pid);
  });


  
  if (socketCluster.options.environment === 'dev') {
    console.log(`   !! The sc-hot-reboot plugin is watching for code changes in the ${__dirname} directory`);
    scHotReboot.attach(socketCluster, {
      cwd: __dirname,
      ignored: ['public', 'node_modules', 'README.md', 'Dockerfile', 'server.js', 'broker.js', /[\/\\]\./, '*.log']
    });
  }
};




var bootCheckInterval = Number(process.env.SOCKETCLUSTER_BOOT_CHECK_INTERVAL) || 200;
var bootStartTime = Date.now();

// Detect when Docker volumes are ready.
var startWhenFileIsReady = (filePath) => {
  var errorMessage = `Failed to locate a controller file at path ${filePath} ` +
  `before SOCKETCLUSTER_CONTROLLER_BOOT_TIMEOUT`;

  return waitForFile(filePath, bootCheckInterval, bootStartTime, 1000, errorMessage);
};

var filesReadyPromises = [
  startWhenFileIsReady(workerController),
  startWhenFileIsReady(brokerController)
];
Promise.all(filesReadyPromises)
.then(() => {
  start();
})
.catch((err) => {
  console.error(err.stack);
  process.exit(1);
});

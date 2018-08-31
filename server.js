var path = require('path');
var scHotReboot = require('sc-hot-reboot');
var fsUtil = require('socketcluster/fsutil');
var waitForFile = fsUtil.waitForFile;
var SocketCluster = require('socketcluster');

const env = require("node-env-file");
env("./.env");
const config = require("./config").configure(process.env);

var argv = require('minimist')(process.argv.slice(2));

const workerController = path.join(__dirname, 'worker.js');
const brokerController = path.join(__dirname, 'broker.js');
const options = {
  workers: config.workers,
  brokers: config.brokers,
  port: config.listenPort,
  // You can switch to 'sc-uws' for improved performance.
  wsEngine: 'ws',
  appName: config.appName,
  workerController,
  brokerController,
  socketChannelLimit: config.socketChannelLimit,
  environment: config.environment,
  rebootWorkerOnCrash: false,
  wsEngineServerOptions: {
    path: '/'
  },
  rabbitmq: config.rabbitmq
};

var start = function () {
  var socketCluster = new SocketCluster(options);
  socketCluster.authTokens = {};

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

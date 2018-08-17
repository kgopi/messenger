var SCBroker = require('socketcluster/scbroker');
var scClusterBrokerClient = require('scc-broker-client');

class Broker extends SCBroker {
  run() {
    console.log('   >> Broker PID:', process.pid);

    if (this.options.clusterStateServerHost) {
      scClusterBrokerClient.attach(this, {
        stateServerHost: this.options.clusterStateServerHost,
        stateServerPort: this.options.clusterStateServerPort,
        mappingEngine: this.options.clusterMappingEngine,
        clientPoolSize: this.options.clusterClientPoolSize,
        authKey: this.options.clusterAuthKey,
        stateServerConnectTimeout: this.options.clusterStateServerConnectTimeout,
        stateServerAckTimeout: this.options.clusterStateServerAckTimeout,
        stateServerReconnectRandomness: this.options.clusterStateServerReconnectRandomness
      });
    }
  }
}

new Broker();

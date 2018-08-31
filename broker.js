const SCBroker = require('socketcluster/scbroker');
const rabbitmq = require('./middleware/RabbitmqClient');

class Broker extends SCBroker {
  run() {
    console.log('   >> Broker PID:', process.pid);
    rabbitmq.attach(this);
  }
}

new Broker();

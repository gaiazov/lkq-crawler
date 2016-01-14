import {Config} from "./model/Config";

var jackrabbit = require('jackrabbit');

interface IRabbitQueue {
  consume(consumeFunc: (data, ack) => any);
}

interface IRabbitExchange {
  publish(message, options);
  queue(options):IRabbitQueue;
}

export class Queue {
  private queue:IRabbitQueue;
  private exchange:IRabbitExchange;

  constructor(url:string, private name:string) {
    console.log("Connecting to rabbitmq @ " + url);
    var rabbit = jackrabbit(url);
    console.log("Connected");
    this.exchange = rabbit.default();
    console.log("Exchange created");
    this.queue = this.exchange.queue({
      name: name,
      durable: true
    });
    console.log("Queue created");
  }

  public publish(message:any) {
    this.exchange.publish(message,  {key: this.name});
  }

  public consume(consumeFunc: (data) => any) {
    this.queue.consume((data, ack) => {
      consumeFunc(data);
      ack();
    });
  }
}

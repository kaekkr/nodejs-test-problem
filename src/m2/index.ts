import amqp from 'amqplib/callback_api';

const processTask = (task: { number: number }) => {
  console.log(`Processing task: ${JSON.stringify(task)}`);
  setTimeout(async () => {
    const result = task.number * 2;

    amqp.connect('amqp://localhost', (err, connection) => {
      if (err) {
        console.error('Error connecting to RabbitMQ:', err);
        return;
      }

      connection.createChannel((err, channel) => {
        if (err) {
          console.error('Error creating channel:', err);
          return;
        }

        const queue = 'results';

        channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify({ result })));

        console.log(`Result sent to RabbitMQ: ${JSON.stringify({ result })}`);
      });
    });
  }, 5000);
};

const startConsuming = () => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      console.error('Error connecting to RabbitMQ:', err);
      return;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error('Error creating channel:', err);
        return;
      }

      const queue = 'tasks';

      channel.assertQueue(queue, { durable: false });
      channel.consume(queue, (msg) => {
        if (msg !== null) {
          const task = JSON.parse(msg.content.toString());
          processTask(task);
          channel.ack(msg);
        }
      });
    });
  });
};

startConsuming();

import express from 'express';
import amqp from 'amqplib/callback_api';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/process', (req, res) => {
  const task = {
    number: req.body.number,
  };

  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      console.error('Error connecting to RabbitMQ:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error('Error creating channel:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const queue = 'tasks';

      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)));

      console.log(`Task sent to RabbitMQ: ${JSON.stringify(task)}`);
      res.send('Task received successfully');
    });
  });
});

app.listen(port, () => {
  console.log(`Microservice M1 listening at http://localhost:${port}`);
});

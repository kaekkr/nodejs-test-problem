import express from 'express';
const app = express();
const port = 3001;

app.use(express.json());

app.post('/result', (req, res) => {
  const result = req.body.result;
  console.log(`Received result: ${JSON.stringify({ result })}`);
  res.send(`Result: ${result}`);
});

app.listen(port, () => {
  console.log(`Main application listening at http://localhost:${port}`);
});

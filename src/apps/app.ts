import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("hey");
});

app.listen(PORT, () => {
  console.log(`library management system is running on port ${PORT}`);
});

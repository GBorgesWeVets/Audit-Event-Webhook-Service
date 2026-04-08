import { app } from "./app";

const PORT = 3000;

app.listen({ port: PORT }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Webhook audit service rodando em ${address}`);
});
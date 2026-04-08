import Fastify from "fastify";
import axios from "axios";

const app = Fastify({ logger: true });

const PORT = 3002; // Porta separada do endpoint principal

// ────────── CONFIGURAÇÃO ──────────
const SMOOCH_APP_ID = "61b3c136481c7c00ebc8ad41";
const SMOOCH_API_KEY = "app_68af69e286a0c866be2e8158:8zVXAWACG1u6kBqv9yTZE_PdygAjM5OiWC2PiQx0e9mMIlsCPUR6zz6bTpuXshKYD"; 
const WEBHOOK_URL = "https://dev.wevets.com.br/webhook"; // Endpoint Fastify principal

// ────────── REGISTRO DO WEBHOOK ──────────
async function registerWebhook() {
  try {
    const response = await axios.post(
      `https://api.smooch.io/v2.1/apps/${SMOOCH_APP_ID}/webhooks`,
      {
        target: WEBHOOK_URL,
        triggers: [
          "message:appUser",
          "message:delivery:failure",
          "message:read",
          "conversation:message",
          "notification:delivery:user",
          "notification:delivery:failure",
          "notification:delivery:channel" // Se v2.1 aceitar
        ],
        includeFullMessage: true
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SMOOCH_API_KEY}`
        }
      }
    );

    console.log("✅ Webhook registrado com sucesso!");
    console.log(response.data);
  } catch (err: any) {
    console.error(
      "❌ Erro ao registrar webhook:",
      err.response?.data || err.message
    );
  } finally {
    // Fecha o Fastify depois de rodar
    await app.close();
  }
}

// ────────── START SCRIPT ──────────
app.listen({ port: PORT }, async (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Script rodando na porta ${PORT}`);
  await registerWebhook();
});
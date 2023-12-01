const { Client, LocalAuth } = require("whatsapp-web.js");
const code = document.getElementById("qrcode");
const rimraf = require("rimraf");
const fs = require("fs");

const SESSION_FOLDER_PATH = ".wwebjs_auth";
async function startAPI() {
  let sessionData;
  console.log("estra a estart qr");
  const client = new Client({
    session: sessionData,
    authStrategy: new LocalAuth(),
  });


  client.on("qr", (qr) => {  code.innerHTML = "";
    new QRCode(code, {
      text: qr,
      width: 256,
      height: 256,
    });
  });
  client.on("authenticated", async (session) => {
    console.log("Autenticado exitosamente");
    if (session) {
      console.log("Autenticado exitosamente");
      // Esperar un poco antes de guardar la sesión
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    } else {
      console.error("Error: El objeto de sesión es undefined.");
    }
  });
  client.on("ready", () => {
    console.log("cliente inicializado");
  });
  await client.initialize();
  code.innerHTML = "ya esta conectado";
  return client;
}
// Función para eliminar la sesión local
function deleteLocalSession() {
  try {
    rimraf.sync(SESSION_FOLDER_PATH);
    console.log("Carpeta de sesiones eliminada exitosamente");
  } catch (err) {
    console.error("Error al eliminar la carpeta de sesiones:", err.message);
  }
}
function logeo() {
  if (fs.existsSync(SESSION_FOLDER_PATH)) {
    console.log("Sesión encontrada.");
  } else {
    console.log(
      "No se encontraron datos de sesión. Escanea el código QR para autenticar."
    );
    fs.mkdirSync(SESSION_FOLDER_PATH);
  }
}
function messageSend(cliente, contacto, mensaje) {
  return cliente.sendMessage(contacto, mensaje);
}

logeo();

module.exports = {
  startAPI,
  messageSend,
  deleteLocalSession,
};

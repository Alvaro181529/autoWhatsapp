const { Client, LocalAuth } = require("whatsapp-web.js");
const code = document.getElementById("qrcode");
const rimraf = require("rimraf");
const fs = require("fs");
let status;
const SESSION_FOLDER_PATH = ".wwebjs_auth";
async function startAPI() {
  let sessionData;
  console.log("estra a estart qr");
  const client = new Client({
    session: sessionData,
    authStrategy: new LocalAuth(),
  });

  client.on("qr", (qr) => {
    code.innerHTML = "";
    new QRCode(code, {
      text: qr,
      width: 400,
      height: 400,
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
  await client.initialize().then(() => {
    code.innerHTML = "conectado";
  });
  const texto = code.textContent;
  const palabra = texto.includes("conectado");
  if (palabra) {
    console.log("La palabra 'oculto' se encuentra en el div.");
    const botonCerrar = document.querySelector("#cerrar");
    botonCerrar.click();
  } else {
    console.log("La palabra 'oculto' no se encuentra en el div.");
  }
  client.on("message_ack", (msg, ack) => {
    status = ack;
  });

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
    document.getElementById("session").innerHTML = "Se encontro una session";
  } else {
    console.log(
      "No se encontraron datos de sesión. Escanea el código QR para autenticar."
    );
    document.getElementById("session").innerHTML = "No se encontro una session"

    fs.mkdirSync(SESSION_FOLDER_PATH);
  }
}
function callStatus() {
  status = status;
  console.log(status);
  return status;
}
function messageSend(cliente, contacto, mensaje) {
  try {
    return cliente.sendMessage(contacto, mensaje);
  } catch (error) {
    alert("ES POSIBLE QUE TE HAYAN BANEADO ;-;");
  }
}

logeo();

module.exports = {
  startAPI,
  messageSend,
  deleteLocalSession,
  callStatus,
};

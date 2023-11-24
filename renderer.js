//--------------------------------------------
//       Referenciar contenidos
//jugar con el tiempo                            |
//las palabras ambos                             |X
//pueden hacer de manera randomica               |/
//mostrar la lista de envidados                  |X
//validacion de numeros                          |X
//hacer que se pueda editar fraces randomicas    |
//actualizar pagina                              |
//SE ECONTRO UN ERROR EL ENVIO ES DE INMEDIATO   |
//--------------------------------------------
const { startAPI, messageSend, deleteLocalSession } = require("./api.js");
const { updateOnlineStatus } = require("./status.js");
const { ralert } = require("./refrescar.js");
const XLSX = require("xlsx");
const { sync } = require("rimraf");

updateOnlineStatus();

//--------------------------------------------
//       Excel a Json
//--------------------------------------------

var selectedFile;
var name_item = [];
var allJSONObjects = [];
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("fileUpload")
    .addEventListener("change", function (event) {
      selectedFile = event.target.files[0];
    });

  document.getElementById("uploadExcel").addEventListener("click", function () {
    if (selectedFile) {
      var fileReader = new FileReader();
      fileReader.onload = function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });

        allJSONObjects = [];

        workbook.SheetNames.forEach((sheet) => {
          let rowObject = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          let jsonArray = JSON.parse(JSON.stringify(rowObject));
          allJSONObjects = allJSONObjects.concat(jsonArray);

          jsonArray.forEach((objeto) => {
            for (var prop in objeto) {
              if (
                typeof objeto[prop] === "number" &&
                !name_item.includes(prop)
              ) {
                name_item.push(prop);
              }
            }
          });
        });
        document.getElementById("jsonData").innerHTML =
          allJSONObjects.length + " numeros de contacto contactos";
      };
      fileReader.readAsBinaryString(selectedFile);
    }
  });
});
//--------------------------------------------
//       FUNCION DE TIEMPO
//--------------------------------------------

var sleepES5 = function (ms) {
  var esperarHasta = new Date().getTime() + ms;
  while (new Date().getTime() < esperarHasta) continue;
};
//--------------------------------------------
//       Envio de Mensajes librerias de fraces
//--------------------------------------------

const frasesAleatorias = [
  "Por favor, recuerde recoger su paquete en la agencia nacional de correos.",
  "Estamos ansiosos por su llegada. Lo esperamos con entusiasmo.",
  "Estaremos atentos a su llegada. No dude en pasar por nuestra oficina.",
  "Su paquete está listo para ser recogido en la agencia. ¡Hasta pronto!",
  "Le recordamos que su paquete le espera en la agencia nacional de correos.",
  "Nos encantaría verlo pronto en nuestra agencia. Su paquete está listo.",
  "Lo esperamos con gusto en la agencia de correos. Su paquete le aguarda.",
  "Su paquete está seguro y listo para ser recogido. ¡No demore!",
  "Asegúrese de recoger su encomienda en la agencia de mensajería nacional.",
  "Estamos emocionados por su llegada. Le esperamos con anticipación.",
  "Permaneceremos alerta a su llegada. No dude en visitar nuestras instalaciones.",
  "Su paquete está preparado para ser retirado en la agencia. ¡Hasta pronto!",
  "Le recordamos la disponibilidad de su paquete en la agencia de correos nacional.",
  "Nos encantaría darle la bienvenida pronto en nuestra agencia. Su paquete está preparado.",
  "Le esperamos con gusto en la agencia postal. Su paquete le aguarda.",
  "Su paquete está resguardado y listo para ser retirado. ¡No demore!",
];

//--------------------------------------------
//       Envio de Mensajes variables
//--------------------------------------------
let m;
let o;
let message = "";
let tiempo;
let espera;
let cantidad;
const code = "591";
const can = document.getElementById("cantidad");
const tiem = document.getElementById("tiempo");
const esp = document.getElementById("espera");
const men = document.getElementById("mensajetxt");

//--------------------------------------------

function obtenerFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * frasesAleatorias.length);
  return frasesAleatorias[indiceAleatorio];
}
//--------------------------------------------

men.addEventListener("input", function () {
  message = men.value;
  console.clear();
  console.log(message);
});
tiem.addEventListener("input", function () {
  tiempo = tiem.value;
  tiempo *= 1000;
});
esp.addEventListener("input", function () {
  espera = esp.value;
  espera *= 10000;
});
can.addEventListener("input", function () {
  cantidad = can.value;
});

//--------------------------------------------
//       Inicio de Cliente y Recorrido del Array de Numeros
//--------------------------------------------

function envioMensaje() {
  try {
    m = 0;
    o = 0;
    allJSONObjects.forEach(async (objeto) => {
      const cliente = container.client;

      let nameItem = objeto[name_item];
      const fraseAleatoria = obtenerFraseAleatoria();
      const phone = code + nameItem + "@c.us";
      const mensaje = message + " " + fraseAleatoria;
      let n = 1 + o;
      if (m == cantidad) {
        setTimeout(function () {
          console.log("funcion send (Espera)");
          datosTabla(n, nameItem, cliente, phone, mensaje).then(() =>
            console.log("Mensaje enviado")
          );
        }, espera);
        espera += 3000;
        m = -1;
      } else {
        setTimeout(function () {
          console.log("funcion send (Tiempo)");
          datosTabla(n, nameItem, cliente, phone, mensaje).then(() =>
            console.log("Mensaje enviado")
          );
        }, tiempo);

        tiempo += 3000;
      }
      m++;
      o++;
    });
    if (o == allJSONObjects.length && allJSONObjects.length != 0) {
      alert("todos los mensajes enviados");
    }
  } catch (error) {
    console.log("Si llego a esto es un error ", error);
  }
}

const container = {
  client: null,
};

async function star() {
  const client = await startAPI();
  container.client = client; // Almacena el cliente en el contenedor
  return client;
}

//--------------------------------------------
//       Envio de mensajes, muestra de info y validacion
//--------------------------------------------

async function datosTabla(n, celular, cliente, phone, mensaje) {
  let tableBody = document.getElementById("tbody");
  let estado;
  let descripcion;
  if (typeof celular == "number") {
    let numeroComoCadena = celular.toString();
    let cantidadDigitos = numeroComoCadena.length;

    if (cantidadDigitos == 8) {
      estado = `Enviado`;
      descripcion = `El número es correcto.`;
      messageSend(cliente, phone, mensaje).then(() =>
        console.log("Mensaje enviado")
      );
    } else if (cantidadDigitos > 8) {
      estado = `No enviado`;
      descripcion = `El número es incorrecto. Tiene más de 8 dígitos.`;
    } else {
      estado = `No enviado`;
      descripcion = `El número es incorrecto. Tiene menos de 7 dígitos.`;
    }
  } else {
    estado = "No es un número.";
  }
  tableBody.innerHTML += `<tr>${
    "<td>" +
    n +
    "</td>" +
    "<td>" +
    celular +
    "</td>" +
    "<td>" +
    estado +
    "</td>" +
    "<td>" +
    descripcion +
    "</td>"
  }</tr>`;
}

//--------------------------------------------
//       Uso de botones
//--------------------------------------------

document.getElementById("enviar").addEventListener("click", function () {
  envioMensaje();
  alert("iniciando mensajes");
});

document.getElementById("eliminar").addEventListener("click", function () {
  const eliminar = confirm("¿Esta seguro de eliminar la cuenta?");
  if (eliminar) {
    deleteLocalSession();
    sleepES5(2000);
    ralert(
      "Cuenta eliminada \n Recuerde que al eliminar la cuenta tambien tendria que eliminarlo de su dispositivo vinculado"
    );
  }
});
document.getElementById("iniciar").addEventListener("click", function () {
  star();
});
document.getElementById("generar").addEventListener("click", function () {
  startAPI();
});

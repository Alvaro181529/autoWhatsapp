//--------------------------------------------
//       Referenciar contenidos
//leer recibido y enviado                        |x
//jugar con el tiempo                            |x
//las palabras ambos                             |X
//pueden hacer de manera randomica               |X
//mostrar la lista de envidados                  |X
//validacion de numeros                          |X
//hacer que se pueda editar fraces randomicas    |X
//actualizar pagina                              |X
//SE ECONTRO UN ERROR EL ENVIO ES DE INMEDIATO   |x
//--------------------------------------------
const { startAPI, messageSend, deleteLocalSession, callStatus } = require("./api.js");
const { updateOnlineStatus } = require("./status.js");
const { ralert } = require("./refrescar.js");
const XLSX = require("xlsx");
const fs = require("fs");
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
//       Librerias de fraces
//--------------------------------------------

// Variable para almacenar las frases aleatorias
let frasesAleatorias = [];

// Función para cargar las frases al cargar la página
function cargarFrases() {
  const listaFrases = document.getElementById("lista-frases");
  listaFrases.innerHTML = "";

  frasesAleatorias.forEach((frase, index) => {
    const li = document.createElement("li");
    li.textContent = frase;
    li.setAttribute("data-index", index);
    li.addEventListener("click", seleccionarFrase);
    listaFrases.appendChild(li);
  });
}

// Función para agregar una nueva frase desde el textarea
function agregarFrase() {
  const nuevaFrase = document.getElementById("editor").value.trim();
  if (nuevaFrase !== "") {
    frasesAleatorias.push(nuevaFrase);
    cargarFrases();
    guardar();
    document.getElementById("editor").value = "";
  }
}

// Función para eliminar la frase seleccionada
function eliminarFrase() {
  const listaFrases = document.getElementById("lista-frases");
  const seleccionado = listaFrases.querySelector(".seleccionado");

  if (seleccionado) {
    const index = parseInt(seleccionado.getAttribute("data-index"));
    frasesAleatorias.splice(index, 1);
    cargarFrases();
    guardar();
  }
}

// Función para marcar la frase seleccionada
function seleccionarFrase(event) {
  const listaFrases = document.getElementById("lista-frases");
  const items = listaFrases.getElementsByTagName("li");

  // Desmarcar todas las frases
  Array.from(items).forEach((item) => {
    item.classList.remove("seleccionado");
  });

  // Marcar la frase seleccionada
  event.target.classList.add("seleccionado");
}

// Función para guardar las frases en un archivo (simulado)

// Cargar las frases al cargar la página

fs.readFile("frases.txt", "utf8", (err, data) => {
  if (err) throw err;
  frasesAleatorias = data.split("\n");
  console.log("Contenido del archivo leído:", frasesAleatorias);
});

function guardar() {
  console.log("Frases guardadas:", frasesAleatorias);
  const contenido = frasesAleatorias.join("\n");
  fs.writeFile("frases.txt", contenido, (err) => {
    if (err) throw err;
    console.log("Archivo frases.txt creado exitosamente");
  });
}

fetch("frases.txt")
  .then((response) => response.text())
  .then((data) => (document.getElementById("lista-frases").value = data));

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

function espTiem() {
  tiempo = Math.floor((300000 - 100000) * Math.random() + 10000);
  return tiempo;
}

function espEsp() {
  espera = Math.floor((150000 - 90000) * Math.random() + 100000);
}
function espCan() {
  cantidad = Math.floor(Math.random() * (40 - 20) + 20);
  return cantidad;
}

//--------------------------------------------
//       Inicio de Cliente y Recorrido del Array de Numeros
//--------------------------------------------
cantidad = espCan();
function envioMensaje() {
  try {
    m = 0;
    o = 0;
    let n = 1;
    allJSONObjects.forEach(async (objeto) => {
      const cliente = container.client;
      let nameItem = objeto[name_item];
      let tiempo = espTiem();
      espEsp();
      const fraseAleatoria = obtenerFraseAleatoria();
      const phone = code + nameItem + "@c.us";
      const mensaje = message + " " + fraseAleatoria;
      if (m == cantidad) {
        setTimeout(function () {
          let status = callStatus();
          console.log("funcion send (Espera)");
          datosTabla(n, nameItem, cliente, phone, mensaje, tiempo, status).then(
            () => n++
          );
        }, espera);
        espera += espera;
        m = -1;
      } else {

        setTimeout(function () {
          let status = callStatus();
          console.log("funcion send (Tiempo)");
          datosTabla(n, nameItem, cliente, phone, mensaje, tiempo, status).then(
            () => n++
          );
        }, tiempo);
        tiempo += tiempo;
      }
      console.log(n, nameItem, cliente, phone, mensaje, o);

      m++;
      o++;
    });
  } catch (error) {
    console.log("Si llego a esto es un error ", error);
  }
}

const container = {
  client: null,
};

async function star() {
  console.log("estas son las fraces", frasesAleatorias);
  const client = await startAPI();
  container.client = client; // Almacena el cliente en el contenedor
  return client;
}

//--------------------------------------------
//       Envio de mensajes, muestra de info y validacion
//--------------------------------------------

async function datosTabla(n, celular, cliente, phone, mensaje, tiempo, status) {
  let tableBody = document.getElementById("tbody");
  let estado;
  let descripcion;
  if (typeof celular == "number") {
    let numeroComoCadena = celular.toString();
    let primerNumero = numeroComoCadena[0];
    let cantidadDigitos = numeroComoCadena.length;
    if (cantidadDigitos == 8 && primerNumero == 7 || primerNumero == 8 || primerNumero == 6) {
      if (status == 3) {
        estado = `Leido`;

      } else if (status == 2) {
        estado = `Recibido`;

      } else if (status == 1 || status == "undefined" || status == undefined || status != 1) {
        estado = `Enviado`;

      }
      descripcion = `El número es correcto.`;
      messageSend(cliente, phone, mensaje).then(() => {
        if (n == allJSONObjects.length) {
          alert("se enviaron los mensajes");
        }
      });
    } else if (cantidadDigitos > 8) {
      estado = `No enviado`;
      descripcion = `El número es incorrecto. Ti  ene más de 8 dígitos.`;
    } else {
      estado = `No enviado`;
      descripcion = `El número es incorrecto. Tiene menos de 7 dígitos.`;
    }
  } else {
    estado = "No es un número.";
  }
  tableBody.innerHTML += `<tr>${"<td>" +
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
    "</td>" +
    "<td>" +
    tiempo / 10000 +
    " seg</td>"
    }</tr>`;
}
//--------------------------------------------
//       Uso de botones
//--------------------------------------------
document.getElementById("agregarFrase").addEventListener("click", function () {
  agregarFrase();
});

document.getElementById("eliminarFrase").addEventListener("click", function () {
  eliminarFrase();
});

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
  console.log("inicio de start");
  star();
  cargarFrases();
  // Oculta el botón y muestra el spinner
  this.style.display = 'none';
  document.getElementById('overlay').style.display = 'flex';

  // Simula la carga de elementos después de 10 segundos
  setTimeout(function () {
    // Agrega la clase oculto para ocultar los elementos
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('elementos').classList.remove('oculto');
  }, 15000); // 10000 milisegundos = 10 segundos
});

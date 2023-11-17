const { openDialog } = window.electron;

async function saveImage() {
  const result = await openDialog({
    properties: ["openFile"],
  });

  if (!result.canceled) {
    const filePath = result.filePaths[0];

    // Exponer solo ciertas API a la ventana de renderizado
    contextBridge.exposeInMainWorld("electron", {
      // Crear una función que enviará un mensaje al proceso principal
      openDialog: async (options) => {
        return await ipcRenderer.invoke("open-dialog", options);
      },
    });
  }
}

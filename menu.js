const { app, Menu } = require("electron");

const setMainMenu = () => {
  const template = [
    {
      label: "Help",
      submenu: [{ role: "about" }],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = {
  setMainMenu,
};

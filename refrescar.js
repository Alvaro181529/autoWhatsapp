const app =require('electron')
function ralert(contenido){
alert(contenido);
app.reloadIgnoringCache();
}
module.exports ={
    ralert
}
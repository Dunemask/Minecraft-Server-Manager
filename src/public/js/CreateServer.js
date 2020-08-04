function itemChanged(attr){
  const nameInput=document.getElementById(`server-name`);
  const ramInput=document.getElementById(`server-ram`);
  nameInput.value= nameInput.value? nameInput.value:'';
  ramInput.value= ramInput.value? ramInput.value:'';
  if(nameInput.value !='' && ramInput.value!='' && !isNaN(ramInput.value)){
    document.getElementById('submit-new-server').disabled=false;
  }else {
    document.getElementById('submit-new-server').disabled==true;
  }
}



function getServerDataFromPage(){
    const name=document.getElementById(`server-name`).value
    const ram=document.getElementById(`server-ram`).value
    const jarSelector = document.getElementById(`server-jar`);
    const selectedJar = jarSelector.options[jarSelector.selectedIndex].value;
    const pluginLines = document.getElementById(`server-plugins-selector`).querySelectorAll('input')
    let plugins = [];
    for(let j=0;j<pluginLines.length;j++){
      if(pluginLines[j].checked){
        plugins.push((pluginLines[j].id).replace('plugin-',''));
      }
    }

    let server = {
        name,
        ram,
        jar:selectedJar,
        plugins
      }
  return server;
}

function saveChanges(){
  let server = getServerDataFromPage();
  let url='create-new-server';
  let xhr = new XMLHttpRequest();
  console.log('SENDING');
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(server));
}

function addChangeListeners(){
    const nameInput=document.getElementById(`server-name`);
    const ramInput=document.getElementById(`server-ram`);
    nameInput.addEventListener("change", function(evt){itemChanged()});
    ramInput.addEventListener("change", function(evt){itemChanged()});
}
addChangeListeners();


document.getElementById('submit-new-server').addEventListener("click", function(evt) {
  saveChanges();
});

document.getElementById('submit-new-server').disabled=true;

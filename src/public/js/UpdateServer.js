let originalState = updateServers();

function itemChanged(name){
  let same=true;
  let curState = updateServers();
  for(s in curState){
    for(ss in originalState){
      if(originalState[ss].name==curState[s].name){
        if(!(originalState[ss].ram==curState[s].ram &&
           !isNaN(curState[s].ram) &&
           originalState[ss].jar==curState[s].jar&&
           originalState[ss].plugins.length==curState[s].plugins.length
         )
         ){
          same=false;
        }
        for(p in originalState[ss].plugins){updateServers();
          if(!curState[s].plugins.includes(originalState[ss].plugins[p])){
            same=false;
          }
        }
      }
    }
  }

    if(same){
      if(name){
        document.getElementById(`${name}-start-world`).hidden=false;
      }
      document.getElementById('server-changes').hidden=true;
    }else{
      if(name){
        document.getElementById(`${name}-start-world`).hidden=true;
      }
      document.getElementById('server-changes').hidden=false;
    }

}


function addChangeListeners(){
  const listItems = document.querySelectorAll('.server-options');
  for (let i = 0; i < listItems.length; i++) {
    const name=(listItems[i].id).replace('server-options-','');
    const ram=document.getElementById(`${name}-ram-option`);
    const jarSelector = document.getElementById(`${name}-jar-selector`);
    jarSelector.addEventListener("change", function(evt){itemChanged(name)});
    ram.addEventListener("change", function(evt){itemChanged(name)});
    const pluginLines = document.getElementById(`${name}-plugins-selector`).querySelectorAll('input')
    let plugins = [];
    for(let j=0;j<pluginLines.length;j++){
      pluginLines[j].addEventListener("change", function(evt){itemChanged(name)});
    }



}
}
addChangeListeners();


function updateServers(){
  const listItems = document.querySelectorAll('.server-options');
  let servers=[]
  for (let i = 0; i < listItems.length; i++) {
    const name=(listItems[i].id).replace('server-options-','');
    const ram=document.getElementById(`${name}-ram-option`).value
    const jarSelector = document.getElementById(`${name}-jar-selector`);
    const selectedJar = jarSelector.options[jarSelector.selectedIndex].value;
    const pluginLines = document.getElementById(`${name}-plugins-selector`).querySelectorAll('input')
    let plugins = [];
    for(let j=0;j<pluginLines.length;j++){
      if(pluginLines[j].checked){
        plugins.push((pluginLines[j].id).replace('plugin-',''));
      }
    }
    servers.push(
      {
        name,
        ram,
        jar:selectedJar,
        plugins
      }

    )
  }
  return servers;
}

function saveChanges(){
  let servers = updateServers();
    for(s in servers){
      document.getElementById(`${servers[s].name}-start-world`).hidden=false;
    }
    originalState = updateServers();
    itemChanged();
  let url='update-changes';
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  console.log(servers)
  xhr.send(JSON.stringify(servers));

}

document.getElementById('save-changes-button').addEventListener("click", function(evt) {
  saveChanges();

});

//Run Last in Script
document.getElementById('server-changes').hidden=true;

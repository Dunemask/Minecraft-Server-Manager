const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer  = require('multer')
const shell = require('shelljs');
const child_process = require('child_process');
const tk = require('tree-kill');
//Define Constants
const app = express()
const port = 3000;
const debuggingMode = false;
const viewOptions = { beautify: false };
const dbLocation = 'src/db.json';
const serverLocation = 'server-manager/servers/';
const pluginsLocation = 'server-manager/plugins/';
const jarsLocation = 'server-manager/jars/';
const openExplorer = require('open-file-explorer');
initializeBackend();
let jarList=updateJarList();
let pluginsList=updatePluginsList();
let ramInUse = 0;
global.serverInstances=[];
//Setup DB
var db = JSON.parse(fs.readFileSync(dbLocation));
function updateDB(){
  let data=JSON.stringify(db,null,1);
  fs.writeFileSync(dbLocation, data);
}

function updatePluginsList(){
  let pluginsList = [];
  filenames = fs.readdirSync(pluginsLocation);
  filenames.forEach(file => {
      pluginsList.push(file);
  });
return pluginsList;
}

function removeRunningInstance(name){
  for(i in global.serverInstances){
    if(global.serverInstances[i].server.name==name){
      global.serverInstances.splice(i, 1);
    }
  }
}

function updateJarList(){
  let jarList = [];
  filenames = fs.readdirSync(jarsLocation);
  filenames.forEach(file => {
    if(file!='BuildTools.jar' && file.includes('.jar')){
      jarList.push(file);
    }

  });

return jarList;
}
function createWorld(name,ram,jar,plugins){
  //Check for Duplicates
  for(i in db.servers){
    if(db.servers[i].name==name){
      return false;
    }
  }
  //Create Server
  db['servers'].push(
      {
      "name":name,
      "ram":ram,
      "jar":jar,
      "plugins":plugins
    })
    return true;
}

function deleteWorld(name,deleteFiles){ //TODO
  for(i in db.servers){
    if(db.servers[i].name==name){
      db.servers.splice(i, 1);
      break;
    }
  }
  if(deleteFiles){
    console.log("Would Remove World Files")
  }
}

function stopWorld(name){
  for(i in global.serverInstances){
    if(global.serverInstances[i].server.name==name){
      let pid = global.serverInstances[i].process.pid;
      tk(pid); //Tree KIll
      ramInUse-= parseInt(global.serverInstances[i].server.ram);
      ramInUse = ramInUse>0? 0:ramInUse;
      removeRunningInstance(name);
      return true;
    }
  }

  return false;

}
function updateServer(server){
  for(s in db.servers){
    if(db.servers[s].name==server.name){
      db.servers[s]=server;
      return;
    }
  }
  return true;
}

function startWorld(name){
  let server;
  for(i in db.servers){
    if(db.servers[i].name==name){
      server=db.servers[i];
      break;
    }
  }
  if(!server){
    return 'Server Not Found!';}
  if(parseInt(server.ram)+ramInUse>db.ramCapacity){
    return 'Launching a new Instance Uses Too Much Ram!'
  }

  let serverDir=serverLocation+`${name}/`
  if(!fs.existsSync(serverDir)){
    fs.mkdirSync(serverDir);
    if(!fs.existsSync(`${serverDir}eula.txt`)){
      fs.copyFileSync(`server-manager/default_eula.txt`, `${serverDir}eula.txt`,fs.constants.COPYFILE_EXCL);
    }
    if(!fs.existsSync(`${serverDir}ops.json`)){
      fs.copyFileSync(`server-manager/default_ops.json`, `${serverDir}ops.json`,fs.constants.COPYFILE_EXCL);
    }
    fs.copyFileSync(`${jarsLocation}${server.jar}`, `${serverDir}${server.jar}`,fs.constants.COPYFILE_EXCL);
  }
  //Plugins Remove all and Recopy
  fs.rmdirSync(`${serverDir}plugins/`, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }
  });
  fs.rmdirSync(`${serverDir}mods/`, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }
  });
  fs.mkdirSync(`${serverDir}plugins/`);
  fs.mkdirSync(`${serverDir}mods/`);
  for(i in server.plugins){
      fs.copyFileSync(`${pluginsLocation}${server.plugins[i]}`, `${serverDir}plugins/${server.plugins[i]}`,fs.constants.COPYFILE_EXCL);
      fs.copyFileSync(`${pluginsLocation}${server.plugins[i]}`, `${serverDir}mods/${server.plugins[i]}`,fs.constants.COPYFILE_EXCL);
  }
  //Jar Setup
  if(!fs.existsSync(`${serverDir}${server.jar}`)){
    fs.copyFileSync(`${jarsLocation}${server.jar}`, `${serverDir}${server.jar}`,fs.constants.COPYFILE_EXCL);
  }
  let command=`/usr/bin/java -Xmx${server.ram}M -Xms${server.ram}M -jar ${server.jar} nogui`;
  let cp=child_process.exec(command,{cwd:`${serverDir}`,detached: true});
/*  cp.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});*/
  /*cp.stderr.on('data', (data) => {
  console.log(`child stderr:\n${data}`);
});*/
cp.addListener('close', (evt) =>{
  console.log('Closed!');
  removeRunningInstance(name);
});
  global.serverInstances.push({ server:server,process:cp});
  ramInUse+=parseInt(server.ram);
  return 'started';
}

function initializeBackend(){
  if(!fs.existsSync('server-manager/')){
    fs.mkdirSync('server-manager/');}
  if(!fs.existsSync(serverLocation)){
    fs.mkdirSync(serverLocation);}
  if(!fs.existsSync(jarsLocation)){
    fs.mkdirSync(jarsLocation);}
  if(!fs.existsSync(pluginsLocation)){
    fs.mkdirSync(pluginsLocation);}
  updateJarList();
  updatePluginsList();
}
//Set Up Express session and View engine
app.use(session({secret: 'ssshhhhh',saveUninitialized: false,resave: false}));
app.use(express.static('src/public/', {dotfiles:'deny'} ))
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine(viewOptions));
app.use(bodyParser.json({limit: '50mb'})) // parse application/json
app.use(bodyParser.urlencoded({ limit:'50mb', extended: false})) // parse application/x-www-form-urlencoded
//Router Plain Requests
app.get('/', checkCredentials, function (req, res) {
    res.redirect('/control-panel');
});

app.get('/control-panel', checkCredentials, function (req, res) {
    res.render('ControlPanel.jsx',{servers:db.servers,
                                  ramCapacity:db.ramCapacity,
                                  riu:ramInUse,
                                  jarList,
                                  pluginsList

                                });
});

app.get('/create-server', checkCredentials, function (req, res) {
    res.render('ControlPanel.jsx',{servers:db.servers,
                                  ramCapacity:db.ramCapacity,
                                  riu:ramInUse,
                                  jarList,
                                  pluginsList,
                                  content:'create'
                                });
});


//Server Control

app.get('/open-server-directory',checkCredentials,function(req,res){
  let name = req.query.name
  if(fs.existsSync(serverLocation+name)){
    openExplorer(serverLocation+name, err => {
      if(err) {
          console.log(err);
      }
      else {
          console.log('Gucci?');
      }
  });
  }

res.redirect('/');

});



app.post('/update-changes',checkCredentials,function(req,res){
    let err;
    for(server in req.body){
      let err = updateServer(req.body[server]);
      if(err){
        console.log('ERROR UPDATING')
        break;
      }
    }
    if(!err){
      updateDB();
    }
    res.redirect('/');

});

app.post('/create-new-server',checkCredentials,function(req,res){
      let err;
      for(s in db.servers){
        if(db.servers[s].name==req.body.name){
          err=True;
        }
      }
    if(!err){
      filenames = fs.readdirSync(serverLocation);
      filenames.forEach(file => {
          if(req.body.name==file){
          let counter=0;
          let backupLocation=`${serverLocation}${file}-old(${counter})`;
          do{
              counter++
              backupLocation=`${serverLocation}${file}-old(${counter})`;
          }while(fs.existsSync(backupLocation));

          fs.renameSync(`${serverLocation}${file}`, backupLocation, err => {
          if(err)
            return console.error(err);
          });
          }
      });
      db.servers.push(req.body);
      updateDB();
    }
    res.redirect('/');

});

app.get('/stop-all',checkCredentials,function(req,res){
  let length = global.serverInstances.length;
  for(let i = 0;i < length;i++){
    let success = stopWorld(global.serverInstances[0].server.name)
    if(!success){
      console.log('ERROR STOPPING SERVER: '+global.serverInstances[s].name);
    }
  }
  res.redirect('/');
});

app.get('/stop-world',checkCredentials, function (req, res) {
      let name = req.query.name
      for(s in global.serverInstances){
        let success
        if(global.serverInstances[s].server.name==name){
          success = stopWorld(name)
        }
        if(!success){
          console.log('ERROR STOPPING SERVER: '+name);
        }
      }
      res.redirect('/');
});

app.get('/delete-world',checkCredentials, function (req, res) {
      let name = req.query.name
      deleteWorld(name,false); //false means keep files
      updateDB();
      res.redirect('/');

});

app.get('/start-world',checkCredentials, function (req, res) {
      let name = req.query.name
      let status = startWorld(name);
      if(status!='started'){
        console.log(status)
      }
      res.redirect('/');
});

//Upload Events
app.post('/uploadWorld',checkCredentials,function(req,res){
});

app.post('/credentialsChange',checkCredentials,function(req,res){

});

app.get('/worldDownload',checkCredentials, function (req, res){
    let path = req.originalUrl.substring(23,req.originalUrl.length)
    let file = __dirname+"/uploads/public/"+path;
    res.download(file);
});
//Authentication
app.get('/logout',function(req,res){
  delete req.session.user_id;
  res.redirect('/');
  if (req.session.returnTo) {
    delete req.session.returnTo
  }
});
app.post('/logout',function(req,res){
  res.redirect('/logout');
});

app.post('/login',function(req,res){
  let username = req.body.username?req.body.username:undefined;
  let password = req.body.password;
  let isValid = db.username==username && db.password==password;
  if(isValid)
    req.session.user_id=0;
  res.redirect('/');

});
app.get('/login', function (req, res) {
      res.render('Login.jsx');
});
function checkCredentials(req, res, next) {
    req.session.user_id=0;
    if (req.session.user_id!=undefined || req.path==='/login') {
        next();
    } else {
       res.redirect( `/login`);
    }
}
//Server Handlers
app.get('/page-not-found',function(req,res){
    res.redirect( `/`);
});
//Debugging mode Handler
if(!debuggingMode){
  app.get('*', function(req, res) {
      res.redirect('/page-not-found');
  });
  app.post('*', function(req, res) {
      res.redirect('/page-not-found');
  });
}
//Serve App
function startServer() {
    server = app.listen(port, function () {
        console.log('Node version:' + process.versions.node);
        console.log(`Web Server listening on port ${port}!`);
    });
      server.timeout = 10 * 60 * 1000;
    server.on('connection', function(socket) {
        // 10 minutes timeout
        socket.setTimeout(10 * 60 * 1000);
    });

}
startServer();

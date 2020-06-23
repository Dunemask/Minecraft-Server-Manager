const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer  = require('multer')
const shell = require('shelljs');
const child_process = require('child_process');
//Define Constants
const app = express()
const port = 3000;
const debuggingMode = false;
const viewOptions = { beautify: false };
const dbLocation = 'src/db.json';
const serverLocation = 'server-manager/servers/';
const pluginsLocation = 'server-manager/plugins/';
const jarsLocation = 'server-manager/jars/';
global.serverInstances=[];
//Setup DB
var db = JSON.parse(fs.readFileSync(dbLocation));
function updateDB(){
  let data=JSON.stringify(db,null,1);
  fs.writeFileSync(dbLocation, data);
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

function deleteWorld(name,keepFiles){ //TODO
  for(i in db.servers){
    if(db.servers[i].name==name){
      db.servers.splice(i, 1);
      break;
    }
  }
  if(!keepFiles){
    console.log("Would Remove World Files")
  }
}

function stopWorld(name){
  for(i in global.serverInstances){
    if(global.serverInstances[i].name==name){
      global.serverInstances[i].process.kill();
      return true;
    }
  }
  return false;

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
    return false;}

  let serverDir=serverLocation+`${name}/`

  if(!fs.existsSync(serverDir)){
    fs.mkdirSync(serverDir);
    if(!fs.existsSync(`${serverDir}eula.txt`)){
      fs.copyFileSync(`server-manager/default_eula.txt`, `${serverDir}eula.txt`,fs.constants.COPYFILE_EXCL);
    }
    fs.copyFileSync(`${jarsLocation}${server.jar}`, `${serverDir}${server.jar}`,fs.constants.COPYFILE_EXCL);
  }
  if(!fs.existsSync(`${serverDir}plugins/`)){
    fs.mkdirSync(`${serverDir}plugins/`);
  }
  
  for(i in server.plugins){
    if(!fs.existsSync(`${serverDir}plugins/${server.plugins[i]}.jar`)){
      fs.copyFileSync(`${pluginsLocation}${server.plugins[i]}.jar`, `${serverDir}plugins/${server.plugins[i]}.jar`,fs.constants.COPYFILE_EXCL);
    }
  }

  if(!fs.existsSync(`${serverDir}${server.jar}`)){
    fs.copyFileSync(`${jarsLocation}${server.jar}`, `${serverDir}${server.jar}`,fs.constants.COPYFILE_EXCL);
  }

  global.serverInstances.push({ name:name,
                                process:child_process.exec(`cd ${serverDir} && java -Xmx${server.ram}M -Xms${server.ram}M -jar ${server.jar} nogui`, { async: true })});
  console.log('Running Server: '+name)
}

function initializeBackend(){


}

initializeBackend();
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
    res.render('ControlPanel.jsx',{serverInstances:serverInstances});
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

# Minecraft Server Manager
Minecraft Application for managing servers
## About
 This application was developed using a React front end and an express backend.

The manager is a tool to simplify and automate some of the redundant tasks of modifying servers frequently. It's very simple to drag and drop minecraft versions, plugins/mods, and worlds into the correct folders. 

## Features

### Simplistic Server Creation
![Image Not Found](https://raw.githubusercontent.com/Dunemask/Minecraft-Server-Manager/master/images/Server-Creation.png)

### Easy Multi-Server Management
![Image Not Found](https://raw.githubusercontent.com/Dunemask/Minecraft-Server-Manager/master/images/Server-Management.png)



## Download and Run

### Requirements

1. This Project requires Nodejs which can be found
[here](https://nodejs.org/en/download/)
2. Basic understanding of commandline tools
3. A minecraft server jar to create your first server

### Download and Run
#### From a command prompt run these commands in order:
<div style="background-color:rgba(0, 0, 0, 0.0470588); text-align:left; padding:40px; border-radius:4px;">
<div style="margin:auto;">
    git clone https://github.com/Dunemask/Minecraft-Server-Manager.git
    <br/>
    cd Minecraft-Server-Manager
    <br/>
    npm install
    <br/>
    npm start
</div>
</div>

#### Post Setup
1. Quit out of the commandline and close the application. 

2. Download a spigot, forge or vanilla
 minecraft server jar and drop it into the folder
"Minecraft-Server-Manager" -> "server-manager" -> "jars"

3. Reopen a command prompt and run

<div style="background-color:rgba(0, 0, 0, 0.0470588); text-align:left; padding:40px; border-radius:4px;">
<div style="margin:auto;">
    npm start
</div>
</div>

4. Open a browser and go to [localhost:3000](http://localhost:3000)


## Planned Features
* Automatic update of resource folders
* Admin Settings Page Frontend
* Seemless server integration 






var React = require('react');
var DefaultHead = require('./comps/DefaultHead');
var Overview = require('./pages/Overview');
var Rcon = require('./pages/Rcon');
var CreateServer = require('./pages/CreateServer');
var Settings = require('./pages/Settings');
const title="Control Panel";
let openPanel = "Overview";
class ControlPanel extends React.Component {
  constructor(props) {
  super(props);
    this.contentType=props.content;
    this.props = props;
  }

  render() {

    this.pageContent = function(){
      if(this.contentType=='rcon'){
        return <Rcon {...this.props}/>
      }
      if(this.contentType=='settings'){
          return <Settings {...this.props}/>
      }
      if(this.contentType=='create'){
        return <CreateServer {...this.props}/>
      }
      return <Overview {...this.props}/>
    }

  return (
    <html>
      <head>
            <DefaultHead />
          <title>{title}</title>
      </head>
      <body>
      <div className="page">
      <div className="topbar">
        <h1>Minecraft Server Manager</h1>
      </div>
        <div className="sidenav-wrapper">
          <div className="sidenav">
            <div className="link-wrapper">
              <h2>Navigation</h2>
              <ul>
                <li><a href="/control-panel">Overview</a></li>
                <li><a href="/create-server">Create Server</a></li>
                <li><a href="/settings">Settings</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
            {this.pageContent()}
        </div>
      </div>
      </body>
    </html>
  );//Close Return
}//Close Render
}
module.exports = ControlPanel;

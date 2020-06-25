var React = require('react');
var DefaultHead = require('./comps/DefaultHead');
var Overview = require('./pages/Overview');
var Rcon = require('./pages/Rcon');
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

      return <Overview {...this.props}/>
    }

  return (
    <html>
      <head>
            <DefaultHead />
          <title>{title}</title>
      </head>
      <body>
        <div className="sidebar-wrapper">
          <div className="sidebar">
            <ul>
              <li><a href="/control-panel">Overview</a></li>
              <li><a href="/rcon">Rcon</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="content-wrapper">
            {this.pageContent()}
        </div>
      </body>
    </html>
  );//Close Return
}//Close Render
}
module.exports = ControlPanel;

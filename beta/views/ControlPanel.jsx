var React = require('react');
var DefaultHead = require('./comps/DefaultHead');
var Overview = require('./pages/Overiew');
const title="Control Panel";
let openPanel = "Overview";
class ControlPanel extends React.Component {
  constructor(props) {
  super(props);
  }
  render() {
  this.content = function(){
    return (<Overview {...this.props.serverInstances}/>);
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
              <li><a href="/start-and-stop">Start/Stop</a></li>
              <li><a href="/rcon">Rcon</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="content-wrapper">
            {this.content}
        </div>
      </body>
    </html>
  );//Close Return
}//Close Render
}
module.exports = ControlPanel;

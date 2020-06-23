var React = require('react');
var DefaultHead = require('./comps/DefaultHead');
var Overview = require('./pages/Overview');
var StartStop = require('./pages/StartStop');
const title="Control Panel";
let openPanel = "Overview";
class ControlPanel extends React.Component {
  constructor(props) {
  super(props);
  }
  render() {
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
            <StartStop {...this.props.serverInstances}/>
        </div>
      </body>
    </html>
  );//Close Return
}//Close Render
}
module.exports = ControlPanel;

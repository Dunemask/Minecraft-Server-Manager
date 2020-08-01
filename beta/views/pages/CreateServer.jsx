var React = require('react');
module.exports = class CreateServer extends React.Component {
  constructor(props) {
  super(props);
  this.jarList=props.jarList;
  this.fullPluginList=props.pluginsList;
  }
  render() {
    let jarList = this.jarList.length > 0
      && this.jarList.map((item, i) => {
      return (
        <option key={i} value={item}>{item}</option>
      )
    }, this);

  return (
    <div id="create-server-wrapper">
      <div id="create-server">
      <h1>Create new Server</h1>
        <div className="create-server-options">
          <div className="create-server-options-name">
            <h2>Server Name</h2>
            <input type="text" id="server-name"></input>
          </div>
          <div className="create-server-options-ram">
            <h2>Server Ram</h2>
            <input type="text" id="server-ram"></input>
          </div>
          <div className="create-server-options-jar">
            <h2>Jar Selector</h2>
            <select id="server-jar">
              {jarList}
            </select>
          </div>
          <div className="create-server-options-plugins" id="server-plugins-selector">
            <h2>Plugin Selector</h2>
            <ul>
            {
              this.fullPluginList.map((item, i) => {
              return (
                  <li key={`plugin-${item}`}>
                    <label htmlFor={`plugin-${item}`}>{item} </label>
                      <input type="checkbox"
                              id={`plugin-${item}`}
                              name={`plugin-${item}`}
                              defaultChecked={false}/>
                  </li>
              )
            }, this)
            }
            </ul>
          </div>
        </div>
        <button id="submit-new-server">Create New Server</button>
      </div>
        <script type="text/javascript" src="/js/CreateServer.js"></script>
    </div>
  );
}
}

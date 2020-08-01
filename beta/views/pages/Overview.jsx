var React = require('react');
var DynamicDropdown = require('../comps/DynamicDropdown');
var ToggleButton = require('react-toggle-button');
module.exports = class Overview extends React.Component {
  constructor(props) {
  super(props);
    this.props = props;
    let instanceNames=[]
    this.servers = []
    for(server in global.serverInstances){
      instanceNames.push(global.serverInstances[server].server.name)
    }


    for(server in props.servers){
      if(!instanceNames.includes(props.servers[server].name)){
        this.servers.push(props.servers[server])
      }
    }
    this.ramInUse=props.riu;
    this.ramCapacity=props.ramCapacity;
    this.jarList=props.jarList;
    this.fullPluginList=props.pluginsList;
    this.selectedPlugins =[];
  }
  render() {
      let jarList = this.jarList.length > 0
        && this.jarList.map((item, i) => {
        return (
          <option key={i} value={item}>{item}</option>
        )
      }, this);

  if(this.servers.length==1){
    this.selectedServer=this.servers[0]
  }

  return (
    <div id="overview">
    <div id="overview-wrapper">
        <div id='overview-and-ram'>
          <h1>Overview</h1>
          <div className="ram-usage"><h3>Total Ram: {this.ramInUse}/{this.ramCapacity}</h3></div>
        </div>
        <div className="running-instance-control">
          <h1>Running Instances</h1>
          {global.serverInstances.length == 0 &&
            <h3>No Servers Running!</h3>

          }
          {global.serverInstances.length > 0 &&
            <a href="/stop-all"id="stop-all-running">Stop All</a>}
          <div className="running-instances">
          <ul>
              {global.serverInstances.map((si,index) => (
                <li key={index}>
                <h2>{si.server.name}</h2>
                <a href={`/stop-world?name=${si.server.name}`}>Stop {si.server.name}</a>
                <h3>Ram Allocated To Server: {si.server.ram}</h3>
                </li>
              ))}
              </ul>
          </div>
        </div>
        <div className="all-servers-control">
        <h1>Server Database</h1>
        {this.servers.length == 0 &&
          <h3>No Servers Exist Yet!</h3>

        }
          <ul className="all-servers-control-container">
          {this.servers.length > 0
            && this.servers.map((server, i) => {
            return (
              <li key={server.name} className='created-server-container'>
              <div className="created-server">
                <div id={`server-options-${server.name}-selector`}>
                  <h2>{server.name} - Options</h2>
                </div>
                  <div id={`server-options-${server.name}`} className="server-options">
                    <div className="selected-server-general-option">
                      <div className="ram-option">
                        <h3>Ram:</h3>
                        <input type="text" name="selected-server-ram-usage" defaultValue={server.ram}
                        id={`${server.name}-ram-option`}
                        ></input>
                      </div>
                    </div>
                    <div className="selected-server-general-option">
                      <h3>Version:</h3>
                      <div className="jar-option">
                        <select defaultValue={server.jar} className='selectedjar' id={`${server.name}-jar-selector`}>
                          {jarList}
                        </select>
                      </div>
                    </div>
                    <div className="plugins-selector" id={`${server.name}-plugins-selector`}>
                    <h2>Plugins/Mods Selection</h2>
                      <ul>
                      {
                        this.fullPluginList.map((item, i) => {
                        let pluginSelected= server? server.plugins.includes(item):false;
                        return (
                            <li key={`plugin-${item}`}>
                              <label htmlFor={`${server.name}-plugin-${item}`}>{item} </label>
                                <input type="checkbox"
                                        id={`plugin-${item}`}
                                        name={`${server.name}-plugin-${item}`}
                                        defaultChecked={pluginSelected}/>
                            </li>
                        )
                      }, this)
                      }
                      </ul>
                    </div>
                    <div className="selected-server-actions">
                      <a href={`/start-world?name=${server.name}`} id={`${server.name}-start-world`}>Start</a>
                      <a href={`/delete-World?name=${server.name}`} id={`${server.name}-delete-world`}>Delete</a>
                      <a href={`/open-server-directory?name=${server.name}`}>Open Directory</a>
                    </div>
                  </div>
                </div>
              </li>
            )
          }, this)
        }
        </ul>
        <div id="server-changes">
          <button id={`save-changes-button`}>Save</button>
          <a href="/" id="discard-changes-button">Discard</a>
        </div>
        </div>
      </div>
      <script type="text/javascript" src="/js/UpdateServer.js"></script>
    </div>
  );
}
}

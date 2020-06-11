var React = require('react');
module.exports = class DefaultHead extends React.Component {
  render() {
  return (
    <div className="sidebar-wrapper">
      <div className="sidebar">
        <ul>
          <li><a href="">Running Servers</a></li>
        </ul>
      </div>
    </div>
  );
}
}

var React = require('react');
module.exports = class Overview extends React.Component {
  constructor(props) {
  super(props);
    this.props = props;
    this.ramInUse=props.riu;
    this.ramCapacity=props.ramCapacity;
    console.log(`${this.ramInUse}/${this.ramCapacity}`);
  }
  render() {

  return (
    <div id="overview-wrapper">
      <div id="overview">
        <div className="ram-usage">Total Ram: {this.ramInUse}/{this.ramCapacity}</div>
      </div>
    </div>
  );
}
}

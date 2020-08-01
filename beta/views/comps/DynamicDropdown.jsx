var React = require('react');
module.exports = class DynamicDropdown extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		items: [
			{name: 'Afghanistan'},
			{name: 'Aland Islands'},
			{name: 'Albania'}
		]
	};
}

render () {
    const { items } = this.state;
    let itemList = items.length > 0
    	&& items.map((item, i) => {
      return (
        <option key={i} value={item.name}>{item.name}</option>
      )
    }, this);

    return (
      <div>
        <select>
          {itemList}
        </select>
      </div>
    );
  }
}

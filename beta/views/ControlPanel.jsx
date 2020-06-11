var React = require('react');
var DefaultHead = require('./comps/DefaultHead');
const title="Control Panel";
class MainPage extends React.Component {
  render() {
  return (
    <html>
    <head>
          <DefaultHead />
        <title>{title}</title>
    </head>
    <body>
      
    </body>
    </html>
  );//Close Return
}//Close Render
}
module.exports = MainPage;

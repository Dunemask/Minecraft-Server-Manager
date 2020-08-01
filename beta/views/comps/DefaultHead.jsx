var React = require('react');
module.exports = class DefaultHead extends React.Component {
  render() {
  return (
    <>
    <link rel="shortcut icon" href="/favicon.png" />
    <link rel="stylesheet" type="text/css" href="/css/Dropdown.css"></link>
    <link rel="stylesheet" type="text/css" href="/css/Sidenav.css"></link>
    <link rel="stylesheet" type="text/css" href="/css/Content.css"></link>
    <link rel="stylesheet" type="text/css" href="/css/Overview.css"></link>
    <meta name="viewport" content="width=device-width, initial-scale=.75"/>
    <script src="https://use.fontawesome.com/86339af6a5.js"/>
    </>
  );
}
}

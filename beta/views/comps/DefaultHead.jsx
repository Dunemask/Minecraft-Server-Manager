var React = require('react');
module.exports = class DefaultHead extends React.Component {
  render() {
  return (
    <>
    <link rel="shortcut icon" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=.75"/>
    <script src="https://use.fontawesome.com/86339af6a5.js"/>
    </>
  );
}
}

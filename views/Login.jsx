var React = require('react');
var DefaultHead = require('./comps/DefaultHead');
const title="Login";
class AuthUser extends React.Component {
	render(){
	  return (
	<html lang="en">
	<head>
		<DefaultHead/>
		<title>{title}</title>
	</head>
	<body>
				<div id="login-box">
  					<div className="login-form">
  								<form action="/login" method="POST" id="login">
  									<div className="formelm">
  										<label htmlFor="username">Username:</label>
  										<input id="username" name="username" type="text" required/>
  							  	</div>
  									<div className="formelm">
  										<label htmlFor="password">Password:</label>
  										<input id="password" name="password" type="password" required/>
  									</div>
  									<div className="formelm">
  										<div className="submit-button">
  											<input type="submit" value="Login"/>
  									 </div>
  								 </div>
  								</form>
				     </div>
			</div>
	</body>
	</html>
);
}}

module.exports = AuthUser;

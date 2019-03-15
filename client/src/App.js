import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import SignUpSignIn from "./SignUpSignIn";
import TopNavbar from "./TopNavbar";
import Secret from "./Secret";
import About from "./About";
import Contact from "./Contact";
import LandingPage from "./LandingPage";

class App extends Component {
  constructor() {
    super();
    this.state = {
      signUpSignInError: "",
      authenticated: localStorage.getItem("token") || false
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(credentials) {
    const { username, password, confirmPassword } = credentials;
    if (!username.trim() || !password.trim()) {
      this.setState({
        signUpSignInError: "Must Provide All Fields!"
      });
    } else if (password !== confirmPassword) {
      this.setState({
        signUpSignInError: "Password and Confirm Password do not match!"
      });
    } else {
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      }).then(res => {
        console.log('first then res: ', res);
        return res.json();
      }).then(data => {
        console.log('second then data: ', data)
        if (data.error) {
          this.setState({
            signUpSignInError: data.error
          });
        } else {
          // destructuring data.token
          const { token } = data;
          // setItem method on built in web api Storage object takes a key and value as parameters
          // if the key/value pair doesn't exist, it is set, if the key exists, the value is overwritten 
          // with new value
          localStorage.setItem("token", token);
          this.setState({
            signUpSignInError: "",
            authenticated: token
          });
        }
      });
    }
  }

  handleSignIn(credentials) {
    // this route doesn't yet exist
    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(res => {
      if (res.status === 401) {
        this.setState({
          signUpSignInError: 'Login is invalid'
        })
      } else res.json()
    }).then(data => {
      const { token } = data;
      localStorage.setItem('token', token);
      this.setState({
        signUpSignInError: '',
        authenticated: token
      })
    })
  }

  handleSignOut() {
    localStorage.removeItem("token");
    this.setState({
      authenticated: false
    });
  }

  renderSignUpSignIn() {
    return (
      <SignUpSignIn
        error={this.state.signUpSignInError}
        onSignUp={this.handleSignUp}
        onSignIn={this.handleSignIn}
      />
    );
  }

  renderApp() {


    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <h1>I am protected!</h1>} />
          <Route exact path="/secret" component={Secret} />
          <Route exact path="/home" component={LandingPage} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route render={() => <h1>NOT FOUND!</h1>} />
        </Switch>
      </div>
    );
  }

  render() {
    let whatToShow = "";
    if (this.state.authenticated) {
      whatToShow = this.renderApp();
    } else {
      whatToShow = this.renderSignUpSignIn();
    }

    return (
      <BrowserRouter>
        <div className="App">
          <TopNavbar
            showNavItems={this.state.authenticated}
            onSignOut={this.handleSignOut} />
          {whatToShow}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

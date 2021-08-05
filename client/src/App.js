import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Home from './pages/home';
import Contact from './pages/contact';
  
class App extends Component {
  render() {
    return (
       <Router>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route exact path='/contact' component={Contact}/>
            </Switch>
       </Router>
   );
  }
}
  
export default App;
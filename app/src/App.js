
import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './pages/home';
import Contact from './pages/contact';


class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/contact' component={Contact}/>
          
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    )
  }
}


export default App;
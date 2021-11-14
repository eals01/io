import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import FrontPage from './pages/FrontPage'
import CreateUser from './pages/CreateUser'
import Lobby from './pages/Lobby'

import './App.scss'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <FrontPage />
        </Route>
        <Route exact path='/lobby/createUser'>
          <CreateUser />
        </Route>
        <Route exact path='/lobby'>
          <Lobby />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;

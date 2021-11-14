import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import FrontPage from './pages/FrontPage'
import CreateUser from './pages/CreateUser'

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
      </Switch>
    </Router>
  )
}

export default App;

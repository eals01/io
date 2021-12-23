import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import FrontPage from './pages/FrontPage'
import CreateUser from './pages/CreateUser'
import Lobby from './pages/Lobby'
import GameRoom from './pages/GameRoom/GameRoom'

import './App.scss'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <FrontPage />
        </Route>
        <Route exact path='/lobby/create-user'>
          <CreateUser />
        </Route>
        <Route exact path='/lobby'>
          <Lobby />
        </Route>
        <Route exact path='/game-room'>
          <GameRoom />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;

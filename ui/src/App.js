import './App.css';
import { Route, Switch } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SponsorPage from './components/pages/SponsorPage';
import ErrorPage from './components/pages/ErrorPage';

function App() {
  return (

        <Switch>
          <Route path='/' component={HomePage} exact/>
          <Route path='/sponsor' component={SponsorPage} />
          <Route component={ErrorPage} />
        </Switch>

  );
}

export default App;

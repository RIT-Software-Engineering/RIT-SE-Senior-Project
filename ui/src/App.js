import './App.css';
import { Route, Switch } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SponsorPage from './components/pages/SponsorPage';
import ProposalPage from './components/pages/ProposalPage';
import ErrorPage from './components/pages/ErrorPage';
import AdminPage from './components/pages/AdminPage';

function App() {
  return (

        <Switch>
          <Route path='/' component={HomePage} exact/>
          <Route path='/sponsor' component={SponsorPage} />
          <Route path='/proposalForm' component={ProposalPage} />
          <Route path='/admin' component={AdminPage} />
          <Route component={ErrorPage} />
        </Switch>

  );
}

export default App;

import { Fragment } from "react";
import { Route, BrowserRouter } from 'react-router-dom';
import Landing from './Landing';
import NovelPage from './NovelPage';

const App = () => {

  return (
    <Fragment>
      <BrowserRouter>
        <div className="ui container">
          <Route exact path="/" component={Landing}></Route>
          <Route path="/novel/:name" component={NovelPage}></Route>
        </div>
      </BrowserRouter>


    </Fragment>
  );
};

export default App;

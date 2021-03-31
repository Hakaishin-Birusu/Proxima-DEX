import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Layout from "./components/layout";
import Staking from "./components/staking";
import PairGovernance from "./components/PairGovernance";
import Swap from "./components/Swap";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Layout>
          {/* <Route path="/" exact component={Home} /> */}
          <Route path="/" exact component={Staking} />
          <Route path="/governance" exact component={PairGovernance} />
          <Route path="/rewards" exact component={Swap} />
        </Layout>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

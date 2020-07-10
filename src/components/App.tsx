import React, { useReducer, useMemo } from "react";
import { AuthProvider } from "./auth/context";
import { userAuth, initialState } from "./auth/reducer";
import { handleGuest } from "./auth/actions";
import Card from "./matching/card";
import Header from "./header/header";
import { FlexContainer } from "./common/style";
import Leaderboard from "./leaderboard/leaderboard";
import { Tabs, Tab, Panel } from "./common/tabs/tabs";

import "./App.css";

const App: React.FC = () => {
  const [state, dispatch]: any = useReducer(userAuth, initialState);
  useMemo(() => {
    // Perhaps add refresh here
    if (state.user.role === "guest" || null) handleGuest(dispatch);
  }, []);

  return (
    <AuthProvider value={[state, dispatch]}>
      <Header />
      <main className="container">
        <Tabs>
          <Tab label="fight">Fight</Tab>
          <Tab label="leaderboard">Leaderboard</Tab>
          <Panel label="fight">
            <div>
              <FlexContainer>
                <Card />
              </FlexContainer>
            </div>
          </Panel>
          <Panel label="leaderboard">
            <div>
              {state.isFetching ? (
                "Loading..."
              ) : (
                <FlexContainer>
                  <Leaderboard />
                </FlexContainer>
              )}
            </div>
          </Panel>
        </Tabs>
      </main>
    </AuthProvider>
  );
};

export default App;

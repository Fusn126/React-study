import React, { useReducer } from "react";

import './App.css'
import GlobalStats from './components/GlobalStats'
import CountriesChart from './components/CountriesChart'
import SelectDataKey from './components/SelectDataKey'

import HistoryChartGroup from "./components/HistoryChartGroup";

import { useCoronaAPI } from './hooks/useCoronaAPI'

const initialState = {
  key: "cases",
  country: null,
  lastDays: {
    cases: 30,
    deaths: 30,
    recovered: 30,
  },
};
  
function reducer(state, action) {
  switch (action.type) {
    case "SET_KEY":
      return { ...state, key: action.key };
    case "SET_COUNTRY":
      return { ...state, country: action.country };
    case "SET_LASTDAYS":
      return {
        ...state,
        lastDays: { ...state.lastDays, [action.key]: action.days },
      };
    default:
      return state;
  }
}
  
// 用于传递 dispatch 的 React Context
export const AppDispatch = React.createContext(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { key, country, lastDays } = state;
  
  const globalStats = useCoronaAPI("/all", {
    initialData: {},
    refetchInterval: 5000,
  });

  const countries = useCoronaAPI(`/countries?sort=${key}`, {
    initialData: [],
    converter: (data) => data.slice(0, 10),
  });
  const history = useCoronaAPI(`/historical/${country}`, {
    initialData: {},
    converter: (data) => data.timeline,
  });

  return (
  <AppDispatch.Provider value={dispatch}>
    <div className='App'>
      <h1>COVID-19</h1>
      <GlobalStats stats={globalStats} />
      <SelectDataKey />
      <CountriesChart data={countries} dataKey={key} />
      {country ? (
        <div>
          <h2>History for {country}</h2>
          <HistoryChartGroup history={history} lastDays={lastDays} />
        </div>
      ) : (
        <h2>Click on a country to show its history.</h2>
      )}
    </div>
  </AppDispatch.Provider>
);
}

export default App;
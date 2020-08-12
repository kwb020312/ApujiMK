import { registerRootComponent } from "expo";
import App from "./App";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

const initialState = {
  search_data: {},
  nearStore: false,
  Lat: 37.2832481,
  Lon: 127.0185837,
  // value: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_DATA":
      return {
        ...state,
        search_data: action.search_data,
      };
    case "NEARLY_STORE":
      return {
        ...state,
        nearStore: !state.nearStore,
      };
    case "GET_POS":
      return {
        ...state,
        Lat: action.lat,
        Lon: action.lon,
      };
    // case "favorite":
    //   return {
    //     ...state,
    //     value: action.dataName,
    //   };
    default:
      return {
        ...state,
      };
  }
};

const store = createStore(reducer);

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default registerRootComponent(AppWrapper);

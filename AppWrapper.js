import { registerRootComponent } from "expo";
import App from "./App";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

const initialState = {
  search_data: {},
  nearStore: false,
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

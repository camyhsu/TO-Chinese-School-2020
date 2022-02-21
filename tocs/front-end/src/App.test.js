import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";

describe("The TOCS front-end application", () => {
  test("should show the SignIn screen by default", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });
});

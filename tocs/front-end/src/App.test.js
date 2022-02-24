import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";

describe("The TOCS front-end application", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it("should show the SignIn screen by default", () => {
    expect(document.title).toEqual("TOCS - Sign In");
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  it("should show the Home screen after successful sign-in", async () => {
    fireEvent.input(screen.getByPlaceholderText("username"), {
      target: {
        value: "fakeUsername",
      },
    });
    fireEvent.input(screen.getByPlaceholderText("password"), {
      target: {
        value: "fakePassword",
      },
    });
    fireEvent.submit(screen.getByRole("button"));

    await screen.findByText("TOCS");
    expect(document.title).toEqual("TOCS - Home");
  });
});

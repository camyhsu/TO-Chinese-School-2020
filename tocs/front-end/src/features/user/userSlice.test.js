import userReducer, { signOut } from "./userSlice";
import { UserStatus } from "./UserStatus";

describe("user reducers", () => {
  it("should have an empty initial state when the user is not signed in", () => {
    expect(userReducer(undefined, {})).toEqual({
      error: null,
      status: UserStatus.NOT_SIGNED_IN,
      user: null,
    });
    // Note that we are not able to test the other scenario when the user is
    // already signed in because the inspection of the existing user happened
    // when importing the userSlice code at the beginning of the test before
    // any test code can setup the sessionStorage
  });

  it("should clear existing data when sign out", () => {
    const fakeUser = { id: 1, token: "fakeToken" };
    const previousState = {
      error: "someError",
      status: UserStatus.SIGNED_IN,
      user: fakeUser,
    };
    expect(userReducer(previousState, signOut())).toEqual({
      error: null,
      status: UserStatus.NOT_SIGNED_IN,
      user: null,
    });
  });
});

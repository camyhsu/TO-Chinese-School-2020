import { Role, userHasRequiredRole } from "./Role";

describe("userHasRequiredRole function", () => {
  it("should return false if the userRoles are empty", () => {
    expect(userHasRequiredRole(undefined, [])).toBe(false);
    expect(userHasRequiredRole(null, [])).toBe(false);
    expect(userHasRequiredRole([], [])).toBe(false);
  });

  it("should return true if the userRoles contains the SUPER_USER", () => {
    expect(userHasRequiredRole([Role.SUPER_USER], [])).toBe(true);
    expect(userHasRequiredRole([Role.SUPER_USER], null)).toBe(true);
    expect(userHasRequiredRole([Role.SUPER_USER], undefined)).toBe(true);
  });

  it("should return false if the requiredRoles are empty as long as the user is not a SUPER_USER", () => {
    expect(userHasRequiredRole([Role.PVA], undefined)).toBe(false);
    expect(userHasRequiredRole([Role.PVA], null)).toBe(false);
    expect(userHasRequiredRole([Role.PVA], [])).toBe(false);
  });

  it("should return false if the userRoles do not contain any of the requiredRoles", () => {
    expect(userHasRequiredRole([Role.PVA], [Role.ACCOUNTING_OFFICER])).toBe(
      false
    );
  });

  it("should return true if the userRoles contain one of the requiredRoles", () => {
    expect(
      userHasRequiredRole([Role.PVA], [Role.ACCOUNTING_OFFICER, Role.PVA])
    ).toBe(true);

    expect(
      userHasRequiredRole(
        [Role.CCCA_STAFF, Role.PVA],
        [Role.ACCOUNTING_OFFICER, Role.PVA]
      )
    ).toBe(true);
  });
});

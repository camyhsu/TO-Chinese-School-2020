/* global it */
import { uuid } from "../../src/utils/utilities.js";

const modelTests = async (
  model,
  { fieldToTest = "name", object: obj = {}, createOptions, callback } = {}
) => {
  const s = `test-${uuid()}`;
  let object = obj;

  it("000", async () => {
    object[fieldToTest] = s;
    callback && callback(object);
  });

  it("N", async () => {
    expect(object.id).toBeUndefined();
    expect(object[fieldToTest]).toBe(s);
  });

  it("C", async () => {
    object = await model.create(object, createOptions);
    expect(object.id).toBeGreaterThan(0);
    expect(object[fieldToTest]).toBe(s);
  });

  it("R", async () => {
    object = await model.getById(object.id);
    expect(object.id).toBeGreaterThan(0);
    expect(object[fieldToTest]).toBe(s);
  });

  it("U", async () => {
    expect(object[fieldToTest]).toBe(s);
    object[fieldToTest] += "x";
    await object.save();
    object = await model.getById(object.id);
    expect(object.id).toBeGreaterThan(0);
    expect(object[fieldToTest]).not.toBe(s);
    expect(object[fieldToTest]).toBe(`${s}x`);
  });

  it("D", async () => {
    const r = await model.deleteById(object.id);
    expect(r).toBe(1);
    object = await model.getById(object.id);
    expect(object).toBeNull();
  });
};

const testRole = {
  controller: "registration/active_school_classes",
  action: "grade_class_student_count",
  roleName: "CCCA Staff",
};

export { modelTests, testRole };

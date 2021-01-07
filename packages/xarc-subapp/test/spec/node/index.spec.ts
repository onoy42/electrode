import { declareSubApp, getContainer } from "../../../src/node/index";
import { describe, it } from "mocha";
import { expect } from "chai";

describe("declareSubApp", function () {
  it("should add the subapp into container", async () => {
    const container = getContainer();

    const subapp = declareSubApp({
      name: "test",
      getModule: () => import("../../blah")
    });
    expect(container.getNames()).contains("test");
    expect(container.get("test")).to.equal(subapp);
    expect(subapp._module).to.equal(undefined);

    const mod = await subapp._getModule();

    expect(subapp._module).to.equal(mod);
    expect(mod.subapp.Component()).to.equal("hello"); // eslint-disable-line
  });
});

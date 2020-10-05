import { mount } from "enzyme";
import React, { ReactNode } from "react";
import { UnleashClient } from "../client/UnleashClient";
import { FeatureFlag } from "./FeatureFlag";
import { UnleashProvider } from "../UnleashProvider";

describe("FeatureFlag", () => {
  const config = {
    appName: "production",
    instanceId: "foo",
    url: "https://foo.bar/api",
    clientKey: ''
  };
  let unleashClient: UnleashClient;
  const fakeFetch = jest.fn();

  beforeAll(async (cb) => {
    fakeFetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({}),
        ok: true,
      });
    });

    window.fetch = fakeFetch;

    unleashClient = new UnleashClient(config);
    await unleashClient.start();
    cb();
  });

  it("renders an enabled feature", () => {
    unleashClient.isEnabled = jest.fn().mockImplementation((name: string) => true);

    const rendered = mount(<FeatureFlag name="foo">bar</FeatureFlag>, {
      wrappingComponent: UnleashProvider,
    });
    expect(rendered.contains("bar")).toBeTruthy();
  });

  it("renders a disabled feature", () => {
    unleashClient.isEnabled = jest.fn().mockImplementation((name: string) => false);

    const rendered = mount(<FeatureFlag name="foo">bar</FeatureFlag>, {
      wrappingComponent: UnleashProvider,
    });
    expect(rendered.contains("bar")).toBeFalsy();
  });

  it("renders the default fallback value", () => {
    unleashClient.isEnabled = jest.fn().mockImplementation((name: string) => false);

    const rendered = mount(<FeatureFlag name="foo">bar</FeatureFlag>, {
      wrappingComponent: UnleashProvider,
    });
    expect(rendered.contains("bar")).toBeFalsy();
  });

  it("renders the default false value", () => {
    unleashClient.isEnabled = jest.fn().mockImplementation((name: string) => false);

    const rendered = mount(
      <FeatureFlag name="foo" defaultValue={false}>
        bar
      </FeatureFlag>,
      { wrappingComponent: UnleashProvider }
    );
    expect(rendered.contains("bar")).toBeFalsy();
  });

  it("renders the default true value", () => {
    unleashClient.isEnabled = jest.fn().mockImplementation((name: string) => false);

    const rendered = mount(
      <FeatureFlag name="foo" defaultValue={true}>
        bar
      </FeatureFlag>,
      { wrappingComponent: UnleashProvider }
    );
    expect(rendered.contains("bar")).toBeTruthy();
  });

  it("renders an inverted feature", () => {
    unleashClient.isEnabled = jest.fn().mockImplementation((name: string) => false);

    const rendered = mount(
      <FeatureFlag name="foo" invert={true}>
        bar
      </FeatureFlag>,
      { wrappingComponent: UnleashProvider }
    );
    expect(rendered.contains("bar")).toBeTruthy();
  });
});

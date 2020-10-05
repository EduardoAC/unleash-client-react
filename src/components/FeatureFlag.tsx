import React, { Fragment, ReactNode, useContext } from "react";
import { UnleashFlagsContext } from "../provider";

export type FeatureFlagComponentProps = {
  name: string;
  defaultValue?: boolean;
  invert?: boolean;
  children: ReactNode;
};

export const FeatureFlag: React.FunctionComponent<FeatureFlagComponentProps> = ({
  name,
  defaultValue = false,
  invert = false,
  children,
}: FeatureFlagComponentProps) => {
  // get the flagsClient from the context
  const flagsClient = useContext(UnleashFlagsContext);

  // load the flag using the useFlag hook
  let isEnabled = flagsClient ? flagsClient.isEnabled(name) : defaultValue;

  // set the flag value if found and check if inverted
  isEnabled = invert ? !isEnabled : isEnabled;

  // if the child element is a function, we'll return the flag as a param of that function
  // otherwise we'll render the children as jsx or null based on the flag value
  return (
    <Fragment>
      {typeof children === "function"
        ? children(isEnabled)
        : isEnabled
        ? children
        : null}
    </Fragment>
  );
};

export default FeatureFlag;

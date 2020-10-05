import { useContext } from "react";
import { UnleashFlagsContext } from "../provider";

/**
 * A hook to get the value of a flag
 * @param flagName the name of the flag
 */
export const useFlag = (flagName: string) => {
  const flagsClient = useContext(UnleashFlagsContext);
  return flagsClient ? flagsClient.isEnabled(flagName) : false;
};

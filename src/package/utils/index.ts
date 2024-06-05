export { log } from "./log";
export { scrollStyles } from "./scrollStyles";
export { getRandomColor } from "./colors";
export { getContact, getConversationType } from "./conversation";

import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "./phoneValidator";

export const utils = {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
};

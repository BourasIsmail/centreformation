import { Province } from "./Province";

export type Commune = {
  id?: number;
  name?: string;
  province?: Province;
};

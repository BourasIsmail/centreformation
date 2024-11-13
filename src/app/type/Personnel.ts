import { Commune } from "./commune";
import { Province } from "./Province";

export type Personnel = {
  id?: number;
  nomComplet?: string;
  grade?: string;
  diplome?: string;
  province?: Province;
  commune?: Commune;
};

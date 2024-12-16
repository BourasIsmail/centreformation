import { Commune } from "./Commune";
import { Province } from "./Province";

export type Personnel = {
  id?: number;
  nomComplet?: string;
  grade?: string;
  diplome?: string;
  province?: Province;
  commune?: Commune;
};

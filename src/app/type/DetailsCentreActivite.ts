import { Activite } from "./Activite";
import { Centre } from "./Centre";
import { Filiere } from "./Filiere";

export type DetailsCentreActivite = {
  id?: number;
  centre?: Centre;
  activite?: Activite;
  filieres?: Filiere[];
};

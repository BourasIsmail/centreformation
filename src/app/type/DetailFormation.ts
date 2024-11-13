import { Activite } from "./Activite";
import { Beneficiaire } from "./Beneficiaire";
import { Centre } from "./Centre";
import { Filiere } from "./Filiere";

export type DetailFormation = {
  id?: number;
  beneficiaire?: Beneficiaire[];
  local?: Centre;
  activite?: Activite;
  filiere?: Filiere;
};

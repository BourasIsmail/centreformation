
import { Activite } from "./Activite";
import { Beneficiaire } from "./Beneficiaire";
import { Centre } from "./Centre";
import { Filiere } from "./Filiere";


export type Suivie = {
  id?: number;
  beneficiaire?: Beneficiaire;
  filiere?: Filiere;
  activite?: Activite;
  centre?: Centre;
  etatDeFormation?: string;
  dateEffet?: string;
  observation?: string;
};

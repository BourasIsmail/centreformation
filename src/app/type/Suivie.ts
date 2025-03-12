
import { Activite } from "./Activite";
import { Beneficiaire } from "./Beneficiaire";
import { Centre } from "./Centre";
import { Filiere } from "./Filiere";


export type Suivie = {
  id?: number;
  filiere?: Filiere;
  beneficiaireId?: number;
  activite?: Activite;
  centre?: Centre;
  etatDeFormation?: string;
  dateEffet?: string;
  observation?: string;
};

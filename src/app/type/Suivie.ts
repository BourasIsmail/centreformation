import { Beneficiaire } from "./Beneficiaire";
import { Filiere } from "./Filiere";

export type Suivie = {
  id?: number;
  beneficiaire?: Beneficiaire;
  filiere?: Filiere;
  etatDeFormation?: string;
  dateEffet?: string;
  observation?: string;
};

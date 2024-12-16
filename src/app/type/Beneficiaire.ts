import { Commune } from "./Commune";
import { Province } from "./Province";

export type Beneficiaire = {
  id?: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  dateNaissance?: string;
  sexe?: string;
  cin?: string;
  commune?: Commune;
  province?: Province;
};

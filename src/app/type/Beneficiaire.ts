import { Commune } from "./Commune";
import { Province } from "./Province";
import { Suivie } from "./Suivie";

export type Beneficiaire = {
  id?: number;
  nom?: string;
  prenom?: string;
  adresse?: string;
  telephone?: string;
  dateNaissance?: string;
  sexe?: string;
  cin?: string;
  commune?: Commune;
  province?: Province;
  suivie?: Suivie[];
};

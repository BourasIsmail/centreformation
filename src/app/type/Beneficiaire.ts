import { Commune } from "./commune";

export type Beneficiaire = {
  id?: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  dateNaissance?: string;
  sexe?: string;
  cin?: string;
  commune?: Commune;
};

import { Filiere } from "./Filiere";
import { Personnel } from "./Personnel";
import { ProprieteDuCentre } from "./ProprieteDuCentre";
import { TypeActivite } from "./TypeActivite";

export type Activite = {
  id?: number;
  nom?: string;
  typeActivite?: TypeActivite;
  dateOuverture?: string;
  responsableActivite?: Personnel;
  capaciteAccueil?: number;
  superficie?: number;
  gestion?: ProprieteDuCentre;
  partenariat?: string;
  dateSignatureConvention?: string;
  centre?: ProprieteDuCentre;
  filiere?: Filiere;
};

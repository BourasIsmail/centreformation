import { Personnel } from "./Personnel";
import { ProprieteDuCentre } from "./ProprieteDuCentre";
import { TypeActivite } from "./TypeActivite";

export type Activite = {
  id?: number;
  typeActivite?: TypeActivite;
  dateOuverture?: string;
  responsableActivite?: Personnel;
  capaciteAccueil?: number;
  superficie?: number;
  gestion?: ProprieteDuCentre;
  partenariat?: string;
  dateSignatureConvention?: string;
};

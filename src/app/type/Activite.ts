import { Filiere } from "./Filiere";
import { Personnel } from "./Personnel";
import { ProprieteDuCentre } from "./ProprieteDuCentre";
import { TypeActivite } from "./TypeActivite";
import {Centre} from "@/app/type/Centre";

export type Activite = {
  id?: number;
  typeActivite?: TypeActivite;
  dateOuverture?: string;
  responsableActivite?: Personnel;
  gestion?: ProprieteDuCentre;
  centre?: Centre;
  filiere?: Filiere;
  personnels ?: Personnel[];
  partenariat ?: boolean;
};

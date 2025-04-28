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
  nationalite ?: string;
  situationHandicap ?: boolean;
  //if situationHandicap is true, then the following field is (numCarteHandicap) required else numCarteHandicap is not required and NULL
  numCarteHandicap ?: string;
  commune?: Commune;
  province?: Province;
  suivie?: Suivie[];
};

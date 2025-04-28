import { Commune } from "./Commune";
import { Province } from "./Province";

export type Personnel = {
  id?: number;
  nomComplet?: string;
  telephone?: string;
  email?: string;
  cin?: string;
  fonction?: string;
  vacataire?: boolean;
  //if vacataire is true, then the following field is (niveauEtude) required else niveauEtude is not required and NULL
  niveauEtude ?: string;
  province?: Province;
  commune?: Commune;
};

import { TypeActivite } from "./TypeActivite";

export type Filiere = {
  id?: number;
  filiere?: string;
  secteur?: string;
  specialite?: string;
  typeActivite?: TypeActivite;
};

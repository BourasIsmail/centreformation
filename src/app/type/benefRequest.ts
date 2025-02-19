import { Beneficiaire } from "./Beneficiaire";
import { Suivie } from "./Suivie";

export type BenefRequest = {
    id?: number;
    beneficiaire: Beneficiaire;
    suivie: Suivie;
  };
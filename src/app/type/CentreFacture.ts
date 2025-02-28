import { Centre } from "./Centre";

export type CentreFacture = {
    id?: number;
    anneFacture?: string;
    moisFacture?: string;
    eau?: number;
    ConsEau?: number;
    electricite?: number;
    consElect?: number;
    total?: number;
    centre?: Centre;
    dateFacture?: string;
    
}
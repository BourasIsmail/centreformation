"use client";

import { useEffect, useState } from "react";
import { getSuivieByBenef } from "@/app/api/suivie";
import { Suivie } from "@/app/type/Suivie";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import useRouter from "next/router";
import router from "next/router";
import Link from "next/link";
import { CentreFacture } from "@/app/type/CentreFacture";
import { getFactureByCentre } from "@/app/api/facture";



export function FacturePage({ centre }: { centre: number }) {
  const [factureData, setFactureData] = useState<CentreFacture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        setLoading(true);
        const data = await getFactureByCentre(centre);
        setFactureData(data);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchFacture();
  }, [centre]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi des bénéficiaires</CardTitle>
        <Link href={`/facture/${centre}/ajouter`}>
          <Button className="ml-auto">
            <a>Ajouter un Suivi</a>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : factureData.length === 0 ? (
          <p className="text-center text-gray-500">Aucun suivi trouvé.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom du centre</TableHead>
                  <TableHead>date de la facture</TableHead>
                  <TableHead>Consomation de l'eau</TableHead>
                  <TableHead>Cout de l'eau</TableHead>
                  <TableHead>Consomation de l'electricite</TableHead>
                  <TableHead>Cout de l'electricite</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factureData.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell>{facture.id}</TableCell>
                    <TableCell>
                      {facture.centre?.nomFr} 
                    </TableCell>
                    <TableCell>{facture.dateFacture}</TableCell>
                    <TableCell>{facture.ConsEau}</TableCell>
                    <TableCell>{facture.eau}</TableCell>
                    <TableCell>{facture.consElect}</TableCell>
                    <TableCell>{facture.electricite}</TableCell>
                    <TableCell>{facture.total}</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

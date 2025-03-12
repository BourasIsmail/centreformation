"use client";

import { useEffect, useState } from "react";
import { Suivie } from "@/app/type/Suivie";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import useRouter from "next/router";
import router from "next/router";
import Link from "next/link";
import { CentreFacture } from "@/app/type/CentreFacture";
import { getCentreById } from "@/app/api/centre";
import { FacturesByCentre } from "@/app/api/facture";



export function FacturePage({ centreId }: { centreId: number }) {
  const [factureData, setFactureData] = useState<CentreFacture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        setLoading(true);
        const data = await FacturesByCentre(centreId);
        setFactureData(data);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchFacture();
  }, [centreId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures</CardTitle>
        <Link href={`/centres/${centreId}/facture/ajouter`}>
          <Button className="ml-auto">
            <a>Ajouter une facture</a>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : factureData.length === 0 ? (
          <p className="text-center text-gray-500">Aucun facture trouvé.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                    <TableCell>{facture.datefacture}</TableCell>
                    <TableCell>{facture.consEau}</TableCell>
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

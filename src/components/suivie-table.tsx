"use client";

import { useEffect, useState } from "react";
import { SuiviesByBeneficiaire } from "@/app/api/suivie";
import { Suivie } from "@/app/type/Suivie";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import useRouter from "next/router";
import router from "next/router";
import Link from "next/link";


export function SuiviePage( { beneficiaireId }: { beneficiaireId: number }) {
  const [suivieData, setSuivieData] = useState<Suivie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuivie = async () => {
      try {
        setLoading(true);
        const data = await SuiviesByBeneficiaire(beneficiaireId);
        setSuivieData(data);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuivie();
  }, [beneficiaireId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi des bénéficiaires</CardTitle>
        <Link href={`/beneficiaire/${beneficiaireId}/suivie/ajouter`}>
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
        ) : suivieData.length === 0 ? (
          <p className="text-center text-gray-500">Aucun suivi trouvé.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  
                  <TableHead>Filière</TableHead>
                  <TableHead>État de Formation</TableHead>
                  <TableHead>Date Effet</TableHead>
                  <TableHead>Observation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suivieData.map((suivie) => (
                  <TableRow key={suivie.id}>
                    <TableCell>{suivie.id}</TableCell>
                    
                    <TableCell>{suivie.filiere?.nom}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          suivie.etatDeFormation === "en cours"
                            ? "bg-blue-500"
                            : suivie.etatDeFormation === "terminé"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {suivie.etatDeFormation}
                      </span>
                    </TableCell>
                    <TableCell>{suivie.dateEffet ? new Date(suivie.dateEffet).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{suivie.observation || "—"}</TableCell>
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

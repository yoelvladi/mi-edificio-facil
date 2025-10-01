import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storage } from '@/lib/storage';

export default function AdminVisits() {
  const navigate = useNavigate();
  const visitors = storage.getVisitors();

  // Group visitors by month and building number
  const visitorsByMonth = visitors.reduce((acc, visitor) => {
    const date = new Date(visitor.entryDate);
    const monthKey = date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }

    // In a real app, we'd have building number associated with each visitor
    // For now, we'll use a placeholder
    const buildingNumber = 'Depto 401'; // This would come from the visitor data
    
    if (!acc[monthKey][buildingNumber]) {
      acc[monthKey][buildingNumber] = [];
    }
    
    acc[monthKey][buildingNumber].push(visitor);
    
    return acc;
  }, {} as Record<string, Record<string, typeof visitors>>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Visitas</h2>
          <p className="text-muted-foreground">
            Detalle mensual de visitas por departamento
          </p>
        </div>

        {Object.keys(visitorsByMonth).length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                No hay visitas registradas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(visitorsByMonth).map(([month, departments]) => (
              <Card key={month}>
                <CardHeader>
                  <CardTitle>{month}</CardTitle>
                  <CardDescription>
                    Total de departamentos con visitas: {Object.keys(departments).length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(departments).map(([dept, visits]) => (
                      <div key={dept} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">{dept}</h3>
                        <div className="space-y-2">
                          {visits.map((visit) => (
                            <div
                              key={visit.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span>
                                {visit.firstName} {visit.lastName}
                              </span>
                              <span className="text-muted-foreground">
                                {new Date(visit.entryDate).toLocaleDateString('es-CL')} - {visit.entryTime}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium">
                            Total de visitas: {visits.length}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { storage, BillingStatement, Announcement } from '@/lib/storage';

export default function AdminBilling() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');

  const statements = storage.getBillingStatements();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStatement: BillingStatement = {
      id: Date.now().toString(),
      month,
      amount: parseFloat(amount),
      details,
      createdDate: new Date().toISOString(),
    };

    const updatedStatements = [...statements, newStatement];
    storage.setBillingStatements(updatedStatements);

    // Create announcement
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: `Gastos Comunes - ${month}`,
      description: `Se ha publicado la rendición de cuentas de ${month}. Monto: $${parseFloat(amount).toLocaleString('es-CL')}. ${details}`,
      date: new Date().toISOString(),
      type: 'billing',
    };

    const announcements = storage.getAnnouncements();
    storage.setAnnouncements([...announcements, announcement]);

    toast({
      title: 'Rendición creada',
      description: 'La rendición de cuentas ha sido publicada a los residentes',
    });

    setMonth('');
    setAmount('');
    setDetails('');
  };

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
          <h2 className="text-3xl font-bold mb-2">Rendir Cuentas</h2>
          <p className="text-muted-foreground">
            Publica la rendición mensual de gastos comunes
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nueva Rendición</CardTitle>
            <CardDescription>
              Ingresa los detalles de la rendición de cuentas mensual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="month">Mes</Label>
                <Input
                  id="month"
                  placeholder="Ejemplo: Enero 2025"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto Total</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="85000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Detalle</Label>
                <Textarea
                  id="details"
                  placeholder="Descripción detallada de los gastos..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Publicar Rendición
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendiciones Anteriores</CardTitle>
          </CardHeader>
          <CardContent>
            {statements.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay rendiciones registradas
              </p>
            ) : (
              <div className="space-y-4">
                {statements.map((statement) => (
                  <div
                    key={statement.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{statement.month}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(statement.createdDate).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        ${statement.amount.toLocaleString('es-CL')}
                      </p>
                    </div>
                    <p className="text-sm">{statement.details}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

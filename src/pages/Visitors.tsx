import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { storage, Visitor } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function Visitors() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>(storage.getVisitors());
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      entryDate: now.toISOString().split('T')[0],
      entryTime: now.toTimeString().split(' ')[0].substring(0, 5),
    };

    const updatedVisitors = [newVisitor, ...visitors];
    setVisitors(updatedVisitors);
    storage.setVisitors(updatedVisitors);

    toast({
      title: 'Visita registrada',
      description: `${firstName} ${lastName} ha sido registrado`,
    });

    setFirstName('');
    setLastName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Registrar Visitas</h1>
          <p className="text-muted-foreground">
            Registra y consulta las visitas a tu departamento
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Nueva Visita
              </CardTitle>
              <CardDescription>
                Registra los datos de tu visita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterVisitor} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Pérez"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar Visita
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Historial de Visitas
              </CardTitle>
              <CardDescription>
                Visitas registradas anteriormente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {visitors.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay visitas registradas
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {visitors.map((visitor, index) => (
                    <div key={visitor.id}>
                      {index > 0 && <Separator className="my-2" />}
                      <div className="py-2">
                        <p className="font-semibold">
                          {visitor.firstName} {visitor.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(visitor.entryDate + 'T00:00:00').toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })} - {visitor.entryTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

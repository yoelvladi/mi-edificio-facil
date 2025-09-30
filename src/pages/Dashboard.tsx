import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Users, LogOut, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión exitosamente',
    });
    navigate('/login');
  };

  const modules = [
    {
      icon: CreditCard,
      title: 'Pagar Gastos Comunes',
      description: 'Revisa y paga tus facturas mensuales',
      path: '/payments',
      color: 'text-primary',
    },
    {
      icon: Calendar,
      title: 'Reservar Espacios',
      description: 'Reserva sala de eventos, piscina y terraza',
      path: '/reservations',
      color: 'text-secondary',
    },
    {
      icon: Users,
      title: 'Registrar Visitas',
      description: 'Registra y consulta tus visitas',
      path: '/visitors',
      color: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Portal Comunitario</h1>
              <p className="text-sm text-muted-foreground">
                {user?.address} - {user?.buildingNumber}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
          <p className="text-muted-foreground">
            Selecciona una opción para continuar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => (
            <Card
              key={module.path}
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(module.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Acceder →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

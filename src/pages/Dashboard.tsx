import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Users, LogOut, Building2, Bell } from 'lucide-react';
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
    {
      icon: Bell,
      title: 'Anuncios',
      description: 'Ver comunicados de la administración',
      path: '/announcements',
      color: 'text-primary',
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

        <div className="flex justify-center">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl">
            {modules.map((module) => (
              <Button
                key={module.path}
                variant="outline"
                className="h-auto p-0 overflow-hidden group border-0"
                onClick={() => navigate(module.path)}
              >
                <Card className={`w-full border-0 shadow-lg hover:shadow-xl transition-all ${
                  module.color === 'text-primary' ? 'bg-primary hover:bg-primary/90' :
                  module.color === 'text-secondary' ? 'bg-secondary hover:bg-secondary/90' :
                  'bg-accent hover:bg-accent/90'
                }`}>
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                    <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <module.icon className={`w-16 h-16 ${
                        module.color === 'text-primary' ? 'text-primary-foreground' :
                        module.color === 'text-secondary' ? 'text-secondary-foreground' :
                        'text-accent-foreground'
                      }`} />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className={`font-semibold ${
                        module.color === 'text-primary' ? 'text-primary-foreground' :
                        module.color === 'text-secondary' ? 'text-secondary-foreground' :
                        'text-accent-foreground'
                      }`}>{module.title}</h3>
                      <p className={`text-xs ${
                        module.color === 'text-primary' ? 'text-primary-foreground/80' :
                        module.color === 'text-secondary' ? 'text-secondary-foreground/80' :
                        'text-accent-foreground/80'
                      }`}>{module.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

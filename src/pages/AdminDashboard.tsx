import { useNavigate } from 'react-router-dom';
import { FileText, Wrench, Users, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión como administrador',
    });
    navigate('/login');
  };

  const modules = [
    {
      icon: FileText,
      title: 'Rendir Cuentas',
      description: 'Gestionar facturas mensuales de residentes',
      path: '/admin/billing',
      color: 'text-primary',
    },
    {
      icon: Wrench,
      title: 'Mantenimiento',
      description: 'Programar y anunciar proyectos de mantenimiento',
      path: '/admin/maintenance',
      color: 'text-secondary',
    },
    {
      icon: Users,
      title: 'Visitas',
      description: 'Ver detalle mensual de visitas por departamento',
      path: '/admin/visits',
      color: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">
                {adminUser?.address}
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
          <h2 className="text-3xl font-bold mb-2">Bienvenido Administrador</h2>
          <p className="text-muted-foreground">
            Selecciona una opción para gestionar el edificio
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 max-w-6xl">
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
                    <div className="w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <module.icon className={`w-20 h-20 ${
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

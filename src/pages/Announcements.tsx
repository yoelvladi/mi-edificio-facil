import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, FileText, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';

export default function Announcements() {
  const navigate = useNavigate();
  const announcements = storage.getAnnouncements().sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'billing':
        return <FileText className="w-5 h-5" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'billing':
        return 'Rendición de Cuentas';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return 'General';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Anuncios</h2>
          <p className="text-muted-foreground">
            Comunicados de la administración del edificio
          </p>
        </div>

        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                No hay anuncios disponibles
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {getIcon(announcement.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription>
                          {new Date(announcement.date).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{getTypeLabel(announcement.type)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

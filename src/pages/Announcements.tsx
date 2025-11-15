import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, FileText, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { Check } from "lucide-react";
export default function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const list = storage
      .getAnnouncements()
      .slice()
      .sort((a, b) => {
        const ai = a.important ? 1 : 0;
        const bi = b.important ? 1 : 0;
        if (bi - ai !== 0) return bi - ai;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    setAnnouncements(list);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'billing':
        return <FileText className="w-5 h-5" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'billing':
        return 'Rendición de Cuentas';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return 'General';
    }
  };

  const markAsRead = (id) => {
    storage.markAsRead(id);
    setAnnouncements(storage.getAnnouncements());
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
              <Card
                key={announcement.id}
                className={`w-84 h-84 relative ${
                  announcement.important ? 'ring-2 ring-destructive/40' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {getIcon(announcement.type)}
                      </div>

                      <div>
                        <CardTitle className="text-xl">{announcement.title}</CardTitle>

                        <CardDescription>
                          {new Date(announcement.date).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </CardDescription>

                        {!announcement.read && (
                          <span className="text-sm text-red-600 font-bold">No leído</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {announcement.important && (
                        <Badge variant="destructive">IMPORTANTE</Badge>
                      )}
                      <Badge className='bg-blue-600 text-white hover:bg-blue-700'>{getTypeLabel(announcement.type)}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-md mb-4">{announcement.description}</p>
                  {announcement.read ? (
                    <div className="flex items-center text-green-600 font-semibold">
                      <Check className="w-6 h-6"/>
                      <span>Visto</span>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        onClick ={() => markAsRead(announcement.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        title='Marcar como leído'
                      >
                        <Check size={20} strokeWidth={3}/>
                      </button>
                    </div>        
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

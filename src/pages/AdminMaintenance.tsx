import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { storage, MaintenanceProject, Announcement } from '@/lib/storage';

export default function AdminMaintenance() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('');
  const [area, setArea] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const projects = storage.getMaintenanceProjects();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: MaintenanceProject = {
      id: Date.now().toString(),
      projectName,
      area,
      estimatedDate,
      budget: parseFloat(budget),
      description,
      createdDate: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    storage.setMaintenanceProjects(updatedProjects);

    // Create announcement
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: `Mantenimiento: ${projectName}`,
      description: `Se realizará mantenimiento en ${area}. Fecha estimada: ${estimatedDate}. Presupuesto: $${parseFloat(budget).toLocaleString('es-CL')}. ${description}`,
      date: new Date().toISOString(),
      type: 'maintenance',
    };

    const announcements = storage.getAnnouncements();
    storage.setAnnouncements([...announcements, announcement]);

    toast({
      title: 'Mantenimiento programado',
      description: 'El proyecto de mantenimiento ha sido anunciado a los residentes',
    });

    setProjectName('');
    setArea('');
    setEstimatedDate('');
    setBudget('');
    setDescription('');
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
          <h2 className="text-3xl font-bold mb-2">Mantenimiento</h2>
          <p className="text-muted-foreground">
            Programa y anuncia proyectos de mantenimiento
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nuevo Proyecto de Mantenimiento</CardTitle>
            <CardDescription>
              Ingresa los detalles del proyecto de mantenimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Nombre del Proyecto</Label>
                <Input
                  id="projectName"
                  placeholder="Ejemplo: Reparación de ascensor"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área Comunitaria</Label>
                <Input
                  id="area"
                  placeholder="Ejemplo: Piscina, Sala de eventos, etc."
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDate">Fecha Estimada</Label>
                <Input
                  id="estimatedDate"
                  type="date"
                  value={estimatedDate}
                  onChange={(e) => setEstimatedDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="1500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción detallada del proyecto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Anunciar Mantenimiento
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos Anteriores</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay proyectos registrados
              </p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{project.projectName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.area} - {new Date(project.estimatedDate).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        ${project.budget.toLocaleString('es-CL')}
                      </p>
                    </div>
                    <p className="text-sm">{project.description}</p>
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

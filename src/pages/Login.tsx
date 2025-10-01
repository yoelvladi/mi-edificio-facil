import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield } from 'lucide-react';
import AdminLogin from './AdminLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { validateRut, formatRut } from '@/lib/rutValidator';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [rut, setRut] = useState('');
  const [address, setAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRut(rut)) {
      toast({
        title: 'RUT inválido',
        description: 'Por favor ingrese un RUT válido',
        variant: 'destructive',
      });
      return;
    }

    if (!address.trim() || !buildingNumber.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      });
      return;
    }

    login({
      rut: formatRut(rut),
      address: address.trim(),
      buildingNumber: buildingNumber.trim(),
    });

    toast({
      title: 'Bienvenido',
      description: 'Ingreso exitoso al sistema',
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Button
        variant="ghost"
        className="absolute top-4 right-4"
        onClick={() => setAdminDialogOpen(true)}
      >
        <Shield className="w-7 h-7" />
        <span className="text-base font-medium">Admin</span>
      </Button>

      <AdminLogin open={adminDialogOpen} onOpenChange={setAdminDialogOpen} />

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Portal Comunitario</CardTitle>
          <CardDescription>
            Ingresa tus datos para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input
                id="rut"
                placeholder="12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="Av. Providencia 123"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingNumber">Número de Edificio</Label>
              <Input
                id="buildingNumber"
                placeholder="Depto 401"
                value={buildingNumber}
                onChange={(e) => setBuildingNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

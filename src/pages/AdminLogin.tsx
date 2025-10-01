import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { validateRut, formatRut } from '@/lib/rutValidator';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLogin({ open, onOpenChange }: AdminLoginProps) {
  const [rut, setRut] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin } = useAuth();
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

    if (!address.trim() || !password.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      });
      return;
    }

    loginAdmin({
      rut: formatRut(rut),
      address: address.trim(),
      password: password.trim(),
    });

    toast({
      title: 'Bienvenido Administrador',
      description: 'Ingreso exitoso al panel de administración',
    });

    onOpenChange(false);
    navigate('/admin/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center text-2xl">Administrador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-rut">RUT</Label>
            <Input
              id="admin-rut"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-address">Dirección</Label>
            <Input
              id="admin-address"
              placeholder="Av. Providencia 123"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Clave</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Ingresar como Administrador
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

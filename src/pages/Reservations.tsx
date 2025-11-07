import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Waves, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { storage, Reservation } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SPACES = [
  { id: 'sala-eventos', name: 'Sala de Eventos', icon: Users, color: 'text-primary' },
  { id: 'piscina', name: 'Piscina', icon: Waves, color: 'text-secondary' },
  { id: 'terraza', name: 'Terraza', icon: Home, color: 'text-accent' },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

export default function Reservations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>(storage.getReservations());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSpace, setSelectedSpace] = useState<string>('sala-eventos');

  
  const [pendingReservation, setPendingReservation] = useState<Reservation | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

 
  const formatDateLong = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleReserve = (timeSlot: string) => {
    if (!selectedDate) return;
    const dateString = selectedDate.toISOString().split('T')[0];

    const newReservation: Reservation = {
      id: Date.now().toString(),
      space: selectedSpace as any,
      date: dateString,
      startTime: timeSlot,
      endTime: `${parseInt(timeSlot.split(':')[0], 10) + 1}:00`,
    };

    setPendingReservation(newReservation);
    setShowConfirmModal(true);
  };

  const confirmReservation = () => {
    if (!pendingReservation) return;
    const updatedReservations = [...reservations, pendingReservation];
    setReservations(updatedReservations);
    storage.setReservations(updatedReservations);
    setShowConfirmModal(false);

    toast({
      title: 'Reserva confirmada',
      description: `Tu reserva para ${
        SPACES.find((s) => s.id === pendingReservation.space)?.name
      } el ${formatDateLong(pendingReservation.date)} a las ${
        pendingReservation.startTime
      } fue confirmada.`,
    });

    setPendingReservation(null);
  };

  const handleCancelReservation = (id: string) => {
    setCancelId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!cancelId) return;
    const updatedReservations = reservations.filter((r) => r.id !== cancelId);
    setReservations(updatedReservations);
    storage.setReservations(updatedReservations);
    setShowCancelModal(false);

    toast({
      title: ' Reserva cancelada',
      description: 'Tu reserva ha sido cancelada exitosamente.',
    });

    setCancelId(null);
  };

  const isSlotAvailable = (timeSlot: string) => {
    if (!selectedDate) return true;
    const dateString = selectedDate.toISOString().split('T')[0];
    return !reservations.some(
      (r) => r.space === selectedSpace && r.date === dateString && r.startTime === timeSlot
    );
  };

  const myReservations = reservations.filter((r) => {
    const reservationDate = new Date(r.date + 'T00:00:00');
    return reservationDate >= new Date(new Date().setHours(0, 0, 0, 0));
  });

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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reservar Espacios</h1>
          <p className="text-muted-foreground">
            Reserva espacios comunitarios de forma sencilla
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Espacio</CardTitle>
                <CardDescription>Elige el espacio que deseas reservar</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPACES.map((space) => (
                      <SelectItem key={space.id} value={space.id}>
                        <div className="flex items-center gap-2">
                          <space.icon className={`w-4 h-4 ${space.color}`} />
                          {space.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Fecha</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horarios Disponibles</CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString('es-CL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const available = isSlotAvailable(slot);
                    return (
                      <Button
                        key={slot}
                        variant={available ? 'outline' : 'secondary'}
                        disabled={!available}
                        onClick={() => handleReserve(slot)}
                        className="w-full"
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mis Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                {myReservations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No tienes reservas activas
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myReservations.map((reservation, index) => {
                      const space = SPACES.find((s) => s.id === reservation.space);
                      return (
                        <div key={reservation.id}>
                          {index > 0 && <Separator className="my-2" />}
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-semibold flex items-center gap-2">
                                {space && <space.icon className={`w-4 h-4 ${space.color}`} />}
                                {space?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(reservation.date + 'T00:00:00').toLocaleDateString('es-CL')} - {reservation.startTime}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation.id)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar reserva</DialogTitle>
              <DialogDescription>
                ¿Deseas confirmar tu reserva para{' '}
                <strong>{SPACES.find((s) => s.id === pendingReservation?.space)?.name}</strong> el{' '}
                <strong>
                  {pendingReservation?.date ? formatDateLong(pendingReservation.date) : ''}
                </strong>{' '}
                a las <strong>{pendingReservation?.startTime}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => { setShowConfirmModal(false); setPendingReservation(null); }}>
                Cancelar
              </Button>
              <Button onClick={confirmReservation}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>¿Estás seguro de cancelar?</DialogTitle>
              <DialogDescription>
                Esta acción eliminará tu reserva. ¿Deseas continuar?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => { setShowCancelModal(false); setCancelId(null); }}>
                No
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                Sí, cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

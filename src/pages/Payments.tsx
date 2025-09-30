import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { storage, Invoice } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function Payments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());

  const unpaidInvoices = invoices.filter((inv) => !inv.paid);
  const paidInvoices = invoices.filter((inv) => inv.paid);

  const handlePayment = (invoiceId: string) => {
    toast({
      title: 'Redirigiendo a pago',
      description: 'Serás redirigido a la plataforma de pago',
    });

    // Simulate payment after 2 seconds
    setTimeout(() => {
      const updatedInvoices = invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, paid: true, paidDate: new Date().toISOString() }
          : inv
      );
      setInvoices(updatedInvoices);
      storage.setInvoices(updatedInvoices);

      toast({
        title: 'Pago exitoso',
        description: 'Tu pago ha sido procesado correctamente',
      });
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
          <h1 className="text-3xl font-bold mb-2">Gastos Comunes</h1>
          <p className="text-muted-foreground">
            Administra tus pagos mensuales
          </p>
        </div>

        {unpaidInvoices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Facturas Pendientes
            </h2>
            <div className="space-y-4">
              {unpaidInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-l-4 border-l-accent">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="capitalize">{invoice.month}</CardTitle>
                        <CardDescription>
                          Vencimiento: {formatDate(invoice.dueDate)}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pendiente</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(invoice.amount)}
                        </p>
                      </div>
                      <Button onClick={() => handlePayment(invoice.id)}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar Ahora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {paidInvoices.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              Pagos Anteriores
            </h2>
            <Card>
              <CardContent className="p-0">
                {paidInvoices.map((invoice, index) => (
                  <div key={invoice.id}>
                    {index > 0 && <Separator />}
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-semibold capitalize">{invoice.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Pagado el: {invoice.paidDate ? formatDate(invoice.paidDate) : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(invoice.amount)}</p>
                        <Badge variant="outline" className="mt-1 border-secondary text-secondary">
                          Pagado
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

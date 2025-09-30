export interface User {
  rut: string;
  address: string;
  buildingNumber: string;
}

export interface Invoice {
  id: string;
  month: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidDate?: string;
}

export interface Reservation {
  id: string;
  space: 'sala-eventos' | 'piscina' | 'terraza';
  date: string;
  startTime: string;
  endTime: string;
}

export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  entryDate: string;
  entryTime: string;
}

const STORAGE_KEYS = {
  USER: 'app_user',
  INVOICES: 'app_invoices',
  RESERVATIONS: 'app_reservations',
  VISITORS: 'app_visitors',
};

export const storage = {
  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Invoices
  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : generateMockInvoices();
  },
  setInvoices: (invoices: Invoice[]) => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  // Reservations
  getReservations: (): Reservation[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return data ? JSON.parse(data) : [];
  },
  setReservations: (reservations: Reservation[]) => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  },

  // Visitors
  getVisitors: (): Visitor[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VISITORS);
    return data ? JSON.parse(data) : [];
  },
  setVisitors: (visitors: Visitor[]) => {
    localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitors));
  },
};

function generateMockInvoices(): Invoice[] {
  const currentDate = new Date();
  const invoices: Invoice[] = [];
  
  // Generate current month invoice (unpaid)
  invoices.push({
    id: '1',
    month: currentDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
    amount: 85000,
    dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15).toISOString(),
    paid: false,
  });
  
  // Generate previous 3 months (paid)
  for (let i = 1; i <= 3; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    invoices.push({
      id: (i + 1).toString(),
      month: date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
      amount: 82000 + Math.floor(Math.random() * 6000),
      dueDate: new Date(date.getFullYear(), date.getMonth(), 15).toISOString(),
      paid: true,
      paidDate: new Date(date.getFullYear(), date.getMonth(), 12).toISOString(),
    });
  }
  
  return invoices;
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  customerName: string;
  vehicle: string;
  serviceType: string;
  date: string;
  notes: string;
  mechanicName: string;
  partsUsed: string[];
  nextServiceDate: string;
  status: 'Completed' | 'Pending';
}

export const DUMMY_SERVICES: ServiceRecord[] = [
  {
    id: 'SR-001',
    customerId: 'CUST-100',
    customerName: 'John Doe',
    vehicle: 'Toyota Camry 2020',
    serviceType: 'Full Service',
    date: '2026-04-10',
    notes: 'Replaced oil, checked brakes, rotated tires. Everything looks good.',
    mechanicName: 'Mike Johnson',
    partsUsed: ['Engine Oil 5W-30', 'Oil Filter', 'Cabin Air Filter'],
    nextServiceDate: '2026-10-10',
    status: 'Completed',
  },
  {
    id: 'SR-002',
    customerId: 'CUST-100',
    customerName: 'John Doe',
    vehicle: 'Toyota Camry 2020',
    serviceType: 'Brake Inspection',
    date: '2026-04-18',
    notes: 'Customer reported squeaking. Scheduled for pad replacement.',
    mechanicName: 'Sarah Smith',
    partsUsed: [],
    nextServiceDate: '2026-04-22',
    status: 'Pending',
  },
  {
    id: 'SR-003',
    customerId: 'CUST-101',
    customerName: 'Alice Green',
    vehicle: 'Honda Civic 2018',
    serviceType: 'Oil Change',
    date: '2026-03-15',
    notes: 'Standard oil and filter change.',
    mechanicName: 'Mike Johnson',
    partsUsed: ['Engine Oil 0W-20', 'Oil Filter'],
    nextServiceDate: '2026-09-15',
    status: 'Completed',
  },
  {
    id: 'SR-004',
    customerId: 'CUST-102',
    customerName: 'Bob White',
    vehicle: 'Ford F-150 2022',
    serviceType: 'Transmission Check',
    date: '2026-04-19',
    notes: 'Transmission fluid level low, needs top-up and deeper check.',
    mechanicName: 'Dave Lee',
    partsUsed: [],
    nextServiceDate: '',
    status: 'Pending',
  },
  {
    id: 'SR-005',
    customerId: 'CUST-100',
    customerName: 'John Doe',
    vehicle: 'Toyota SUV 2021',
    serviceType: 'Tire Rotation',
    date: '2025-11-05',
    notes: 'Rotated and balanced all 4 tires.',
    mechanicName: 'Mike Johnson',
    partsUsed: [],
    nextServiceDate: '2026-05-05',
    status: 'Completed',
  },
  {
    id: 'SR-006',
    customerId: 'CUST-103',
    customerName: 'Emma Watson',
    vehicle: 'Nissan Altima 2019',
    serviceType: 'Battery Replacement',
    date: '2026-02-28',
    notes: 'Old battery dead. Replaced with new 700 CCA battery.',
    mechanicName: 'David Lee',
    partsUsed: ['12V 700 CCA Battery'],
    nextServiceDate: '2030-02-28',
    status: 'Completed',
  }
];

export const CURRENT_CUSTOMER_ID = 'CUST-100'; // Mock logged-in user

export const updateServiceRecord = (id: string, updates: Partial<ServiceRecord>) => {
  const index = DUMMY_SERVICES.findIndex(s => s.id === id);
  if (index !== -1) {
    DUMMY_SERVICES[index] = { ...DUMMY_SERVICES[index], ...updates };
  }
};


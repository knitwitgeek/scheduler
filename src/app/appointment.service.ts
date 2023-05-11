import { Injectable } from '@angular/core';

export interface Presentation {
  id: number;
  title: string;
  presenter: string;
  duration: number;
}

export interface Appointment {
  presentationId: number;
  startDate: Date;
  endDate: Date;
}

const presentations: Presentation[] = [
  {
    id: 1,
    title: 'Opening Ceremony',
    presenter: 'Jake Lockley',
    duration: 10
  }
];

// Local array for demo
const appointments: Appointment[] = [
  {
      presentationId: 1,
      startDate: new Date("2021-05-25T14:15:00.000Z"),
      endDate: new Date("2021-05-25T14:25:00.000Z")
  }
];

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  getAppointments(): Appointment[] {
    return appointments;
  }

  getPresentations(): Presentation[] {
    return presentations;
  }

  constructor() { }
}

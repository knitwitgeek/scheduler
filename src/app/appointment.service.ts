import { Injectable } from '@angular/core';
import { PresentationFormData } from './pages/scheduler/scheduler.component';

export interface Presentation {
  presentationId: number;
  title: string;
  presenter: string;
  duration: number;
}

export interface Appointment {
  presentationId: number;
  title: string;
  presenter?: string;
  duration: number;
  startDate: Date;
  endDate: Date;
}

const presentations: Presentation[] = [
  {
    presentationId: 1,
    title: 'Opening Ceremony',
    presenter: 'Jake Lockley',
    duration: 10
  }
];

// Local array for demo
const appointments: Appointment[] = [
  {
      presentationId: 2,
      title: 'Test',
      duration: 10,
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

  addPresentation(presentation: PresentationFormData) {
    //let id = presentations[presentations.length-1].presentationId + 1 || 1;
    let id = Math.max(...presentations.map(p => p.presentationId)) + 1 || 1;
    presentations.push({ 
      presentationId: id,
      ...presentation
    });
  }

  constructor() { }
}

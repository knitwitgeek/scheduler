import { Injectable } from '@angular/core';
import { PresentationFormData } from './pages/scheduler/scheduler.component';

export interface Presentation {
  presentationId: number;
  categoryId: number;
  title: string;
  presenter: string;
  duration: number;
}

export interface Appointment {
  presentationId: number;
  categoryId: number;
  title: string;
  presenter?: string;
  duration: number;
  startDate: Date;
  endDate: Date;
}

export interface Category {
  text: string;
  id: number;
  color: string;
}

const presentations: Presentation[] = [
  {
    presentationId: 1,
    categoryId: 2,
    title: 'Opening Ceremony',
    presenter: 'Jake Lockley',
    duration: 10
  }
];

const appointments: Appointment[] = [];

const categories: Category[] = [
  {
    text: 'Break',
    id: 1,
    color: '#3c6ccc'
  },
  {
    text: 'Creative',
    id: 2,
    color: '#369696'
  }, {
    text: 'Academic',
    id: 3,
    color: '#f96939'
  }
]

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

  getCategories(): Category[] {
    return categories;
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

import { Component } from '@angular/core';
import { Appointment, Presentation, AppointmentService } from 'src/app/appointment.service';

export interface PresentationFormData {
  title: string;
  presenter: string;
  duration: number;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [AppointmentService]
})
export class SchedulerComponent {
  appointments: Appointment[];
  presentations: Presentation[];
  newPresentation: PresentationFormData;
  currentDate: Date = new Date(2021, 4, 25);
  draggingGroupName = 'planningGroup';
  addPresentationVisible: boolean = false;
  saveButtonOptions = {
    text: 'Save',
    type: 'success',
    useSubmitBehavior: true
  };
  cancelButtonOptions = {
    text: 'Cancel',
    type: 'normal',
    onClick: () => { this.addPresentationVisible = false; }
  }

  constructor(private apptService: AppointmentService) {
    this.appointments = this.apptService.getAppointments();
    this.presentations = this.apptService.getPresentations();
    // initialize new presentation data
    this.newPresentation = {
      title: '',
      presenter: '',
      duration: 30
    };
    this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
    this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
  }

  onAppointmentRemove(event: any) {
    const index = this.appointments.indexOf(event.itemData);
    if(index >= 0) {
      this.appointments.splice(index, 1);
      this.presentations.push(event.itemData);
    }
  }

  onAppointmentAdd(event: any) {
    const index = this.presentations.indexOf(event.fromData);
    if(index >= 0) {
      this.presentations.splice(index, 1);
      console.log(event.itemData);
      // set end date based on start and duration
      event.itemData.endDate = new Date(event.itemData.startDate.getTime() + 60 * 1000 * event.itemData.duration);
      this.appointments.push(event.itemData);
    }
  }

  onListDragStart(event: any) {
    event.cancel = true;
  }

  onItemDragStart(event: any) {
    event.itemData = event.fromData;
  }

  onItemDragEnd(event: any) {
    if(event.toData) {
      event.cancel = true;
    }
  }

  onAppointmentFormOpening(data: any) {
    const that = this;
    const form = data.form;
    let startDate = data.appointmentData.startDate;
    let duration = data.appointmentData.duration;

    form.option('items', [{
      dataField: 'title',
      editorType: 'dxTextBox'
    }, {
      dataField: 'presenter',
      editorType: 'dxTextBox'
    }, {
      dataField: 'duration',
      editorType: 'dxNumberBox',
      editorOptions: {
        width: '100%',
        type: 'number',
        onValueChanged(args: any) {
          duration = args.value;
          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * duration))
        }
      }
    }, {
      dataField: 'startDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        onValueChanged(args: any) {
          startDate = args.value;
          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * duration));
        }
      }
    }, {
      name: 'endDate',
      dataField: 'endDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        readOnly: true
      }
    }]);
  }

  addPresentation(): void {
    this.addPresentationVisible = true;
  }

  saveNewPresentation(event: Event): void {
    this.apptService.addPresentation(this.newPresentation);
    this.addPresentationVisible = false;
    event.preventDefault();
  }

  removePresentation(presentation: Presentation): void {
    const index = this.presentations.indexOf(presentation);
    this.presentations.splice(index,1);
  }
}

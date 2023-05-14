import { Component } from '@angular/core';
import { Appointment, Presentation, AppointmentService } from 'src/app/appointment.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [AppointmentService]
})
export class SchedulerComponent {
  appointments: Appointment[];
  presentations: Presentation[];
  currentDate: Date = new Date(2021, 4, 25);
  draggingGroupName = 'planningGroup';

  constructor(apptService: AppointmentService) {
    this.appointments = apptService.getAppointments();
    this.presentations = apptService.getPresentations();
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
      // need to adjust end time probabaly?
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
    let presentationInfo = that.getPresentationById(data.appointmentData.presentationId) || {};
    let startDate = data.appointmentData.startDate;

    form.option('items', [{
      label: {
        text: 'Presentation'
      },
      editorType: 'dxSelectBox',
      dataField: 'presentationId',
      editorOptions: {
        items: that.presentations,
        displayExpr: 'title',
        valueExpr: 'id',
        onValueChanged(args: any) {
          presentationInfo = that.getPresentationById(args.value);

          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * presentationInfo.duration));
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
          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * presentationInfo.duration));
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

  getPresentationById(id: number): Presentation {
    return this.presentations.filter(p => p.presentationId === id)[0];
  }
}

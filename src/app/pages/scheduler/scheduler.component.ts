import { Component, OnInit } from '@angular/core';
import { Appointment, Presentation, AppointmentService, Category } from 'src/app/appointment.service';
import { SchedulerExportService } from './scheduler-export.service';

export interface PresentationFormData {
  title: string;
  presenter: string;
  categoryId: number;
  duration: number;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [
    AppointmentService,
    SchedulerExportService
  ]
})
export class SchedulerComponent implements OnInit {
  appointments: Appointment[] = [];
  presentations: Presentation[] = [];
  categories: Category[] = [];
  newPresentation: PresentationFormData = {
    title: '',
    presenter: '',
    categoryId: 1,
    duration: 30
  };
  selectedPresentation: Presentation | undefined;

  currentDate: Date = new Date();
  draggingGroupName = 'planningGroup';
  addPresentationVisible: boolean = false;
  editPresentationVisible: boolean = false;

  saveButtonOptions = {
    text: 'Save',
    type: 'success',
    useSubmitBehavior: true
  };
  cancelButtonOptions = {
    text: 'Cancel',
    type: 'normal',
    onClick: () => { this.addPresentationVisible = false; }
  };

  categoryEditorOptions = {
    dataSource: this.apptService.getCategories(),
    valueExpr: 'id',
    displayExpr: 'text',
    placeholder: 'Choose Category'
  };



  constructor(private apptService: AppointmentService, private exportService: SchedulerExportService) { }
  
  ngOnInit() {
    this.appointments = this.apptService.getAppointments();
    this.presentations = this.apptService.getPresentations();
    this.categories = this.apptService.getCategories();

    // initialize new presentation data
    this.clearNewPresentation();
    
    this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
    this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
  }

  clearNewPresentation() {
    this.newPresentation = {
      title: '',
      presenter: '',
      categoryId: 2,
      duration: 30
    }
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

  onAppointmentUpdated(event: any) {
    let appointment = event.appointmentData;
    appointment.duration = Math.floor((appointment.endDate.getTime() - appointment.startDate.getTime())/(60 * 1000));
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
      label: {
        text: 'Category'
      },
      editorType: 'dxSelectBox',
      dataField: 'categoryId',
      editorOptions: {
        items: that.categories,
        displayExpr: 'text',
        valueExpr: 'id'
      }
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

  editPresentation(presentation: Presentation): void {
    this.selectedPresentation = presentation;
    this.editPresentationVisible = true;
  }

  saveChanges(event: Event): void {
    this.editPresentationVisible = false;
    event.preventDefault();
  }

  saveNewPresentation(event: Event): void {
    this.apptService.addPresentation(this.newPresentation);
    this.addPresentationVisible = false;
    this.clearNewPresentation();
    event.preventDefault();
  }

  removePresentation(presentation: Presentation): void {
    const index = this.presentations.indexOf(presentation);
    this.presentations.splice(index,1);
  }

  prepareAppointments(): any[] {
    return this.appointments.map((entry) => {
      return { 
        Title: entry.title,
        Presenter: entry.presenter,
        Duration: entry.duration,
        Category: this.categories.find((cat) => cat.id == entry.categoryId)?.text,
        StartDate: entry.startDate.toLocaleDateString(),
        StartTime: entry.startDate.toLocaleTimeString(),
        EndDate: entry.endDate.toLocaleDateString(),
        EndTime: entry.endDate.toLocaleTimeString()
      }
    });
  }

  exportExcel(): void {
    // TODO: create prepared data using appointments
    // exclude unneeded items: presentationId, categoryId, dayLong
    // split appointment start and end into date and time?? maybe leave as is
    let exportData = this.prepareAppointments();
    this.exportService.exportExcel(exportData, 'schedule');
  }
}

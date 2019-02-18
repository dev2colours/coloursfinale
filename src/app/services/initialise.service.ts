import { Injectable } from '@angular/core';
import { Enterprise, ParticipantData, companyChampion, Department, Subsidiary, employeeData, asset, client, companyStaff } from "../models/enterprise-model";
import { Project, projectCompDetail, workItem, abridgedBill, Section } from "../models/project-model";
import { Task, MomentTask, ActionItem } from "../models/task-model";
import { classification } from 'app/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class InitialiseService {
  task: Task;
  selectedTask: Task;
  selectedStaff: ParticipantData;
  actionItem: workItem;
  selectedAction: workItem
  selectedProject: Project;
  userChampion: ParticipantData;
  compChampion: ParticipantData;
  selectedCompany: Enterprise;
  newEnterprise: Enterprise;
  projectCompDetail: { id: string; name: string; };
  dpt: Department;
  employeeData: employeeData;
  workItem: workItem;
  abridgedBill: abridgedBill;
  section: Section;

  asset: asset;
  client: client;
  subsidiary: Subsidiary
  contactPerson: ParticipantData;
  companystaff: companyStaff;
  department: Department;
  selectedDepartment: Department;
  classification: classification;

  constructor() {

    this.classification = { name: '', createdOn: '', plannedTime: '', actualTime: '', Varience: '', id: '' };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
    this.compChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
    this.section = { id: "", no:  0, name: "", projectId: "", projectName: "", companyId: "", companyName: "", Bills:null }
    this.task = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: false, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: this.userChampion, createdOn: "", id: "", location: "", sector: "" };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
    this.compChampion = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", bus_email: "", sector: "", participants: null, champion: this.userChampion, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", bus_email: "", sector: "", participants: null, champion: this.userChampion, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.selectedStaff = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
    this.selectedTask = { name: "", champion: null, projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: false, id: "", participants: null, status: "" };
    this.actionItem = { id: "", name: "", unit: "", by: "", byId: "", type: "", quantity: 0, targetQty:0, rate: 0, amount: 0, champion: this.userChampion, classification: this.classification, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "" };
    this.selectedAction = { id: "", name: "", unit: "", by: "", byId: "", type: "", quantity: 0, targetQty: 0, rate: 0, amount: 0, champion: this.userChampion, classification: this.classification, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "" };
    this.projectCompDetail = { id: "", name: "" };
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", cost:"" };
    this.client = { name: "", id: "", contactPerson: null, champion: null, by: "", byId: "", joinedOn:"", createdOn: "", address: "", telephone: "", location: "", sector: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.subsidiary = { name: "", by: "", byId: "", createdOn: "", Holding_companyName: "", companyId: "", bus_email: "", id: "", location: "", sector: "", services: null, participants: null, champion: null, address: "", telephone: "", taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.contactPerson = { name: "", id: "", email: "", phoneNumber: "", photoURL: "" };
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
    this.department = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.employeeData = { name: "", phoneNumber: "", email: "", id: "", address: "", nationalId: "", nationality: "", department: "", departmentId: "", photoURL: "" };
    this.workItem = { id: "", name: "", unit: "", quantity: 0, targetQty:0, rate: 0, amount: 0, by: "", byId: "", type: "", champion: this.userChampion, classification: this.classification, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "" };
    this.abridgedBill = { section: this.section,id: "", name: "", No: 1, projectId: "", projectName: "", companyId: "", companyName: "", totalAmount: 0, createdOn: "", UpdatedOn: "" };
  }

  getSectionInit(){ return this.section }

  getEmployeeDataInit(){ return this.employeeData }
  getSubsidiary() { return this.subsidiary}
  getTask() { return this.task }
  getClient() { return this.client }
  getSelectedTask() { return this.selectedTask }
  getSelectedStaff() { return this.selectedStaff }
  getSelectedProject() { return this.selectedProject }
  getSelectedCompany() { return this.selectedCompany }
  getnewEnterprise() { return this.newEnterprise }
  getSelectedAction() { return this.selectedAction }
  getCompChampion () { return this.compChampion }
  getUserChampion() { return this.userChampion }
  getActionItem() { return this.actionItem }
  getWorkItem() { return this.workItem }
  getAbridgedBill() { return this.abridgedBill }
  getDeptInit() { return this.selectedDepartment}
}

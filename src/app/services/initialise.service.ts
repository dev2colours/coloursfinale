import { Injectable } from '@angular/core';
import { Enterprise, ParticipantData, companyChampion, Department, Subsidiary, employeeData, asset, client, companyStaff, projectRole } from "../models/enterprise-model";
import { Project, projectCompDetail, workItem, abridgedBill, Section } from "../models/project-model";
import { Task, MomentTask, ActionItem } from "../models/task-model";
import { classification, coloursUser } from 'app/models/user-model';
import { PopupComponent } from 'app/calendar/popup/popup.component';

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
  public popData: boolean;
  initColUser: coloursUser;

  companyWithProjectRoles: projectRole;

  constructor() {

    this.popData = false;
    this.companyWithProjectRoles = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", bus_email: "", sector: "", participants: null, champion: this.userChampion, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "", roles: null, updatedStatus: false };
    this.classification = { name: "", createdOn: "", plannedTime: "", actualTime: "", Varience: "", id: "" };
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
    this.compChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
    this.section = { id: "", no: null, name: "", type: 'superSection', projectId: "", projectName: "", companyId: "", companyName: "", Bills:null }
    this.task = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: false, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", champion: this.userChampion, createdOn: "", id: "", location: "", sector: "", completion:"" };
    this.userChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
    this.compChampion = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", bus_email: "", sector: "", participants: null, champion: this.userChampion, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "", updatedStatus: false };
    this.newEnterprise = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", bus_email: "", sector: "", participants: null, champion: this.userChampion, address: "", telephone: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "", updatedStatus: false };
    this.selectedStaff = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
    this.selectedTask = { name: "", champion: null, championName: "", championId: "", projectName: "", department: "", departmentId: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", by: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: null, complete: false, id: "", participants: null, status: "", classification: null, selectedWeekly: false };
    this.actionItem = { uid: "", id: "", name: "", unit: "", by: "", byId: "", workHours: null, type: "", quantity: null, targetQty: null, rate: null, amount: null, champion: this.userChampion, classification: this.classification, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.section, actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
    this.selectedAction = { uid: "", id: "", name: "", unit: "", by: "", byId: "", workHours: null, type: "", quantity: null, targetQty: null, rate: null, amount: null, champion: this.userChampion, classification: this.classification, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.section, actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
    this.projectCompDetail = { id: "", name: "" };
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null };
    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", cost:"" };
    this.client = { name: "", id: "", contactPerson: null, champion: null, by: "", byId: "", joinedOn:"", createdOn: "", address: "", telephone: "", location: "", sector: "", services: null, taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "" };
    this.subsidiary = { name: "", by: "", byId: "", createdOn: "", Holding_companyName: "", companyId: "", bus_email: "", id: "", location: "", sector: "", services: null, participants: null, champion: null, address: "", telephone: "", taxDocument: "", HnSDocument: "", IndustrialSectorDocument: "", updatedStatus: false };
    this.contactPerson = { name: "", id: "", email: "", bus_email: "", phoneNumber: "", photoURL: "", address: "", nationalId: "", nationality: "" };
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy:"" };
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", bus_email: "", id: "", department: "", departmentId: "", photoURL: "", address: "", nationalId: "", nationality: "", hierarchy: "" };
    this.department = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", hod: null }
    this.employeeData = { name: "", phoneNumber: "", email: "", bus_email: "", id: "", address: "", nationalId: "", nationality: "", department: "", departmentId: "", photoURL: "", hierarchy: "" };
    this.workItem = { uid: "", id: "", name: "", unit: "", quantity: null, targetQty: null, rate: null, workHours: null, amount: null, by: "", byId: "", type: "", champion: this.userChampion, classification: this.classification, participants: null, departmentName: "", departmentId: "", billID: "", billName: "", projectId: "", projectName: "", createdOn: "", UpdatedOn: "", actualData: null, workStatus: null, complete: false, start: null, end: null, startWeek: "", startDay: "", startDate: "", endDay: "", endDate: "", endWeek: "", taskName: "", taskId: "", companyId: "", companyName: "", classificationName: "", classificationId: "", selectedWork: false, section: this.section, actualStart: "", actualEnd: "", Hours: "", selectedWeekWork: false, selectedWeekly: false, championName: "", championId: "" };
    this.abridgedBill = { section: this.section, id: "", name: "", No: 1, projectId: "", projectName: "", companyId: "", companyName: "", totalAmount: null, createdOn: "", UpdatedOn: "" };
    this.initColUser = { name: "", gender: "", dob: "", age: 0, username: "", email: "", bus_email: "", phoneNumber: "", telephone: null, address: "", nationalId: "", nationality: "", zipCode: null, country: "", city: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", aboutMe: "", profession: null, qualifications: null, bodyWeight: 0, bodyHeight: 0, bodyMassIndex: 0, industrySector: "", personalAssets: null, personalLiabilities: null, reference: null, focusFactor: 0, userImg: "", LastTimeLogin: "", referee: [null], hierarchy: "", updated: false }; 
  }

  getSectionInit(){ return this.section }
  initColUserData() { return this.initColUser }
  initCompwithRoles() { return this.companyWithProjectRoles }
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
  setPopup(data){ this.popData = data }
  getPopup() { return this.popData = false }

  showModal(){
 
    // this.ts.showModal();
  }
}

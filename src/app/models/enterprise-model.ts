export interface Enterprise {
    name: string, by: string, byId: string, createdOn: string, id: string, address: String, telephone: string, location: string, sector: string, services: [service], participants: [ParticipantData],
    champion: ParticipantData, taxDocument: any, HnSDocument: string, IndustrialSectorDocument: string, bus_email: string, updatedStatus: boolean 
}

export interface Subsidiary extends Enterprise { Holding_companyName: string, companyId: string }
export interface compProfile extends Enterprise { updated: boolean }

export interface service { display: string, value: string }

export interface Department { name: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string, id: string, hod: ParticipantData }

export interface employeeData extends ParticipantData { department: string, departmentId: string, hierarchy: string } /* nationalId: string, nationality: string, email: string, */

export interface companyStaff { name: string, phoneNumber: string, by: string, byId: string, createdOn: string, email: string, bus_email: string, id: string, photoURL: string, departmentId: string, department: string, address: String, nationalId: string, nationality: string, hierarchy: string  }

export interface ParticipantData { name: string, id: string, email: string, bus_email: string, phoneNumber: string, photoURL: string, address: String, nationalId: string, nationality: string,}

export interface companyChampion { companyName, id, contactPerson: ParticipantData }

export interface asset { name: string, assetNumber: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string, cost: string }

export interface assetInProject { name: string, assetNumber: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string, rate: string, unit: string }

export interface projectRole extends Enterprise { roles: [service] }

export interface client { name: string, id: string, contactPerson: any, champion: ParticipantData, by: string, byId: string, joinedOn: string, createdOn: string, address: String, telephone: string, location: string, sector: string, services: [service], taxDocument: any, HnSDocument: string, IndustrialSectorDocument: string}

export interface scheduleRate { name: string, id: string, by: string, byId: string, companyName: string, companyId: string, projectName: string, projectId: string, createdOn: string, rate: number, unit: string }

export interface hierarchy { name: "" }
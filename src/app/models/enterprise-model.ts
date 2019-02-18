export interface Enterprise {
    name: string, by: string, byId: string, createdOn: string, id: string, address: string, telephone: string, location: string, sector: string, services: [service], participants: [ParticipantData],
    champion: ParticipantData, taxDocument: any, HnSDocument: string, IndustrialSectorDocument: string, bus_email: string
}

export interface Subsidiary extends Enterprise { Holding_companyName: string, companyId: string }

export interface service { display: string, value: string }

export interface Department { name: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string, id: string, hod: ParticipantData }

export interface employeeData extends ParticipantData { nationalId: string, email: string, nationality: string, address: string, department: string, departmentId: string }

export interface companyStaff { name: string; phoneNumber: string; by: string; byId: string; createdOn: string; email: string; id: string; };

export interface ParticipantData { name: string, id: string, email: string, phoneNumber: string, photoURL: string }

export interface companyChampion { companyName, id, contactPerson: ParticipantData }

export interface asset { name: string, assetNumber: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string, cost: string };

export interface assetInProject { name: string, assetNumber: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string; rate: string; unit: string };

export interface projectRole extends Enterprise { Roles: [string] }

export interface client { name: string; id: string; contactPerson: any, champion: ParticipantData, by: string, byId: string, joinedOn: string, createdOn: string, address: string, telephone: string, location: string, sector: string, services: [service], taxDocument: any, HnSDocument: string, IndustrialSectorDocument: string}

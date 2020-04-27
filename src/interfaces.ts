import * as firebase from "firebase/app";
import "firebase/firestore";

type firestoreResponse = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export interface User {
  id: string;
  name: string;
  teamIds: Array<string>;
}

export function makeUser(doc: firestoreResponse): User {
  const data = doc.data();
  if (data) {
    return {
      id: doc.id,
      name: data.name,
      teamIds: data.teamIds,
    };
  }
  throw new Error("Invalid");
}

export interface Host {
  id: string;
  name: string;
  location: string;
  primaryContact: string;
}

export function makeHost(x: any): Host {
  return {
    id: x.id,
    name: x.name,
    location: x.location,
    primaryContact: x.primaryContact,
  };
}

export interface Team {
  id: string;
  name: string;
  schoolName: string;
}

export function makeTeam(x: any): Team {
  return {
    id: x.id,
    name: x.name,
    schoolName: x.schoolName,
  };
}

export interface AlternateRequest {
  id: string;
  team: Team;
  timestamp: firebase.firestore.Timestamp;
}

export function makeAlternateRequest(x: any): AlternateRequest {
  return {
    id: x.id,
    team: x.team,
    timestamp: x.timestamp,
  };
}

export interface Regatta {
  id: string;
  name: string;
  capacity: number;
  host: Host;
  boat: string;
  date: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
  attendees: Array<Team>;
  alternates: Array<Team>;
}

export function makeRegatta(id: string, x: any): Regatta {
  return {
    id: id,
    name: x.name,
    capacity: x.capacity,
    boat: x.boat,
    host: x.host,
    date: x.date,
    attendees: x.attendees,
    alternates: x.alternates,
  };
}

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

export function makeHost(doc: firestoreResponse): Host {
  const data = doc.data();
  if (data) {
    return {
      id: doc.id,
      name: data.name,
      location: data.location,
      primaryContact: data.primaryContact,
    };
  }
  throw new Error("Invalid");
}

export interface Team {
  id: string;
  name: string;
  schoolName: string;
}

export function makeTeam(doc: firestoreResponse): Team {
  const data = doc.data();
  if (data) {
    return {
      id: doc.id,
      name: data.name,
      schoolName: data.schoolName,
    };
  }
  throw new Error("Invalid");
}

export interface AlternateRequest {
  id: string;
  team: Team;
  timestamp: firebase.firestore.Timestamp;
}

export function makeAlternateRequest(doc: firestoreResponse): AlternateRequest {
  const data = doc.data();
  if (data) {
    return {
      id: doc.id,
      team: data.team,
      timestamp: data.timestamp,
    };
  }
  throw new Error("Invalid");
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

export function makeRegatta(doc: firestoreResponse): Regatta {
  const data = doc.data();
  if (data) {
    return {
      id: doc.id,
      name: data.name,
      capacity: data.capacity,
      boat: data.boat,
      host: data.host,
      date: data.date,
      attendees: data.attendees,
      alternates: data.alternates,
    };
  }
  throw new Error("Invalid");
}

export type ButtonState = "confirmed" | "alternate" | "disabled" | "register" | "join_alternates";

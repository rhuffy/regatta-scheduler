import * as firebase from "firebase/app";
import "firebase/firestore";

export interface Host {
  name: string;
  location: string;
  primaryContact: string;
}

export interface Team {
  name: string;
  schoolId: string;
}

export interface AlternateRequest {
  team: Team;
  timestamp: firebase.firestore.Timestamp;
}

export interface Regatta {
  name: string;
  capacity: number;
  host: Host;
  date: string; // YYYY-MM-DD
  attendees: Array<Team>;
  alternates: Array<Team>;
}

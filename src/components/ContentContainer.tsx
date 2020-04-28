import React from "react";
import * as firebase from "firebase/app";
import * as datefns from "date-fns";
import "firebase/firestore";
import "firebase/auth";

import { IonList, IonItem, IonLabel, IonContent, IonButton } from "@ionic/react";
import "./ContentContainer.css";
import { Regatta, User, makeUser, makeRegatta } from "../interfaces";

type ButtonState = "confirmed" | "alternate" | "disabled" | "register" | "join_alternates";

interface Props {
  name: string;
}

interface State {
  regattas: Array<Regatta>;
  buttonStateForRegatta: Map<string, ButtonState>;
  currentUser: User | null;
}

class ContentContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentUser: null,
      regattas: [],
      buttonStateForRegatta: new Map(),
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser !== null) {
        const currentUser = makeUser(await firebase.firestore().collection("users").doc(authUser.uid).get());
        this.setState({ currentUser: currentUser });
      } else {
        this.setState({ currentUser: null });
      }
      const newButtonStateMap = new Map();
      this.state.regattas.map((regatta) => newButtonStateMap.set(regatta.id, this.getButtonState(regatta)));
      this.setState({ buttonStateForRegatta: newButtonStateMap });
    });
    firebase
      .firestore()
      .collection("regattas")
      .orderBy("date")
      .onSnapshot((querySnapshot) => {
        const newButtonStateMap = new Map(this.state.buttonStateForRegatta);
        const regattas: Array<Regatta> = querySnapshot.docs.map((val) => {
          const regatta = makeRegatta(val);
          newButtonStateMap.set(regatta.id, this.getButtonState(regatta));
          return regatta;
        });
        this.setState({ regattas: regattas, buttonStateForRegatta: newButtonStateMap });
      });
  }
  /**
   * Determines the state of the registration button.
   *
   * non-clickable:
   * Confirmed if current user's team in regatta.attendees
   * Alternate if current user's team in regatta.alternates
   * disabled Register if not logged in
   *
   * clickable:
   * Register if regatta.attendees.length < regatta.capacity
   * Join Alternates if regatta.attendees.length >= regatta.capacity
   */

  getButtonState(regatta: Regatta): ButtonState {
    // checks if logged int
    const user = this.state.currentUser;
    if (user !== null) {
      if (regatta.attendees.map((x) => x.name).includes(user.teamIds[0])) {
        return "confirmed";
      }
      // @ts-ignore
      if (regatta.alternates.map((x) => x.name).includes(user.teamIds[0])) {
        return "alternate";
      }

      if (regatta.attendees.length < regatta.capacity) {
        return "register";
      } else {
        return "join_alternates";
      }
    }
    // disabled register button for not logged in users
    return "disabled";
  }

  getButton(regattaId: string): JSX.Element {
    const buttonState = this.state.buttonStateForRegatta.get(regattaId);
    switch (buttonState) {
      case "register":
        return (
          <IonButton disabled={false} color="primary" slot="end">
            Register
          </IonButton>
        );
      case "confirmed":
        return (
          <IonButton disabled={true} color="success" slot="end">
            Confirmed
          </IonButton>
        );
      case "disabled":
        return (
          <IonButton disabled={true} color="medium" slot="end">
            Not Logged In
          </IonButton>
        );
      case "alternate":
        return (
          <IonButton disabled={true} color="warning" slot="end">
            Alternate
          </IonButton>
        );
      case "join_alternates":
        return (
          <IonButton disabled={false} color="tertiary" slot="end">
            Join Alternates
          </IonButton>
        );
    }
    return <div></div>;
  }

  render() {
    let content = <IonContent></IonContent>;
    const currentUser = this.state.currentUser;

    switch (this.props.name) {
      case "Regattas":
        content = (
          <IonContent>
            <IonList>
              {this.state.regattas.map((regatta) => {
                return (
                  <IonItem key={regatta.id}>
                    <IonLabel slot="start">{regatta.name}</IonLabel>
                    <IonLabel>
                      <h2>{datefns.format(datefns.parseISO(regatta.date.start), "PP")}</h2>
                      <h3>{regatta.host.name}</h3>
                    </IonLabel>
                    <IonLabel>{`${regatta.attendees.length}/${regatta.capacity}`}</IonLabel>
                    {this.getButton(regatta.id)}
                  </IonItem>
                );
              })}
            </IonList>
          </IonContent>
        );
        break;
      case "Schedule":
        if (currentUser) {
          content = (
            <IonContent>
              <IonList>
                {this.state.regattas
                  .filter((regatta) => regatta.attendees.map((team) => team.name).includes(currentUser.teamIds[0]))
                  .map((regatta) => {
                    return (
                      <IonItem key={regatta.id}>
                        <IonLabel slot="start">{regatta.name}</IonLabel>
                        <IonLabel>
                          <h2>{datefns.format(datefns.parseISO(regatta.date.start), "PP")}</h2>
                          <h3>{regatta.host.name}</h3>
                        </IonLabel>
                        <IonLabel>{`${regatta.attendees.length}/${regatta.capacity}`}</IonLabel>
                      </IonItem>
                    );
                  })}
              </IonList>
            </IonContent>
          );
        }
        break;
      case "Hosting":
        break;
      default:
        break;
    }

    return content;
  }
}

export default ContentContainer;

import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { IonList, IonContent, IonHeader } from "@ionic/react";
import "./ContentContainer.css";
import { Regatta, User, makeUser, makeRegatta, ButtonState } from "../interfaces";
import { RegattaListItem } from "./RegattaListItem";

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

  render() {
    let content = <IonContent></IonContent>;
    const currentUser = this.state.currentUser;

    switch (this.props.name) {
      case "Regattas":
        content = (
          <IonContent>
            <IonList>
              {this.state.regattas.map((regatta, i) => {
                return (
                  <RegattaListItem
                    key={i}
                    regatta={regatta}
                    user={currentUser}
                    buttonState={this.state.buttonStateForRegatta.get(regatta.id)}
                  />
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
                  .map((regatta, i) => {
                    return (
                      <RegattaListItem
                        key={i}
                        regatta={regatta}
                        user={currentUser}
                        buttonState={this.state.buttonStateForRegatta.get(regatta.id)}
                      />
                    );
                  })}
              </IonList>
            </IonContent>
          );
        } else {
          content = (
            <IonContent>
              <IonHeader>Please log in to view your schedule</IonHeader>
            </IonContent>
          );
        }
        break;
      case "Hosting":
        if (currentUser) {
          content = (
            <IonContent>
              <IonList>
                {this.state.regattas
                  .filter((regatta) => regatta.host.name === currentUser.teamIds[0])
                  .map((regatta, i) => {
                    return (
                      <RegattaListItem
                        key={i}
                        regatta={regatta}
                        user={currentUser}
                        buttonState={this.state.buttonStateForRegatta.get(regatta.id)}
                      />
                    );
                  })}
              </IonList>
            </IonContent>
          );
        } else {
          content = (
            <IonContent>
              <IonHeader>Please log in to view your schedule</IonHeader>
            </IonContent>
          );
        }
        break;
      default:
        break;
    }

    return content;
  }
}

export default ContentContainer;

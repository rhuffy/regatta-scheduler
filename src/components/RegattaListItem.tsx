import React, { useState } from "react";
import { IonModal, IonButton, IonContent, IonList, IonItem, IonLabel, IonListHeader } from "@ionic/react";
import { Regatta, ButtonState, User } from "../interfaces";
import * as datefns from "date-fns";

import * as firebase from "firebase/app";
import "firebase/firestore";

export const RegattaListItem: React.FC<{
  regatta: Regatta;
  user: User | null;
  buttonState?: ButtonState;
}> = (props) => {
  const [showModal, setShowModal] = useState(false);
  // const modal = React.createRef<HTMLIonModalElement>();

  const show = () => setShowModal(true);
  const hide = () => setShowModal(false);

  const handleRegister = async () => {
    if (props.user) {
      await firebase
        .firestore()
        .collection("regattas")
        .doc(props.regatta.id)
        .update({
          attendees: firebase.firestore.FieldValue.arrayUnion({ name: props.user.teamIds[0] }),
        });
    }
  };

  const handleDrop = async () => {
    if (props.user) {
      await firebase
        .firestore()
        .collection("regattas")
        .doc(props.regatta.id)
        .update({
          attendees: firebase.firestore.FieldValue.arrayRemove({ name: props.user.teamIds[0] }),
        });
    }
  };

  const handleJoinAlternates = async () => {
    if (props.user) {
      await firebase
        .firestore()
        .collection("regattas")
        .doc(props.regatta.id)
        .update({
          alternates: firebase.firestore.FieldValue.arrayUnion({ name: props.user.teamIds[0] }),
        });
    }
  };

  const handleLeaveAlternates = async () => {
    if (props.user) {
      await firebase
        .firestore()
        .collection("regattas")
        .doc(props.regatta.id)
        .update({
          alternates: firebase.firestore.FieldValue.arrayRemove({ name: props.user.teamIds[0] }),
        });
    }
  };

  function getButton(): JSX.Element {
    const buttonState = props.buttonState; // this.state.buttonStateForRegatta.get(regattaId);
    switch (buttonState) {
      case "register":
        return (
          <IonButton onClick={handleRegister} disabled={false} color="primary" slot="end">
            Register
          </IonButton>
        );
      case "confirmed":
        return (
          <IonButton onClick={handleDrop} disabled={false} color="success" slot="end">
            Confirmed, Drop?
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
          <IonButton onClick={handleLeaveAlternates} disabled={false} color="warning" slot="end">
            Alternate
          </IonButton>
        );
      case "join_alternates":
        return (
          <IonButton onClick={handleJoinAlternates} disabled={false} color="tertiary" slot="end">
            Join Alternates
          </IonButton>
        );
    }
    return <div></div>;
  }

  return (
    <div key={props.regatta.id}>
      <IonItem onClick={show}>
        <IonModal isOpen={showModal}>
          <IonContent>
            <IonList>
              <IonListHeader>
                <h2>{props.regatta.name}</h2>
              </IonListHeader>
              <IonListHeader>
                <h3>Confirmed:</h3>
              </IonListHeader>
              {props.regatta.attendees.map((attendee, i) => {
                return (
                  <IonItem key={i}>
                    <IonLabel>{`${i + 1}. ${attendee.name}`}</IonLabel>
                  </IonItem>
                );
              })}
              <IonListHeader>
                <h3>Alternates:</h3>
              </IonListHeader>
              {props.regatta.alternates.map((alternate, i) => {
                return (
                  <IonItem key={i}>
                    <IonLabel>{`${i + 1}. ${alternate.name}`}</IonLabel>
                  </IonItem>
                );
              })}
            </IonList>
          </IonContent>
          <IonButton onClick={hide}>Close</IonButton>
        </IonModal>
        <IonLabel slot="start">{props.regatta.name}</IonLabel>
        <IonLabel>
          <h2>{datefns.format(datefns.parseISO(props.regatta.date.start), "PP")}</h2>
          <h3>{props.regatta.host.name}</h3>
        </IonLabel>
        <IonLabel>{`${props.regatta.attendees.length}/${props.regatta.capacity}`}</IonLabel>
        {getButton()}
      </IonItem>
    </div>
  );
};

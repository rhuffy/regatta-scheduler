import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";

import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonRadio,
  IonCheckbox,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonContent,
} from "@ionic/react";
import "./ContentContainer.css";
import { Regatta } from "../interfaces";

interface Props {
  name: string;
}

interface State {
  regattas: Array<Regatta>;
}

class ContentContainer extends React.Component<Props, State> {
  async componentDidMount() {
    firebase
      .firestore()
      .collection("regattas")
      .orderBy("date")
      .onSnapshot((querySnapshot) => {
        const regattas: Array<Regatta> = querySnapshot.docs.map((val) => {
          const data = val.data();
          return {
            name: data.name,
            capacity: data.capacity,
            host: data.host,
            date: data.date,
            attendees: data.attendees,
            alternates: data.alternates,
          };
        });

        this.setState({ regattas: regattas });
      });
  }
  render() {
    return (
      // <div className="container">
      //   <strong>{this.props.name}</strong>
      //   <p>
      //     Explore{" "}
      //     <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">
      //       UI Components
      //     </a>
      //   </p>
      // </div>
      <IonContent>
        <IonList>
          {this.state.regattas.map((regatta) => {
            return (
              <IonItem>
                <IonLabel>{regatta.name}</IonLabel>
              </IonItem>
            );
          })}
        </IonList>

        {/*-- List of Text Items --*/}
        <IonList>
          <IonItem>
            <IonLabel>Pokémon Yellow</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Mega Man X</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>The Legend of Zelda</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Pac-Man</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Super Mario World</IonLabel>
          </IonItem>
        </IonList>

        {/*-- List of Input Items --*/}
        <IonList>
          <IonItem>
            <IonLabel>Input</IonLabel>
            <IonInput></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Toggle</IonLabel>
            <IonToggle slot="end"></IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel>Radio</IonLabel>
            <IonRadio slot="end"></IonRadio>
          </IonItem>
          <IonItem>
            <IonLabel>Checkbox</IonLabel>
            <IonCheckbox slot="start" />
          </IonItem>
        </IonList>

        {/*-- List of Sliding Items --*/}
        <IonList>
          <IonItemSliding>
            <IonItem>
              <IonLabel>Item</IonLabel>
            </IonItem>
            <IonItemOptions side="end">
              <IonItemOption onClick={() => {}}>Unread</IonItemOption>
            </IonItemOptions>
          </IonItemSliding>

          <IonItemSliding>
            <IonItem>
              <IonLabel>Item</IonLabel>
            </IonItem>
            <IonItemOptions side="end">
              <IonItemOption onClick={() => {}}>Unread</IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        </IonList>
      </IonContent>
    );
  }
}

export default ContentContainer;

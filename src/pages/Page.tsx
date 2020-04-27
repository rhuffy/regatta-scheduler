import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonModal,
  IonList,
  IonTextarea,
  IonItem,
  IonLabel,
} from "@ionic/react";
import React, { useState } from "react";
import { useParams } from "react-router";
import ContentContainer from "../components/ContentContainer";
import "./Page.css";
interface Props {
  loggedIn: boolean;
}

const Page: React.FC<Props> = (props) => {
  const { name } = useParams<{ name: string }>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [text, setText] = useState<string>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonModal
            isOpen={showLoginModal}
            onDidDismiss={() => {
              setShowLoginModal(false);
            }}
          >
            <IonContent>
              <IonList>
                <IonItem>
                  <IonTextarea
                    placeholder="Email"
                    value={text}
                    onIonChange={(e) => setText(e.detail.value!)}
                  ></IonTextarea>
                </IonItem>
                <IonItem>
                  <IonTextarea
                    placeholder="Password"
                    value={text}
                    onIonChange={(e) => setText(e.detail.value!)}
                  ></IonTextarea>
                </IonItem>
              </IonList>
            </IonContent>
            <IonButton onClick={() => setShowLoginModal(false)}>Log In</IonButton>
          </IonModal>
          {props.loggedIn ? (
            <IonButton disabled={true} slot="end">
              Logged In
            </IonButton>
          ) : (
            <IonButton onClick={() => setShowLoginModal(true)} slot="end">
              Log In
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ContentContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;

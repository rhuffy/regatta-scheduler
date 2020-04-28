import * as firebase from "firebase/app";
import "firebase/auth";

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
  IonItem,
  IonInput,
} from "@ionic/react";
import React, { useState } from "react";
import { useParams } from "react-router";
import ContentContainer from "../components/ContentContainer";
import "./Page.css";
interface Props {
  loggedIn: boolean;
}

async function handleLogin(email: string | undefined, password: string | undefined): Promise<boolean> {
  if (email === undefined || password === undefined) {
    return false;
  }
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const creds = await firebase.auth().signInWithEmailAndPassword(email, password);

  if (creds.user !== null) {
    return true;
  }
  return false;
}

async function handleLogout() {
  await firebase.auth().signOut();
}

const Page: React.FC<Props> = (props) => {
  const { name } = useParams<{ name: string }>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailText, setEmailText] = useState<string>();
  const [passwordText, setPasswordText] = useState<string>();

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
                  <IonInput
                    placeholder="Email"
                    type="email"
                    value={emailText}
                    onIonChange={(e) => setEmailText(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    placeholder="Password"
                    type="password"
                    value={passwordText}
                    onIonChange={(e) => setPasswordText(e.detail.value!)}
                    onKeyUp={async (e) => {
                      if (e.key === "Enter") {
                        const loginResult = await handleLogin(emailText, passwordText);
                        if (loginResult === true) {
                          setShowLoginModal(false);
                        }
                      }
                    }}
                  ></IonInput>
                </IonItem>
              </IonList>
            </IonContent>
            <IonButton
              onClick={async () => {
                const loginResult = await handleLogin(emailText, passwordText);
                if (loginResult === true) {
                  setShowLoginModal(false);
                }
              }}
            >
              Log In
            </IonButton>
          </IonModal>
          {props.loggedIn ? (
            <IonButton onClick={() => handleLogout()} slot="end">
              Log Out
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

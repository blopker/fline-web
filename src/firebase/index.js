import { useContext } from "react";
import { FirebaseContext, FirebaseProvider } from "./context";
import Firebase from "./firebase";

function useFirebase() {
  const contextValue = useContext(FirebaseContext);
  if (!contextValue) {
    throw new Error(
      "useFirebase must be used within a <FirebaseContext.Provider>"
    );
  }
  return contextValue;
}

export default Firebase;

export { useFirebase, Firebase, FirebaseProvider };

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, clearUser } from "../features/auth/authSlice";
import { auth } from "../services/firebase";
import PropTypes from "prop-types";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const user = {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        displayName: firebaseUser?.displayName,
        photoURL: firebaseUser?.photoURL,
      };
      if (firebaseUser) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
      return () => unsubscribe();
    });
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

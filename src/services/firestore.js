import { db } from "../services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
export const useFireStore = () => {
  const toast = useToast();
  const addDocument = async (collectionName, data) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  };

  const addToWatchlist = async (userId, dataId, data) => {
    try {
      if (await checkIfInWatchList(userId, dataId)) {
        toast({
          title: "Error!",
          description: "This item is already in your watchlist.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return false;
      }
      await setDoc(doc(db, "users", userId, "watchlist", dataId), data);
      toast({
        title: "Success!",
        description: "Added to watchlist",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log(error, "Error adding document");
      toast({
        title: "Error!",
        description: "An error occurred",
        status: "error",
        isClosable: true,
      });
    }
  };

  const removeFromWatchList = async (userId, dataId) => {
    try {
      await deleteDoc(doc(db, "users", userId, "watchlist", dataId));
      toast({
        title: "Success!",
        description: "Remove from Watchlist.",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "An error occurred",
        status: "error",
        isClosable: true,
      });
      console.log(error, "Error while deleting doc");
    }
  };

  const checkIfInWatchList = async (userId, dataId) => {
    const docRef = doc(
      db,
      "users",
      userId?.toString(),
      "watchlist",
      dataId?.toString()
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return true;
    }

    return false;
  };

  const getWatchList = useCallback(async (userId) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "watchlist")
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return data;
  }, []);

  return {
    addDocument,
    addToWatchlist,
    checkIfInWatchList,
    removeFromWatchList,
    getWatchList,
  };
};

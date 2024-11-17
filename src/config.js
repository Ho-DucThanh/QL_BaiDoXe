import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFnFAYJYhU_4EEXLg2__ckZrUVIbCXpiA",
  authDomain: "final-project-parking-car.firebaseapp.com",
  databaseURL: "https://final-project-parking-car-default-rtdb.firebaseio.com",
  projectId: "final-project-parking-car",
  storageBucket: "final-project-parking-car.firebasestorage.app",
  messagingSenderId: "224166923087",
  appId: "1:224166923087:web:679b153cbf3c7b3d2e533a",
  measurementId: "G-65HXC8RYDZ",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;

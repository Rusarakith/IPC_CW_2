import express from "express";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZJ7PqxT5zwGkWLep1PMcKoUp1lijGN3Q",
  authDomain: "ipccw2rusara.firebaseapp.com",
  projectId: "ipccw2rusara",
  storageBucket: "ipccw2rusara.appspot.com",
  messagingSenderId: "94542156493",
  appId: "1:94542156493:web:2ba577647cc8f757eb4f84"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

async function getCollection(db, colName) {
  const dataCol = collection(db, colName);
  const dataSnapshot = await getDocs(dataCol);
  const DataList = dataSnapshot.docs.map((doc) => doc.data());
  return DataList;
}

async function addToCollection(db, colName, json) {
  const UUID = new Date().getTime();
  delete json.collection;
  json.UUID = UUID;
  json.created = new Date();
  await setDoc(doc(db, colName, UUID.toString()), json);
}

// async function deleteFromCollection(db, colName, id) {
//     await deleteDoc(doc(db, colName, id));
// }

const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded());
api.use(bodyParser.urlencoded({ extended: true }));

api.get("/all", (req, res) => {
  getCollection(database, "Readings")
    .then((value) => {
      let students = [];
      value.forEach(function (stundet) {
        students[students.length] = stundet;
      })
      res.send(students);
    })
    .catch((err) => {
      res.send("Error reading from DB");
      console.log(err);
    });
});

api.post("/insert", (req, res) => {
  addToCollection(database, "Readings", req.body)
    .then((value) => {
      res.send("Done");
    })
    .catch((err) => {
      res.send("Error writing to DB");
      console.log(err);
    });
});


// api.post("/student/delete", (req, res) => {

//     deleteFromCollection(database, req.body.collection, req.body.uuid);
//     res.redirect("/");
// });



const port = process.env.PORT || 8000;
api.listen(port, () => console.log(`Express server listening on port ${port}`));

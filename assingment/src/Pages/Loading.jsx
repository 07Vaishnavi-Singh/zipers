import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../store';
import { setAdminStatus } from '../admin';
import Logo from "../Components/Metamask";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "../Style/Loading.css"
import firebaseConfig from '../Components/Firebase.js';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const userCollectionRef = collection(db, "users");
const now = new Date();
const expiryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

function Loading() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userCookie = getCookie("user");
    const lastLoginAsAdminCookie = getCookie("lastLoginAsAdmin");



    useEffect(() => {
        if (!userCookie) {
            setTimeout(() => {
                navigate("/login");
            }, 4000);

        } else {
            const user = JSON.parse(userCookie);
            const displayname = JSON.parse(userCookie).displayName;
            const usersQuery = query(userCollectionRef, where("email", "==", JSON.parse(userCookie).email));


            setTimeout(() => {
                dispatch(setAccessToken(user));
                if (lastLoginAsAdminCookie === "true") {
                    navigate(`/admin/${displayname}`);
                } else if (lastLoginAsAdminCookie === "false") {
                    navigate(`/user/${displayname}`);
                } else {
                    navigate("/login");
                }

            }, 5000);
        }
    }, [dispatch, navigate, userCookie, lastLoginAsAdminCookie]);

    return (
        <div id="Loading">
            <Logo />
            <h1 id="Loading-heading">
                Loading ...
            </h1>
        </div>
    );
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

// async function UpdateCookie(usersQuery) {
//     const userDocs = await getDocs(usersQuery);
//     userDocs.forEach((doc) => {

//         if (doc.data().isadmin) {
//             dispatch(setAccessToken(doc.data()))
//             dispatch(setAdminStatus(true))
//             const user_data = JSON.stringify(doc.data());
//             document.cookie = `user=` + user_data + `;expires=${expiryDate.toUTCString()};path=/`;
//             document.cookie = `lastLoginAsAdmin=true;expires=${expiryDate.toUTCString()};path=/`;
//             navigate("/admin/" + user.displayName
//             );
//         } else {
//             alert(user.displayName + ", You are not an admin, Sign in as User");
//         }


//     });
// }

export default Loading;

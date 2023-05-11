import React, { useState } from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import "../App.css"
import Logo from "../Components/Metamask";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from "../Components/Firebase"
import ProfileDrawer from "../Components/ProfileEdit";


firebase.initializeApp(firebaseConfig);


function Admin() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState(0);
    const [NumUsers, setNumUsers] = useState(0);
    const user = useSelector((state) => state.auth.accessToken);


    async function getUsers() {
        const db = getFirestore();
        const userCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(userCollectionRef);
        console.log(querySnapshot.docs.length);
        setNumUsers(querySnapshot.docs.length);

        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapshot2 = await getDocs(q);
        console.log(querySnapshot2.docChanges.length);

        if (!querySnapshot2.empty) {
            const userDocRef = doc(db, "users", querySnapshot2.docs[0].id);

            await updateDoc(userDocRef, {
                lastLogin: serverTimestamp()
            });

        }
    }

    useEffect(() => {
        async function connectToMetamask() {
            if (window.ethereum) {
                try {
                    await window.ethereum.enable();
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);

                    const balance = await web3Instance.eth.getBalance(accounts[0]);
                    setBalance(web3Instance.utils.fromWei(balance, "ether"));
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Please install MetaMask to use this dApp.");
            }
        }
        connectToMetamask();
        getUsers();
    }, []);

    return (
        <>

            <div id="Admin-header">
                <h1 id="admin-header-title" >ADMIN Portal </h1>
                <div id="Count">
                    <h3>Total users </h3>
                    <h1>{NumUsers}</h1>
                </div>
            </div>
            <div id="Profile-update">
                <div>
                    <h3>  Update Profile</h3>
                </div>
            </div>

            <div id="Metamask">
                <Logo />
                {web3 && (
                    <div>

                        <p>Connected to Ethereum network using Metamask!</p>
                        <p>Your current account: {accounts[0]}</p>
                        <p>Your account balance: {balance} ETH</p>
                    </div>
                )}
            </div>
            <ProfileDrawer />


        </>
    );
}

export default Admin;

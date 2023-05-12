import React, { useState } from "react";
import { Link } from "react-scroll";

import Web3 from "web3";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import UserTable from "./Uselist";
import "../Style/Admin.css"
import { makeStyles } from '@material-ui/core/styles';
import Logo from "../Components/Metamask";
import { getFirestore, collection, query, orderBy, limit, where, getDocs, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from "../Components/Firebase"
import ProfileDrawer from "../Components/ProfileEdit";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';


firebase.initializeApp(firebaseConfig);
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
        border: `1px solid ${theme.palette.grey[300]}`,
        '& th': {
            backgroundColor: theme.palette.grey[200],
            fontWeight: theme.typography.fontWeightBold,
            padding: theme.spacing(1.5, 3),
        },
        '& td': {
            padding: theme.spacing(1.5, 3),
        },
        '& tr:nth-of-type(even)': {
            backgroundColor: theme.palette.grey[100],
        },
    },
}));



function Admin() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState(0);
    const [NumUsers, setNumUsers] = useState(0);
    const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
    const [lastUsers, setLastUsers] = useState([]);
    const user = useSelector((state) => state.auth.accessToken);
    const classes = useStyles();

    const userDisplay = () => {
        const element = document.getElementById("myComponent");
        element.scrollIntoView({ behavior: "smooth" });
    }

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
                setIsMetamaskConnected(true);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Please install MetaMask to use this dApp.");
        }
    }
    useEffect(() => {
        getUsers();
    }, []);


    useEffect(() => {
        const fetchLastUsers = async () => {
            const db = getFirestore();

            const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            const lastUsersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setLastUsers(lastUsersData);
            console.log(lastUsersData);
        };

        fetchLastUsers();
    }, []);

    return (
        <>
            <div id="main-admin">
                <div id="Admin-header">
                    <h1 id="admin-header-title" >ADMIN Portal </h1>
                    <div id="Count">
                        <div>
                            <p>Total registered users : {NumUsers}</p>

                        </div>

                        <ProfileDrawer />
                    </div>

                </div>
                <div id="admin-table" >


                    <div id="user-table" className="left">
                        <Typography variant="h4" align="center" gutterBottom>
                            Recent Users
                        </Typography>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Status</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lastUsers.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.displayName}</TableCell>
                                        <TableCell>{row.status}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Link to="my-component-id" smooth={true}>
                        <button id="user-button" onClick={userDisplay}>Display all users</button>
                    </Link>

                    <div id="Metamask" className="right">

                        {!isMetamaskConnected && (<>
                            <img src="https://1000logos.net/wp-content/uploads/2023/01/Ethereum-logo-768x432.png" alt="MetaMask fox logo" />
                            <button onClick={connectToMetamask}>Connect Metamask</button>
                        </>

                        )}
                        {isMetamaskConnected && (
                            <div>
                                <img src="https://1000logos.net/wp-content/uploads/2023/01/Ethereum-logo-768x432.png" alt="MetaMask fox logo" />
                                <p>Connected to Ethereum network using Metamask!</p>
                                <p>Your current account: {accounts[0]}</p>
                                <p>Your account balance: {balance} ETH</p>
                            </div>
                        )}
                    </div>

                </div>




            </div>
            <div id="myComponent">
                <UserTable />
            </div>
        </>

    );
}

export default Admin;

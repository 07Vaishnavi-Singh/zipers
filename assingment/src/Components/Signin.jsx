import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../store';
import { setAdminStatus } from '../admin';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import adminSlice from '../admin';


import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './Firebase';


const now = new Date();
const expiryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = getFirestore();
const userCollectionRef = collection(db, "users");

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        maxWidth: 400,
        margin: 'auto',
        marginTop: '10vh',
    },
    title: {
        fontSize: 24,
        marginBottom: '2vh',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        margin: '1vh 0',
    },
});

const SignIn = () => {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [newUser, setNewUser] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const isAdmin = useSelector(state => state.admin.isAdmin);


    const navigate = useNavigate();
    useEffect(() => {
        fetch('https://restcountries.com/v2/all')
            .then(response => response.json())
            .then(data => {
                const options = data.map(country => ({
                    value: country.alpha2Code,
                    label: country.name
                }));
                setCountries(options);
            })
            .catch(error => console.log("here"));
    }, []);

    const handleForgotPassword = async (event) => {
        event.preventDefault();

        try {
            await auth.sendPasswordResetEmail(email);
            setEmailSent(true);
            console.log('Password reset email sent');
            setShowForgotPassword(false);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const handleForgotPassword2 = async (event) => {
        event.preventDefault();
        setShowForgotPassword(true);
    };

    const handleAdminLogin = async (event) => {
        event.preventDefault();

        try {
            const { user } = await auth.signInWithEmailAndPassword(email, password);
            console.log('signed in with user ID:', user.displayName);

            const usersQuery = query(userCollectionRef, where("email", "==", email));
            const userDocs = await getDocs(usersQuery);


            userDocs.forEach((doc) => {
                console.log(doc.data());
                doc.data().isadmin ? dispatch(setAccessToken(doc.data())) : console.log();
                doc.data().isadmin ? dispatch(setAdminStatus(true)) : console.log();
                const user_data = JSON.stringify(doc.data());
                document.cookie = `user=` + user_data + `;expires=${expiryDate.toUTCString()};path=/`;
                document.cookie = `lastLoginAsAdmin=true;expires=${expiryDate.toUTCString()};path=/`;

            });

            navigate("/admin/" + user.displayName)

        } catch (err) {
            setError('Error: ' + err.message);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleCountryChange = (val) => {
        setSelectedCountry(val);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const { user } = await auth.signInWithEmailAndPassword(email, password);
            console.log('signed in with user ID:', user.uid);
            const usersQuery = query(userCollectionRef, where("email", "==", email));
            const userDocs = await getDocs(usersQuery);

            userDocs.forEach((doc) => {
                console.log(doc.data());
                dispatch(setAccessToken(doc.data()))
                dispatch(setAdminStatus(false))

                const user_data = JSON.stringify(doc.data());
                document.cookie = `user=` + user_data + `;expires=${expiryDate.toUTCString()};path=/`;
                document.cookie = `lastLoginAsAdmin=false;expires=${expiryDate.toUTCString()};path=/`;

            });

            navigate("/user/" + user.displayName)

        } catch (err) {
            setError('Error: ' + err.message);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleSignUp = async (event) => {

        event.preventDefault();
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            const user = firebase.auth().currentUser;
            console.log('user created with ID:', user.uid);
            await user.updateProfile({
                displayName: displayName,
            });
            const userDocRef = doc(userCollectionRef, email); // replace "userId" with the authenticated user's ID
            const userData = {
                displayName: displayName,
                email: email,
                uid: user.uid,
                photoURL: user.photoURL,
                country: selectedCountry,
                isadmin: false,
                friends: 0,
                followers: 0,
                status: "active",
                lastLogin: serverTimestamp()
            };
            setDoc(userDocRef, userData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        {newUser ? 'Sign Up' : !showForgotPassword ? 'Sign In' : 'Forgot Password'}

                    </Typography>
                    {newUser ? (<>
                        <form className={classes.form} onSubmit={handleSignUp}>

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="displayName"
                                label="Display Name"
                                name="displayName"
                                autoComplete="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password2"
                                label="Re-enter Password"
                                type="password"
                                id="password2"
                                autoComplete="current-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <FormControl variant="outlined" margin="normal" fullWidth>
                                <InputLabel id="country-label">Country</InputLabel>

                                <Select
                                    labelId="country-label"
                                    id="country"
                                    value={selectedCountry}
                                    onChange={(event) => setSelectedCountry(event.target.value)}
                                    MenuProps={{ maxHeight: 100 }}
                                >
                                    {countries.map((country) => (
                                        <MenuItem key={country.value} value={country.value}>
                                            {country.label}
                                        </MenuItem>
                                    ))}
                                </Select>



                            </FormControl>
                            <p onClick={() => { setNewUser(false) }}>Already have an account .. click here</p>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSignUp}
                            >
                                Sign Up
                            </Button>

                        </form>
                    </>) :
                        !showForgotPassword ? (
                            <form className={classes.form} onSubmit={handleLogin}>
                                {error && <p>{error}</p>}
                                <TextField
                                    className={classes.input}
                                    id="email"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                                <TextField
                                    className={classes.input}
                                    id="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <p onClick={() => { setNewUser(true) }}>Dont have an account yet ...Click heree</p>
                                <Button className={classes.input} onClick={handleAdminLogin} variant="contained" color="primary">
                                    Log In as Admin
                                </Button>
                                <Button
                                    className={classes.input}
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleForgotPassword2}
                                >
                                    Forgot Password
                                </Button>
                                <Button className={classes.input} type="submit" variant="contained" color="primary">
                                    Log In as User

                                </Button>
                                {showAlert && (
                                    <div>
                                        <p>Check your mail for the password reset link</p>

                                    </div>
                                )}
                            </form>) : (<form className={classes.form} onSubmit={handleForgotPassword}>
                                <TextField
                                    className={classes.input}
                                    id="email"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                                <Button className={classes.input} type="submit" variant="contained" color="primary">
                                    Reset Password
                                </Button>
                            </form>)}
                </CardContent>
            </Card >

        </>

    );
};

export default SignIn;

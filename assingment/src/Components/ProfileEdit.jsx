// import React, { useEffect, useState } from "react";
// import { PhotoCamera } from "@material-ui/icons";
// import { useDispatch, useSelector } from 'react-redux';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import firebaseConfig from './Firebase';
// import { initializeApp } from "firebase/app";

// // import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
// import {
//     Button,
//     Drawer,
//     FormControl,
//     FormHelperText,
//     Grid,
//     IconButton,
//     InputLabel,
//     makeStyles,
//     MenuItem,
//     Select,
//     TextField,
//     Toolbar,
//     Typography,
// } from "@material-ui/core";
// import { Menu as MenuIcon, ExitToApp as LogoutIcon } from "@material-ui/icons";

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//     },
//     menuButton: {
//         marginRight: theme.spacing(2),
//     },
//     title: {
//         flexGrow: 1,
//     },
//     formControl: {
//         minWidth: 120,
//     },
//     drawer: {
//         width: 400,
//     },
// }));

// const app = initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const storage = firebase.storage(app);
// const db = getFirestore();
// const userCollectionRef = collection(db, "users");

// const ProfileButton = () => {
//     const user = useSelector((state) => state.auth.accessToken);
//     const displayname = user.displayName;
//     const countryname = user.country;
//     const classes = useStyles();
//     const [open, setOpen] = useState(false);
//     const [editMode, setEditMode] = useState(false);
//     const [displayName, setDisplayName] = useState(displayname);
//     const [country, setCountry] = useState(countryname);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     // const [image, setImage] = useState(null);
//     const [showAlert, setShowAlert] = useState(false);

//     // const handleImageChange = (event) => {
//     //     setImage(event.target.files[0]);
//     // };

//     // const handleSubmit = async (event) => {
//     //     event.preventDefault();

//     //     const storageRef = ref(storage, `profilePictures/${image.name}`);
//     //     await uploadBytes(storageRef, image);

//     //     // Get download URL of uploaded image
//     //     const downloadURL = await getDownloadURL(storageRef);

//     //     // Update Firestore document with download URL
//     //     const userRef = doc(db, "users", user.uid);
//     //     await updateDoc(userRef, { photoURL: downloadURL });

//     //     // Reset state
//     //     setImage(null);
//     // };
 
//     const handleLogout = () => {
//         // Implement your logout functionality here
//     };
 
//     const handleForgotPassword = async (event) => {
//         event.preventDefault();

//         try {
//             await auth.sendPasswordResetEmail(user.email);
//             console.log('Password reset email sent');
//             setShowAlert(true);
//             setTimeout(() => {
//                 setShowAlert(false);
//             }, 3000);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEditProfile = () => {
//         setEditMode(true);
//     };
//     const handleEditProfileclose = () => {
//         setEditMode(false);
//     };
//     const handleClose = () => {
//         setOpen(false);
//         setEditMode(false);
//     };
    
//     const handleDisplayNameChange = (e) => {
//         setDisplayName(e.target.value);
//     };
//     const handleCountryChange = (e) => {
//         setCountry(e.target.value);
//     };
//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };
//     const handleConfirmPasswordChange = (e) => {
//         setConfirmPassword(e.target.value);
//     };

//     const handleDrawerOpen = () => {
//         setOpen(true);
//     };
//     const handleDrawerClose = () => {
//         setOpen(false);
//     };
//     const handleSave = async () => {
//         const db = getFirestore();
//         const userCollectionRef = collection(db, 'users');
//         const q = query(collection(db, "users"), where("email", "==", user.email));
//         const querySnapshot2 = await getDocs(q);
//         console.log(querySnapshot2.docChanges.length);

//         if (!querySnapshot2.empty) {
//             const userDocRef = doc(db, "users", querySnapshot2.docs[0].id);

//             await updateDoc(userDocRef, {
//                 lastLogin: serverTimestamp(),
//                 displayName: displayName,
//                 country: country,
//             });

//         }
//     };
//     useEffect(() => {

//     }, [displayName, country, password, confirmPassword]);
//     return (
//         <div className={classes.root}>
//             <IconButton
//                 edge="end"
//                 className={classes.menuButton}
//                 color="inherit"
//                 aria-label="menu"
//                 onClick={handleDrawerOpen}
//             >
//                 <MenuIcon />
//             </IconButton>
//             <Drawer
//                 anchor="right"
//                 open={open}
//                 onClose={handleClose}
//                 classes={{ paper: classes.drawer }}
//             >
//                 <Toolbar>
//                     <Typography variant="h6" className={classes.title}>
//                         Profile
//                     </Typography>
//                     <IconButton onClick={handleDrawerClose}>
//                         <MenuIcon />
//                     </IconButton>
//                 </Toolbar>
//                 {editMode ? (
//                     <div style={{ padding: 16 }}>
//                         <Typography variant="h6">Edit Profile</Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12}>
//                                 <TextField
//                                     variant="outlined"
//                                     fullWidth
//                                     label="Display Name"
//                                     value={displayName}
//                                     onChange={handleDisplayNameChange}
//                                 />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <FormControl variant="outlined" fullWidth>
//                                     <InputLabel id="country-label">Country</InputLabel>
//                                     <Select
//                                         labelId="country-label"
//                                         id="country"
//                                         value={country}
//                                         onChange={handleCountryChange}
//                                         label="Country"
//                                     >
//                                         <MenuItem value="">
//                                             <em>None</em>
//                                         </MenuItem>
//                                         <MenuItem value="USA">USA</MenuItem>
//                                         <MenuItem value="Canada">Canada</MenuItem>
//                                         <MenuItem value="Mexico">Mexico</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                             <form className={classes.form} onSubmit={handleForgotPassword}>
//                                 {showAlert && (
//                                     <div>
//                                         <p>Check your mail for the password reset link</p>

//                                     </div>
//                                 )}
//                                 <Button className={classes.input} type="submit" variant="contained" color="primary">
//                                     Reset Password
//                                 </Button>
//                             </form>
//                             <form >
//                                 <Grid item xs={12}>
//                                     <input
//                                         accept="image/*"
//                                         style={{ display: "none" }}
//                                         id="icon-button-file"
//                                         type="file"
                                       
//                                     />
//                                     <label htmlFor="icon-button-file">
//                                         <IconButton
//                                             color="primary"
//                                             aria-label="upload picture"
//                                             component="span"
//                                         >
//                                             <PhotoCamera />
//                                         </IconButton>
//                                     </label>
//                                 </Grid>
//                                 <Button variant="contained" color="primary" type="submit">
//                                     Save Changes
//                                 </Button>
//                             </form>
//                             <Grid item xs={12}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleSave}
//                                 >
//                                     Save Changes
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleEditProfileclose}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                     </div>
//                 ) : (
//                     <div style={{ padding: 16 }}>
//                         <Typography variant="h6">Profile Info</Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12}>
//                                 <Typography>
//                                     Display Name: {displayName ? displayName : "N/A"}
//                                 </Typography>
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleEditProfile}
//                                 >
//                                     Edit Profile
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                     </div>
//                 )}
//                 <div style={{ padding: 16 }}>
//                     {success && (
//                         <Typography variant="body1" style={{ color: "green" }}>
//                             {success}
//                         </Typography>
//                     )}
//                     {error && (
//                         <Typography variant="body1" style={{ color: "red" }}>
//                             {error}
//                         </Typography>
//                     )}
//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         startIcon={<LogoutIcon />}
//                         onClick={handleLogout}
//                     >
//                         Logout
//                     </Button>
//                 </div>
//             </Drawer>
//         </div>
//     );
// };

// export default ProfileButton;
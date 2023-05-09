import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../store';

function Loading() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const userCookie = getCookie("user");
        const lastLoginAsAdminCookie = getCookie("lastLoginAsAdmin");


        if (!userCookie) {
            navigate("/login");
        } else {
            const displayname = JSON.parse(userCookie).displayname;
            dispatch(setAccessToken(JSON.parse(userCookie)))
            if (lastLoginAsAdminCookie === "true") {
                navigate("/admin/" + displayname);
            } else if (lastLoginAsAdminCookie === "false") {
                navigate("/user/" + displayname);
            } else {
                navigate("/login");
            }
        }
    });

    return (
        <>
            <h1>
                Loading ...
            </h1>
        </>
    );
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

export default Loading;

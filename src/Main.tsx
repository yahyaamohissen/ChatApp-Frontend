import { FunctionComponent, useEffect, useRef, useState } from "react";
import axios, { InternalAxiosRequestConfig } from 'axios';
import { AppDispatch, RootState } from "./StateManagement/Auth/Store";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./StateManagement/Auth/AuthSlice";
import LoginForm from "./Componenets/Login/LoginForm";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getClaimsFromToken } from "./Helpers/AuthHelpers";
import { isNullOrWhitespace } from "./Helpers/StringHelpers";
import ChatPopUp from "./Componenets/ChatPopUp";
import { Button, Theme, Typography } from "@mui/material";
import { TextField } from "@material-ui/core";
import { createStyles, makeStyles } from '@mui/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      wrapForm : {
          display: "flex",
          justifyContent: "center",
          width: "95%",
          margin: `${0} auto`
      },
      wrapText  : {
          width: "100%"
      },
      button: {
          //margin: theme.spacing(1),
      },
    })
  );

export const Main: FunctionComponent = () => {
    const classes = useStyles();
    const authInfo = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [signalRConnection, setsignalRConnection] = useState<HubConnection | null>(null);
    const [friendUsername, setFriendUsername] = useState('');
    const [search, setSearch] = useState(false);

    const baseUrl = `${process.env.REACT_APP_APIURL}`;
    axios.defaults.baseURL = `${baseUrl + "/"}`;

    if (authInfo.isAuthenticated && signalRConnection == null) {

        var connection = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/chatHub`,
                {
                    withCredentials: true,
                    accessTokenFactory: () => authInfo.token ?? localStorage.getItem('authToken') ?? ''
                })
            .configureLogging(LogLevel.Debug)
            .withAutomaticReconnect()
            .build();

        setsignalRConnection(connection);
    }

    // Function to modify requests or handle fulfilled responses
    const onFulfilled = (config: InternalAxiosRequestConfig) => {
        // Get the token from localStorage or another storage mechanism
        const token = localStorage.getItem('authToken'); // Or wherever you store the token
        config.baseURL = `${process.env.REACT_APP_APIURL + "/"}`;
        // If the token exists, set the Authorization header
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Optionally log the config to see the request details
        console.log('Request:', config);

        return config; // Return the config to allow the request to continue
    };

    // Function to handle rejected responses (errors)
    const onRejected = (error: any) => {
        console.error('Request failed:', error);
        return Promise.reject(error);
    };

    const onLoginSuccess = (token: string) => {
        if (!isNullOrWhitespace(token)) {
            localStorage.setItem('authToken', token);
            const claims = getClaimsFromToken(token);
            dispatch(login({
                token: token, user: {
                    email: claims?.email ?? '',
                    id: Number(claims?.sub) ?? 0,
                    name: claims?.given_name ?? '',
                    userName: claims?.username ?? ''
                }
            }))
        }
    }

    axios.interceptors.request.use(onFulfilled, onRejected);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div>
            {authInfo.isAuthenticated ? (
                <>
                    <h1>Welcome, {authInfo.user?.name}</h1>

                    <form className={classes.wrapForm}  noValidate autoComplete="off">
                        <Typography>Enter Frind username to connect with them.</Typography>
                        <TextField
                            id="usernametxt"
                            label="Frind username"
                            className={classes.wrapText}
                            value={friendUsername}
                            onChange={(event)=>{ setFriendUsername(event.target.value); }}
                        />
                        <Button 
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={()=>{ setSearch(prev => !prev) }} >
                            <PersonAddIcon />
                        </Button>
                    </form>

                    {search && signalRConnection ? <ChatPopUp signalRConnection={signalRConnection as HubConnection} chatIdentifier={friendUsername} /> : null}

                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <LoginForm onLoginSuccess={onLoginSuccess} />
            )}
        </div>
    );
}

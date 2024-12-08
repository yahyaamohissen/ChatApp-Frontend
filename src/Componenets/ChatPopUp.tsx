import { createStyles, makeStyles } from '@mui/styles';
import { MessageLeft, MessageRight } from "./FloutingMessage";
import { Alert, Paper, Theme } from "@mui/material";
import { ChatTextInput } from "./TextInput";
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import { RootState } from '../StateManagement/Auth/Store';
import { isNullOrWhitespace } from '../Helpers/StringHelpers';
import { useEffect, useState } from 'react';
import { Message } from '../Models/Message';
import CircularProgress from '@mui/material/CircularProgress';
import { GetUserMessages } from '../Services/Messages';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )"
    }
  })
);

export type ChatPros =
  {
    signalRConnection: HubConnection;
    chatIdentifier: string;
  }

export default function ChatPopUp(props: ChatPros) {
  const classes = useStyles();
  const authInfo = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const handleReceiveMessageFromFriend = (message: Message) => {
    setMessages(prev => [...prev, message]);
  }

  useEffect(() => { //to regester methods 
    (async () => {
      setLoadingMessages(true);
      
      var result = await GetUserMessages(authInfo.user?.id ?? 0, props.chatIdentifier, 1, 100);
      setMessages(result);

      props.signalRConnection.on('ReceiveMessageFromFriend', handleReceiveMessageFromFriend)

      setLoadingMessages(false);
    })();
  }, []);



  const sendMessageToFriend = async (message: string) => {
    if (props.signalRConnection && !isNullOrWhitespace(message) && !isNullOrWhitespace(props.chatIdentifier) && authInfo.isAuthenticated) {
      try {
        console.log(props.signalRConnection.state);
        if (props.signalRConnection.state == HubConnectionState.Connected)
          props.signalRConnection.invoke("SendMessageToFriend", props.chatIdentifier, message);
        else
          await props.signalRConnection.start().then(()=>{props.signalRConnection.invoke("SendMessageToFriend", props.chatIdentifier, message);})

      } catch (err) {
        console.error("Error sending message: ", err);
        console.log("erooooooooooooooooe ");
      }
    }
  };
  
  if (isNullOrWhitespace(props.chatIdentifier))
    return <Alert severity="error">Error loading chat.</Alert>;

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <Paper id="style-1" className={classes.messagesBody}>
          
          {
            loadingMessages ?
              <CircularProgress />
              :
              messages?.map(message => {
                if (message.senderUsername === authInfo.user?.userName)
                  return <MessageRight
                    displayName={message.senderUsername}
                    message={message.content}
                    timestamp={message.sentAt.toLocaleString()}
                    avatarDisp={true}
                    error={false}
                    photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c" />//should be returned from backend

                return <MessageLeft
                  displayName={message.senderUsername}
                  message={message.content}
                  timestamp={message.sentAt.toLocaleString()}
                  avatarDisp={true}
                  error={false}
                  photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c" />;
              })
          }
        </Paper>
        <ChatTextInput
          sendDisabled={false}
          textDisabled={false}
          emptyAfterSend={true}
          onSend={sendMessageToFriend} />
      </Paper>
    </div>
  );
}
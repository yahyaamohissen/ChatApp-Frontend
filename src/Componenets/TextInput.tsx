import { createStyles, makeStyles } from '@mui/styles';
import { Button, TextField, Theme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { isNullOrWhitespace } from '../Helpers/StringHelpers';

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

export type TextInputPros =
  {
    onSend?: (message: string) => void;
    onFocus?: () => void;
    onFocusLost?: () => void;
    sendDisabled: boolean;
    textDisabled: boolean;
    emptyAfterSend: boolean;
  }

export const ChatTextInput = (props: TextInputPros) => {
    const classes = useStyles();
    const [messageToBeSent, setMessageToBeSent] = useState<string>('');

    const handleSendClicked = () => {
        if(!isNullOrWhitespace(messageToBeSent) && props.onSend)
        {
            props.onSend(messageToBeSent);
            if(props.emptyAfterSend)
                setMessageToBeSent('');
        }
    }
    
    return (
        <>
            <form className={classes.wrapForm}  noValidate autoComplete="off">
                <TextField
                    id="standard-text"
                    label="メッセージを入力"
                    className={classes.wrapText}
                    disabled={props.textDisabled}
                    value={messageToBeSent}
                    onChange={(event)=>{ setMessageToBeSent(event.target.value); }}
                    //margin="normal"
                />
                <Button 
                    variant="contained"
                    color="primary" 
                    disabled = {props.sendDisabled}
                    className={classes.button}
                    onClick={handleSendClicked} >
                    <SendIcon />
                </Button>
            </form>
        </>
    )
}
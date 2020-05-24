import React, { useState, useEffect } from "react";

//import { Container, Grid } from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  IconButton,
} from "@material-ui/core";
//import { useTranslation } from "react-i18next";

import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }
}));


function OpenDialog (props) {
  const [open, setOpen] = useState(props.dialog || false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => setOpen(props.dialog), [props.dialog])

  const handleClickOpen = () => {setOpen(true);};

  const handleClose = () => {
    setOpen(false);
    if (props.close instanceof Function)
      props.close()
  };

  const Content = props.content;
  const classes = useStyles();
  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="sign-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle className={classes.dialogTitle} disableTypography>
            <h2>{props.name}</h2>
            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
           <Content {...props}/>
        </DialogContent>
      </Dialog>
  );
}

function Close (props) {
  console.log("close dialog");
  return "";
}

export default OpenDialog;
//export default {Open,Close};

import React, { useState, useEffect, useContext } from 'react';
import { Link } from "@reach/router";
// * context
import { Context as AuthContext } from "../context/AuthContext";
// * dependencies
import { Button, TextField, Grid, Box, Typography, Container, LinearProgress, Modal, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
// * components
import ErrorSnackbar from '../components/ErrorSnackbar'
import ConfirmationSnackbar from '../components/ConfirmationSnackbar'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '} One Cloud ID {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signinText: {
    marginBottom: theme.spacing(2),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  forgotPassword: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'false'
  },
  signuplink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalPaper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

}));

const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string().required('Password is required'),
});

export default function SignInScreen() {
  const { state, signin, clearErrorMessage, resetPassword } = useContext(AuthContext);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("sign in");
  const [loading, setLoading] = useState(false);
  const [useError, setUseError] = useState("")
  const [open, setOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [resetPasswordError, setResetPasswordError] = useState("")

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const authError = state.errorMessage;

  useEffect(() => {
    authError ? setUseError(authError.message) : setUseError("")
  }, [authError]);

  const handleSignin = () => {
    setLoading(true)
    setButtonText('beaming up....')
    signin(email, password)
  }

  const handleErrorMessage = () => {
    setLoading(false)
    setButtonText('create')
    clearErrorMessage()
  }

  const handlePasswordReset = async () => {
    if (!resetPasswordEmail) {
      setModalLoading(false)
      setResetPasswordError("Email is required")
      return
    };
    setResetPasswordError("")
    setModalLoading(true)
    await resetPassword(resetPasswordEmail)
    setModalLoading(false)
    setOpen(false)
    setEmailSent(true)
  }


  // * get ConfirmationSnackbar to show after email is sent and modal closes

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.signinText} >
          One Cloud ID
        </Typography>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate >
          <TextField
            variant="outlined"
            margin="normal"
            disabled={loading}
            required
            fullWidth
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            label="Email Address"
            placeholder="user@mail.com"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            disabled={loading}
            required
            fullWidth
            label="Password"
            placeholder="Example123"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div className={classes.wrapper}>
            <Button
              fullWidth
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSignin}
            >
              {buttonText}
            </Button>
            {loading && < LinearProgress />}
          </div>
          <Grid container className={classes.forgotPassword}>
            <Grid item xs>
              <Button color="primary" onClick={handleOpen}>Forgot password?</Button>
            </Grid>
          </Grid>
          <Grid container className={classes.signuplink}>
            <Grid item>
              <Button color="primary" component={Link} to="/signup">
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <div style={modalStyle} className={classes.modalPaper}>
            <h2 id="simple-modal-title">Reset Password</h2>
            <TextField
              variant="outlined"
              margin="normal"
              disabled={modalLoading}
              error={!resetPasswordError ? false : true}
              helperText={resetPasswordError}
              required
              fullWidth
              id="email"
              value={resetPasswordEmail}
              onChange={e => setResetPasswordEmail(e.target.value)}
              label="Email Address"
              placeholder="user@mail.com"
              autoComplete="email"
              autoFocus
            />
            {!modalLoading
              ? (<Button color="primary" disabled={modalLoading} onClick={handlePasswordReset}>Send email</Button>)
              : (<CircularProgress style={{ color: "green" }} />)}
          </div>
        </Modal>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      {useError && <ErrorSnackbar errorMessage={useError} handleClearError={handleErrorMessage} />}
      {emailSent && <ConfirmationSnackbar />}
    </Container >
  );
}

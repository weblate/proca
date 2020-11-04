import React, { useState } from "react";

import { Container, Grid } from "@material-ui/core";

import TextField from "../TextField";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  /* Styles applied to the root element. */
  root: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    // For correct alignment with the text.
    verticalAlign: "middle",
    WebkitTapHighlightColor: "transparent",
    marginLeft: -11,
    marginRight: 16, // used for row presentation of radio/checkbox
  },
}));

export default function Register(props) {
  //  const setConfig = useCallback((d) => _setConfig(d), [_setConfig]);

  const classes = useStyles();
  const { t } = useTranslation();

  const compact = props.compact;
  const form = props.form;
  const [certify, setCertify] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const handleCertify = (e) => {
    setCertify(true);
  };

  const handlePrivacy = (e) => {
    setPrivacy(true);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormGroup>
            <FormLabel className={classes.root} placement="end">
              <Checkbox
                color="primary"
                checked={certify}
                onChange={handleCertify}
                name="certify"
              />
              <span>{t("eci:form.certify-info")}</span>
            </FormLabel>
            <FormLabel className={classes.root} placement="end">
              <Checkbox
                color="primary"
                checked={privacy}
                onChange={handlePrivacy}
                name="privacy"
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: t("eci:form.privacy-statement"),
                }}
              />
            </FormLabel>
          </FormGroup>
        </Grid>
      </Grid>
    </Container>
  );
}
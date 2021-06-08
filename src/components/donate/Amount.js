import React, { useState } from "react";
import { useCampaignConfig } from "../../hooks/useConfig";
import useData from "../../hooks/useData";
import FrequencyButton from "./buttons/FrequencyButton";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Box,
  CardMedia,
  CardHeader,
  CardContent,
  FormControl,
  InputAdornment,
  FormGroup,
  Button,
  ButtonGroup,
  Typography,
  Paper,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import TextField from "../TextField";
import { useForm } from "react-hook-form";
import useElementWidth from "../../hooks/useElementWidth";

import { useTranslation } from "react-i18next";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import AmountButton from "./buttons/AmountButton";

const useStyles = makeStyles((theme) => ({
  amount: {
    width: "5em",
  },
  number: {
    "& input": {
      "&[type=number]": {
        "-moz-appearance": "textfield",
      },
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
  },
  root: {
    "& > *": {
      margin: theme.spacing(0.5),
      fontSize: theme.fontSize * 3,
    },
  },
  frequency: {
    marginTop: theme.spacing(2),
  },
}));

const DonateAmount = (props) => {
  const classes = useStyles();

  const { t } = useTranslation();
  const config = useCampaignConfig();
  const [data, setData] = useData();

  const donateConfig = config.component.donation;
  const amounts = donateConfig.amount?.oneoff?.default ||
    donateConfig.amount?.oneoff || [3, 5, 10];

  if (data.initialAmount && !amounts.find((s) => s === data.initialAmount)) {
    amounts.push(data.initialAmount);
  }

  amounts.sort((a, b) => a - b);

  const form = useForm();

  const currency = data.currency;
  const amount = data.amount;

  const [showCustomField, toggleCustomField] = useState(false);
  const width = useElementWidth("#proca-donate");

  const [compact, setCompact] = useState(true);
  if ((compact && width > 450) || (!compact && width <= 450)) {
    setCompact(width <= 450);
  }
  const title = amount
    ? config?.component?.donation.igive ||
      t("I'm donating {{amount}}", {
        amount: amount.toString() + currency.symbol,
      })
    : config?.component.donation?.title || t("Choose your donation amount");

  const average = donateConfig?.amount?.oneoff?.average;
  const subtitle = average
    ? t("The average donation is {{amount}} {{currency}}", {
        amount: average,
        currency: currency.code,
      })
    : donateConfig?.subTitle;
  const image = donateConfig?.image;

  return (
    <Container id="proca-donate">
      <Paper square>
        <AppBar position="static" color="default">
          <Tabs
            variant="fullWidth"
            value="amount"
            indicatorColor="primary"
            textColor="primary"
            aria-label="disabled tabs example"
          >
            {" "}
            <Tab
              value="amount"
              label={t("Choose an Amount")}
              aria-label={t("Choose an Amount")}
            />
          </Tabs>
        </AppBar>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CardHeader title={title} subheader={subtitle} />

            {image ? <CardMedia image={image} title={title} /> : null}
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              <Typography color="textSecondary">
                {t("campaign:donation.intro", {
                  defaultValue: "",
                  campaign: config.campaign.title,
                })}
              </Typography>
              <Grid container spacing={1}>
                {amounts.map((d) => (
                  <Grid sm={6} md={3} key={d} item>
                    <AmountButton
                      amount={d}
                      onClick={() => toggleCustomField(false)}
                    />
                  </Grid>
                ))}
                <Grid item>
                  <Button
                    color="primary"
                    name="other"
                    onClick={() => toggleCustomField(true)}
                  >
                    {t("Other")}
                  </Button>
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <FormGroup>
                  {showCustomField && (
                    <TextField
                      form={form}
                      type="number"
                      label={t("Amount")}
                      name="amount"
                      className={classes.number}
                      onChange={(e) => {
                        const a = parseFloat(e.target.value);
                        if (a) {
                          setData("amount", a);
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {currency.symbol}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </FormGroup>
              </FormControl>

              {/* <Typography variant="h5" gutterBottom color="textSecondary">
            {t("campaign:donation.frequency.intro", {
              defaultValue: "Make it monthly?",
            })}
          </Typography> */}
              {config.component.donation?.amount?.monthly && (
                <div className={classes.frequency}>
                  <Grid container spacing={1}>
                    <Grid item sm={12} md={6}>
                      <FrequencyButton frequency="monthly">
                        {t("Monthly")}
                      </FrequencyButton>
                    </Grid>
                    <Grid item sm={12} md={6}>
                      <FrequencyButton frequency="oneoff">
                        {t("One-time")}
                      </FrequencyButton>
                    </Grid>
                  </Grid>
                </div>
              )}
            </CardContent>
          </Grid>

          {!config.component.donation.external && (
            <Grid item xs={12}>
              <Box margin={2}>
                <ButtonGroup fullWidth>
                  <Button
                    endIcon={<SkipNextIcon />}
                    fullWidth
                    disabled={!amount}
                    variant="contained"
                    onClick={props.done}
                    color="primary"
                  >
                    {t("Next")}
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};
export default DonateAmount;

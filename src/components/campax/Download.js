import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/SaveAlt';
import { useTranslation } from "react-i18next";
import {useCampaignConfig} from "../../hooks/useConfig";

const url = (data, param) => {

    let postcardUrl="https://collect-pdf.campax.org?"
      + "postalcode=" + data.postcode
      + "&canton=" + data.region
      + "&birthdate=" +data.birthdate
      + "&address=" + data.address
      + "&locality=" + data.locality
  ;
  if (param.pdfUrl)
    postcardUrl +="&pdf="+encodeURIComponent(param.pdfUrl);
  if (param.marginTop)
    postcardUrl +="&top="+param.marginTop;

  return postcardUrl
}

function Download (props) {
  const { t } = useTranslation();
  const {config} = useCampaignConfig();
  const next = () => {
    if (props.done instanceof Function) props.done();
  }

  const handleDownload = () => {
    window.open(config.data.postcardUrl, 'pdf', 'toolbar=0,status=0,width=548,height=775');
    next();
  }

  return (
    <Card>
    <CardContent><Typography variant="h5" gutterBottom>{t("Thank you")}</Typography>
    <p>
    {t("Download explanation")}
    </p>
    </CardContent>
    <CardActions>
    <Button variant="contained" color="primary" onClick={handleDownload} startIcon={<SaveIcon />}>{t("Download")}</Button>
    <Button onClick={next}>{t("Next")}</Button>
    </CardActions>
    </Card>
  );
}

export default Download;
export {url};

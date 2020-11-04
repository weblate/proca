import i18n from '../../lib/i18n';
import React,{useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import useForm from "react-hook-form";

import eciLocale from '../../locales/en/eci';
import documents from "../../data/document_number_formats.json";

import Country from './Country';
import General from './General';
import Address from './Address';
import Consent from './Consent';
import Id from './Id';
import useElementWidth from "../../hooks/useElementWidth";
import useData from "../../hooks/useData";
import { makeStyles } from "@material-ui/core/styles";

//import Address from './Address';
//import Id from './Id';



const removeDotKey = (obj) => {
    Object.keys(obj).forEach(key => {

    if (typeof obj[key] === 'object') {
            removeDotKey(obj[key])
        }
    if (key.includes(".")) {
      obj[key.replace(/\./g,"_")] = obj[key];
      delete obj[key];

    }
    })
}

removeDotKey(eciLocale);
i18n.addResourceBundle ('en','eci',eciLocale);
//const countries = eciLocale.common.country;

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  notice: {
    fontSize:theme.typography.pxToRem(13),
    fontWeight: 'fontWeightLight',
    lineHeight: '1.3em',
    color: theme.palette.text.secondary,
    '& a' : {
      color: theme.palette.text.secondary
    }
  }
}));

export default (props) => {
  const classes = useStyles();

  const width = useElementWidth("#proca-register");
  const [compact, setCompact] = useState(true);
  const [require, setRequire] = useState(false);
  const [acceptableIds, setIds] = useState({});

  const { t } = useTranslation();
//  const config = useCampaignConfig();
  const [data, setData] = useData();


  const form = useForm({
    defaultValues: data
  });

  const {
    handleSubmit,
    setError,
    formState,
    watch
  } = form;
  
  const nationality = watch("nationality") || "";
  useEffect (() => {
    if (nationality ) {
      const ids = documents[nationality.toLowerCase()];
      setIds (documents[nationality.toLowerCase()]);
      setRequire (Object.keys(ids).length ? "id" : "address");
    }
  }, [nationality,documents]);

    console.log(nationality,require, acceptableIds);

  if ((compact && width > 450) || (!compact && width <= 450))
    setCompact(width <= 450);

  const onSubmit = async data => {
    console.log(data);
//    data.tracking = Url.utm();
    return false;
  }

  useEffect(() => {
    const inputs = document.querySelectorAll("input, select, textarea");
    //    register({ name: "country" });
    // todo: workaround until the feature is native react-form ?
    inputs.forEach(input => {
      input.oninvalid = e => {
        setError(
          e.target.attributes.name.nodeValue,
          e.type,
          e.target.validationMessage
        );
      };
    });
  }, [setError]);

  return <form
      className={classes.container}
      id="proca-register"
      onSubmit={handleSubmit(onSubmit)}
      method="post"
      url="http://localhost"
  >
    <Country form={form} countries={eciLocale.common.country} />
    <div className={classes.notice} dangerouslySetInnerHTML={{__html: t("eci:common.requirements.text",{url:"https://eur-lex.europa.eu/legal-content/en/TXT/PDF/?uri=CELEX:32019R0788"})}} />
    <General form={form} birthdate={require === "address"} compact={compact} />
    {require === "address" && <Address form={form} compact={compact} />}
    {require === "id" && <Id form={form} compact={compact} ids={acceptableIds}/>}
    <Consent form={form} />
    </form>;
}
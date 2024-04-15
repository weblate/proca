import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useCampaignConfig } from "@hooks/useConfig";
import { imports } from "../../actionPage";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Badge from "@material-ui/core/Badge";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RemoveIcon from "@material-ui/icons/RemoveCircle";

const useStyles = makeStyles((theme) => ({
  badge: {
    "& .proca-MuiBadge-badge": {
      top: theme.spacing(0.5),
      height: "12px",
      padding: "0 2px",
      minWidth: "12px",
      right: theme.spacing(1),
      border: "1px solid " + theme.palette.action.disabledBackground,
      background: theme.palette.action.disabledBackground,
    },
  },
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  },
}));

const PartyFilter = (props) => {
  const classes = useStyles();
  const [parties, _setParties] = useState({});
  const config = useCampaignConfig();
  //console.log(config.component.email,props)
  const getKey = props.getKey || ((d) => d.description);
  const country = props.country?.toLowerCase();
  const filterCountry = props.filterCountry || ((d) => d.country === country);

  const filterParties = (d) => {
    const key = getKey(d);
    if (!parties[key]) {
      //      console.log(key, d,parties);
      console.log(" not in party");
      return false;
    }
    return parties[key].selected;
  };
  const setParties = (fullList) => {
    if (fullList.length) {
      const count = {};
      let list = fullList;
      if (props.country) {
        list = fullList.filter(filterCountry);
      }
      for (const item of list) {
        const key = getKey(item);
        if (count[key]) {
          count[key].count++;
        } else {
          count[key] = { count: 1, selected: false };
        }
      }

      //list.foreach
      const sortedObject = Object.fromEntries(
        [...Object.entries(count)].sort(([a], [b]) => a.localeCompare(b)),
      );

      _setParties(sortedObject);
      //return list[0];
    }
  };

  const filter = (all) => {
    if (!all || !Object.keys(parties).length) return;
    let selection = all;
    if (props.country) {
      selection = all.filter(filterCountry);
      //      console.log("after country", selection.length);
    }
    // TODO: based on the size of the selection, decide if we list all candidates by default, used to decide if we display the parties or direct the full list
    selection = selection.filter(filterParties);
    //    console.log("after party", selection.length);
    return selection;
  };

  const toggle = (name) => {
    _setParties((prevParties) => ({
      ...prevParties,
      [name]: {
        ...prevParties[name],
        selected: !prevParties[name].selected,
      },
    }));
    props.selecting(() => ({
      filter: "description",
      key: name,
      value: !parties[name].selected,
      reset: false,
    }));
  };

  /*  useEffect(() => {
    if (!parties) return;
    console.log("filtering", Object.keys(parties).length);
    props.selecting(filter);
  }, [parties]);
*/

  useEffect(() => {
    if (props.getKey) {
      console.log("filter", props);
    }
    props.selecting(setParties); // we're not selecting, just using that to get the parties from the contacts
  }, [props.selecting, props.country]);

  //avatar={<Avatar>{party.count}</Avatar>}

  if (parties) {
    return (
      <div className={classes.root}>
        {Object.entries(parties).map(([name, party]) => (
          <Badge
            key={name}
            badgeContent={party.count}
            color="default"
            overlap="rectangular"
            className={classes.badge}
            invisible={party.count < 2}
          >
            <Chip
              label={name}
              clickable
              color={party.selected ? "primary" : "default"}
              onClick={() => toggle(name)}
              onDelete={() => toggle(name)}
              deleteIcon={party.selected ? <RemoveIcon /> : <AddIcon />}
            />
          </Badge>
        ))}
      </div>
    );
  }
  return null;
};

export default PartyFilter;

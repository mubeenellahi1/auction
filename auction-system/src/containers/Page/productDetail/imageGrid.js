import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import { LinearProgress } from "@material-ui/core";

import InfoIcon from "@material-ui/icons/Info";

var tileData = [
  {
    img: "https://picsum.photos/300/200",
    title: "Image0",
    author: "author0",
  },
  {
    img: "https://picsum.photos/300/200",
    title: "Image1",
    author: "author1",
  },
  {
    img: "https://picsum.photos/300/200",
    title: "Image2",
    author: "author2",
  },
  {
    img: "https://picsum.photos/300/200",
    title: "Image3",
    author: "author3",
  },
  {
    img: "https://picsum.photos/300/200",
    title: "Image4",
    author: "author4",
  },
  {
    img: "https://picsum.photos/300/200",
    title: "Image5",
    author: "author5",
  },
  {
    img: "https://picsum.photos/300/200",
    title: "Image6",
    author: "author6",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function ImageGrid(images) {
  const classes = useStyles();

  tileData = images;

  return images ? (
    <div className={classes.root}>
      <GridList
        className={'prodDetail_img_list ' + classes.gridList}
        cols={2.5}
        justifyContent="flex-start"
        align
      >
        {tileData.map((tile) => {
          if (tile) {
            return (
              <GridListTile className="prodDetail_img_li" key={tile.image}
                style={{
                  backgroundImage: `url(${tile.image})`,
                }}>
                {/* <img
                  src={tile.image}
                  alt={tile.title ? tile.title : "alt-text"}
                /> */}
                <GridListTileBar
                  actionIcon={
                    <IconButton
                      style={{ color: "white" }}
                      //color="secondary"
                      className={classes.icon}
                    >
                      <InfoIcon color="inherit" />
                    </IconButton>
                  }
                  title={tile.title ? tile.title : ""}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                />
              </GridListTile>
            );
          }
          return null;
        })}
      </GridList>
    </div>
  ) : (
      <LinearProgress></LinearProgress>
    );
}

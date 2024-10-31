/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, {useState} from "react";

import "./page.css";
import { 
    Typography,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box
 } from "@mui/material";

 import CircularProgress, {
    CircularProgressProps,
  } from '@mui/material/CircularProgress';

  import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

 import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExtensionIcon from '@mui/icons-material/Extension';

 interface Game {
    id : number;
    name : string;
    description : string;
    isAuthorizedtoTake : boolean; 
    challenges : {
        id : number
        name : string;
        description : string;
        isCompleted : boolean;
    }[]
 }

 

 function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
  ) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary' }}
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

export const page = () => {

    const games : Game[] = [
        {
            id : 1,
            name : 'Maze Escape',
            description : '',
            isAuthorizedtoTake : true,
            challenges : [
                {
                    id : 1,
                    name : 'Level 1',
                    description : 'Level 1',
                    isCompleted : true,
                },
                {
                    id : 2,
                    name : 'Level 2',
                    description : 'Level 2',
                    isCompleted : true,
                },
                {
                    id : 3, 
                    name : 'Level 3',
                    description : 'Level 3',
                    isCompleted : true,
                }
            ]
        },
        {
            id : 2,
            name : 'Treasure Hunt',
            description : '',
            isAuthorizedtoTake : true,
            challenges : [
                {
                    id : 1,
                    name : 'Level 1',
                    description : 'Level 1',
                    isCompleted : true,
                },
                {
                    id : 2,
                    name : 'Level 2',
                    description : 'Level 2',
                    isCompleted : false,
                },
                {
                    id : 3,
                    name : 'Level 3',
                    description : 'Level 3',
                    isCompleted : false,
                }
            ]
        },
        {
            id : 3,
            name : 'Pattern Painter',
            description : '',
            isAuthorizedtoTake : false,
            challenges : [
                {
                    id : 1,
                    name : 'Level 1',
                    description : 'Level 1',
                    isCompleted : false,
                },
                {
                    id : 2,
                    name : 'Level 2',
                    description : 'Level 2',
                    isCompleted : false,
                },
                {
                    id : 3,
                    name : 'Level 3',
                    description : 'Level 3',
                    isCompleted : false,
                }
            ]
        },
        {
            id : 4,
            name : 'Collect the stars',
            description : '',
            isAuthorizedtoTake : false,
            challenges : [
                {
                    id : 1,
                    name : 'Level 1',
                    description : 'Level 1',
                    isCompleted : false,
                },
                {
                    id : 2,
                    name : 'Level 2',
                    description : 'Level 2',
                    isCompleted : false,
                },
                {
                    id : 3,
                    name : 'Level 3',
                    description : 'Level 3',
                    isCompleted : false,
                }
            ]
        },
        {
            id : 5,
            name : 'Robot Builder',
            description : '',
            isAuthorizedtoTake : false,
            challenges : [
                {
                    id : 1,
                    name : 'Level 1',
                    description : 'Level 1',
                    isCompleted : false,
                },
                {
                    id : 2,
                    name : 'Level 2',
                    description : 'Level 2',
                    isCompleted : false,
                },
                {
                    id : 3,
                    name : 'Level 3',
                    description : 'Level 3',
                    isCompleted : false,
                }
            ]
        }
    ]

    const gameactionMapper = (game_id : number) : () => void  => {
        switch (game_id) {
            case 1:
                return () => setmazeEscapeOpen(prev => !prev);
            case 2:
                return () => settreasureHuntOpen(prev => !prev);
            case 3:
                return () => setpatternPainterOpen(prev => !prev);
            case 4:
                return () => setcollectTheStarsOpen(prev => !prev)
            case 5:
                return () => setrobotBuilderOpen(prev => !prev)
            default:
                return () => {};
        }
    }

    const getgameactionmapper = (game_id : number) : boolean => {
        switch(game_id){
            case 1:
                return mazeEscapeOpen;
            case 2:
                return treasureHuntOpen;
            case 3:
                return patternPainterOpen;
            case 4:
                return collectTheStarsOpen;
            case 5:
                return robotBuilderOpen;
            default:
                return false;
        }
    }

    const computeOverallScore = (game_id : number) : number => {
        const game = games.find(g => g.id === game_id);
        if (!game) return 0;

        const totalChallenges = game.challenges.length;
        const completedChallenges = game.challenges.filter(challenge => challenge.isCompleted).length;

        return (completedChallenges / totalChallenges) * 100;
    }

    const [mazeEscapeOpen , setmazeEscapeOpen] = useState<boolean>(false)
    const [treasureHuntOpen, settreasureHuntOpen] = useState<boolean>(false)
    const [patternPainterOpen, setpatternPainterOpen] = useState<boolean>(false)
    const [collectTheStarsOpen, setcollectTheStarsOpen] = useState<boolean>(false)
    const [robotBuilderOpen, setrobotBuilderOpen] = useState<boolean>(false)


  return (
    <>
      <div className="Blocklyheading">
        <Typography variant="h5" className="title" color="secondary">
          BLOCKLY
        </Typography>
      </div>
      <div className="BlocklyPanels">
        <div className="BlocklyGamesPanel">
          <div className="PanelSubHeading">
            <Typography variant="h6" color={'secondary'}>Challenges Completed</Typography>
            <Divider style={{ width: "90%" }} />
          </div>
          <div className="PanelChannels">
                <List>
                    {games.map((game, index) => (
                        <React.Fragment key={index}>
                            <ListItemButton disabled={!game.isAuthorizedtoTake} onClick={gameactionMapper(game.id)}>
                                <ListItemIcon>
                                    <CircularProgressWithLabel value={computeOverallScore(game.id)} />
                                    {/* <span role="img" aria-label="game-icon">🎮</span> */}
                                </ListItemIcon>
                                <ListItemText primary={game.name} />
                                {getgameactionmapper(game.id) ? <ExpandLess /> : <ExpandMore />}

                            </ListItemButton>
                            <Collapse in={getgameactionmapper(game.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {game.challenges.map((challenge, idx) => (
                                        <ListItemButton key={idx} sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                <ExtensionIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={challenge.name} />
                                            <ListItemIcon>
                                                <ArrowForwardIosIcon fontSize="small" />
                                            </ListItemIcon>
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </List>
          </div>
        </div>
        <div className="BlocklyGamesBoard">
          <div className="PanelSubHeading">
            <Typography variant="h6" color={"secondary"}>Challenge LeaderBoard</Typography>
            <Divider style={{ width: "90%" }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

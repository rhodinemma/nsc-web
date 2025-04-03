"use client";
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  keyframes,
} from "@mui/material";
import {
  ListAlt as ListAltIcon,
  LooksTwo as LooksTwoIcon,
  LooksOne as LooksOneIcon,
  Games,
  Moving,
  Extension,
} from "@mui/icons-material";
import { ProjectData } from "@/app/admin/dashboard/page";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const SummaryCard: React.FC<{
  projects: ProjectData[];
  roundTwoProjects: ProjectData[];
  nonRoundTwoProjects: ProjectData[];
  challengesCount: number;
  challengeLevelsCount: number;
  challengeSubmissionsCount: number;
}> = ({
  projects,
  roundTwoProjects,
  nonRoundTwoProjects,
  challengesCount,
  challengeLevelsCount,
  challengeSubmissionsCount,
}) => {
  //   const theme = useTheme();

  //   const cardData = [
  //     {
  //       title: "All Projects",
  //       count: projects.length,
  //       icon: (
  //         <ListAltIcon
  //           sx={{
  //             fontSize: 50,
  //             color: theme.palette.primary.main,
  //             opacity: 0.7,
  //           }}
  //         />
  //       ),
  //       bgColor: theme.palette.background.default,
  //       textColor: theme.palette.text.primary,
  //     },
  //     {
  //       title: "Round 1 Projects",
  //       count: nonRoundTwoProjects.length,
  //       icon: (
  //         <LooksOneIcon
  //           sx={{
  //             fontSize: 50,
  //             color: theme.palette.secondary.main,
  //             opacity: 0.7,
  //           }}
  //         />
  //       ),
  //       bgColor: theme.palette.background.paper,
  //       textColor: theme.palette.text.secondary,
  //     },
  //     {
  //       title: "Round 2 Projects",
  //       count: roundTwoProjects.length,
  //       icon: (
  //         <LooksTwoIcon
  //           sx={{
  //             fontSize: 50,
  //             color: theme.palette.info.main,
  //             opacity: 0.7,
  //           }}
  //         />
  //       ),
  //       bgColor: theme.palette.action.hover,
  //       textColor: theme.palette.text.primary,
  //     },
  //   ];

  const cardData = [
    {
      title: "All Projects",
      count: projects.length,
      icon: <ListAltIcon sx={{ fontSize: 50, color: "black", opacity: 0.8 }} />,
    },
    {
      title: "Round 1 Projects",
      count: nonRoundTwoProjects.length,
      icon: (
        <LooksOneIcon sx={{ fontSize: 50, color: "black", opacity: 0.8 }} />
      ),
    },
    {
      title: "Round 2 Projects",
      count: roundTwoProjects.length,
      icon: (
        <LooksTwoIcon sx={{ fontSize: 50, color: "black", opacity: 0.8 }} />
      ),
      shadowColor: "rgba(56, 239, 125, 0.4)",
    },
    {
      title: "Challenges",
      count: challengesCount,
      icon: <Games sx={{ fontSize: 50, color: "black", opacity: 0.8 }} />,
    },
    {
      title: "Levels",
      count: challengeLevelsCount,
      icon: <Extension sx={{ fontSize: 50, color: "black", opacity: 0.8 }} />,
    },
    {
      title: "Level Submissions",
      count: challengeSubmissionsCount,
      icon: <Moving sx={{ fontSize: 50, color: "black", opacity: 0.8 }} />,
    },
  ];

  return (
    // <Grid container spacing={2} sx={{ marginBottom: 2 }}>
    //   {cardData.map((card, index) => (
    //     <Grid item xs={12} sm={6} md={4} key={index}>
    //       <Card
    //         sx={{
    //           background: card.bgColor,
    //           transition:
    //             "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    //           "&:hover": {
    //             transform: "translateY(-10px)",
    //             boxShadow: theme.shadows[4],
    //           },
    //           borderRadius: 3,
    //           padding: 1,
    //         }}
    //         elevation={2}
    //       >
    //         <CardContent>
    //           <Box
    //             sx={{
    //               display: "flex",
    //               justifyContent: "space-between",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Box>
    //               <Typography
    //                 variant="h6"
    //                 color="text.secondary"
    //                 sx={{
    //                   fontWeight: 500,
    //                   marginBottom: 1,
    //                 }}
    //               >
    //                 {card.title}
    //               </Typography>
    //               <Typography
    //                 variant="h4"
    //                 sx={{
    //                   color: card.textColor,
    //                   fontWeight: 700,
    //                 }}
    //               >
    //                 {card.count}
    //               </Typography>
    //             </Box>
    //             {card.icon}
    //           </Box>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //   ))}
    // </Grid>

    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              // background: `linear-gradient(45deg, ${card.gradientColors[0]}, ${card.gradientColors[1]})`,
              // backgroundSize: "200% 200%",
              color: "white",
              transition: "all 0.3s ease-in-out",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              animation: `${gradientAnimation} 10s ease infinite`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255,255,255,0.1)",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              },
              "&:hover": {
                transform: "scale(1.05) rotate(2deg)",
                boxShadow: `0 15px 25px ${card.shadowColor}`,
                "&::before": {
                  opacity: 1,
                },
              },
              padding: 1,
            }}
            elevation={4}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 1,
                      color: "black",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#0A1045",
                    }}
                  >
                    {card.count}
                  </Typography>
                </Box>
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCard;

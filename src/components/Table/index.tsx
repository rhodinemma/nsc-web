// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";

// type Participant = {
//   id: number;
//   name: string;
//   email: string;
//   category: string;
// };

// type Props = {
//   participants: Participant[];
// };

// const ParticipantsTable: React.FC<Props> = ({ participants }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table
//         sx={{
//           minWidth: 650,
//           background: "white",
//           border: "1px solid rgba(224, 224, 224, 1)",
//         }}
//         aria-label="participants table"
//       >
//         <TableHead>
//           <TableRow>
//             {["Name", "Email", "Category"].map((header) => (
//               <TableCell
//                 key={header}
//                 sx={{
//                   fontWeight: "bold",
//                   textTransform: "uppercase",
//                   border: "1px solid rgba(224, 224, 224, 1)",
//                 }}
//               >
//                 {header}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {participants.map((participant) => (
//             <TableRow key={participant.id}>
//               <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
//                 {participant.name}
//               </TableCell>
//               <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
//                 {participant.email}
//               </TableCell>
//               <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
//                 {participant.category}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default ParticipantsTable;

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
} from "@mui/material";

type Participant = {
  id: number;
  name: string;
  email: string;
  category: string;
};

type Props = {
  participants: Participant[];
};

const ParticipantsTable: React.FC<Props> = ({ participants }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = participants.filter((participant) =>
    Object.values(participant).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Box sx={{ marginBottom: 2, marginTop: 4 }}>
        <TextField
          label="Search through participants...."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
            border: "1px solid rgba(224, 224, 224, 1)",
          }}
          aria-label="participants table"
        >
          <TableHead>
            <TableRow>
              {["ID", "Name", "Email", "Category"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    border: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParticipants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {participant.id}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {participant.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {participant.email}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                  {participant.category}
                </TableCell>
              </TableRow>
            ))}
            {filteredParticipants.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ParticipantsTable;

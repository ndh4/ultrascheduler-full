import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";

/* Component for collapsible displaying prereqs and coreqs of a course*/
const collapse = (course, open) => (
  <TableRow>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Prerequisites</TableCell>
              <TableCell>Corequisites</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell>{course.prereqs}</TableCell>
            <TableCell>{course.coreqs}</TableCell>
          </TableBody>
        </Table>
      </Collapse>
    </TableCell>
  </TableRow>
);

export default collapse;

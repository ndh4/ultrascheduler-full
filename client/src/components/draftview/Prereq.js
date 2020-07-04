import React from "react";
import { Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";

/* Component for collapsible displaying prereqs and coreqs of a course*/
const collapse = ({ course, open }) => {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table>
                        <TableBody>
                            <TableCell>
                                Prerequisites:{" "}
                                {course.prereqs === ""
                                    ? "None"
                                    : course.prereqs}
                            </TableCell>
                            <TableCell>
                                Corequisites:{" "}
                                {course.coreqs.length === 0
                                    ? "None"
                                    : course.coreqs.join(", ")}
                            </TableCell>
                        </TableBody>
                    </Table>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
export default collapse;

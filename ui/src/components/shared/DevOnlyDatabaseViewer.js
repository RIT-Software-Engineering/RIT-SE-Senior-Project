import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "semantic-ui-react";
import { config } from "../util/constants";

export default function DevOnlyDatabaseViewer() {
    const [databaseData, setDatabaseData] = useState({});

    // const [action_log, setAction_log] = useState();
    // const [actions, setActions] = useState();
    // const [archive, setArchive] = useState();
    // const [projects, setProjects] = useState();
    // const [semester_group, setSemester_group] = useState();
    // const [sponsors, setSponsors] = useState();
    // const [sqlite_sequence, setSqlite_sequence] = useState();
    // const [users, setUsers] = useState();

    useEffect(() => {
        fetch(config.url.BASE_API_URL + "/db/devOnlyGetAllTables")
            .then((response) => response.json())
            .then(async (tables) => {
                // const tablesData = await Promise.all([
                //     tables.map(({ name: tableName }) => {
                //         return fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=${tableName}`);
                //     }),
                // ]);
                const [...tablesData] = await Promise.all([
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=action_log`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=actions`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=archive`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=projects`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=semester_group`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=sponsors`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=sqlite_sequence`),
                    fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=users`),
                ]);

                tables = [
                    "action_log",
                    "actions",
                    "archive",
                    "projects",
                    "semester_group",
                    "sponsors",
                    "sqlite_sequence",
                    "users",
                ];

                const newDatabaseData = {};
                tablesData.forEach((tableData, idx) => {
                    tableData.json().then((tableJson) => {
                        // console.log("tableJson", tableJson);
                        newDatabaseData[tables[idx]] = tableJson;
                    });
                });

                setDatabaseData(newDatabaseData);

                // tablesData.forEach((tableData) => {
                //     console.log("bbbb", tableData);
                //     tableData.then((test) => {
                //         console.log("penis", test);
                //     });
                // });

                // setDatabaseData({ ...tablesData[0] });

                // tables.forEach(({ name: tableName }) => {
                //     fetch(config.url.BASE_API_URL + `/db/devOnlyGetTableData?table=${tableName}`)
                //         .then((response) => response.json())
                //         .then((tableData) => {
                //             newDatabaseData[tableName] = tableData;
                //         })
                //         .catch((error) => {
                //             // TODO: Redirect to failed page or handle errors
                //             console.error(error);
                //         });
                // });
                // // I have no idea how or why this works, but otherwise we have to deal with a race condition so we just gunna pretend it's fine and move on with our lives.
                // setDatabaseData({ ...databaseData, newDatabaseData });
            })
            .catch((error) => {
                // TODO: Redirect to failed page or handle errors
                console.error(error);
            });
    }, []);

    const renderTable = (table) => {
        console.log("table", table);
        return (
            <Table key={table}>
                <TableBody>
                    <TableRow>
                        <TableCell>test</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    };

    console.log("databaseData", databaseData);

    return Object.keys(databaseData).map((table) => {
        return renderTable(table);
    });
}

import React, { useState, Fragment } from "react";
import {
    Modal,
    ModalHeader,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
    ListGroup,
    ListGroupItem,
    ModalBody,
    Button,
    ModalFooter,
} from "reactstrap";
import axios from "axios";
import folderIcon from "../../../icons/folder-black-24dp.svg";
import backIcon from "../../../icons/keyboard_return-black-24dp.svg";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

const root = { id: "/", name: "Content", isDir: true };

const shortenPath = (path) => {
    return path
        .split("/")
        .map((v) => v.substr(0, 4).replace(/ /g, ""))
        .join("");
};

const SelectFile = ({ selectedFile, index, style }) => {
    const [folderChain, setFolderChain] = useState([root]);
    const [currentDIR, setCurrentDIR] = useState(root.id);
    const [fileSelected, setFileSelected] = useState("");
    const [modal, setModal] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const toggle = (e) => {
        setModal(!modal);
    };
    const { isLoading, data: files } = useQuery(
        [`file-${shortenPath(currentDIR)}`, { path: currentDIR }],
        async (key, path) => {
            const { data } = await axios({
                method: "post",
                url: `/api/logs/scan`,
                data: path,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
            });
            return data;
        }
    );
    const fileDown = (e, file) => {
        e.preventDefault();

        if (file.isDir) {
            setFileSelected("");
            setCurrentDIR(file.id);
            setFolderChain([...folderChain, file]);
        } else {
            setFileSelected(file.id);
        }
    };
    const goToFolder = (e, folder) => {
        e.preventDefault();
        setFileSelected("");
        setCurrentDIR(folder.id);
        setFolderChain((value) => {
            return value.splice(0, value.indexOf(folder) + 1);
        });
    };
    const goUp = (e) => {
        if (folderChain.length === 1) {
            e.preventDefault();
        } else {
            goToFolder(e, folderChain[folderChain.length - 2]);
        }
    };
    const selectFile = (e) => {
        selectedFile(fileSelected, index);
        setModal(!modal);
    };
    return (
        <Fragment>
            <Button style={style} onClick={toggle}>
                Select File
            </Button>
            <Modal isOpen={modal} toggle={toggle} autoFocus={false} size="lg">
                <ModalHeader toggle={toggle}>Select File</ModalHeader>
                <ModalBody>
                    <Breadcrumb>
                        <img
                            src={backIcon}
                            alt="goUp"
                            className="link-arrow"
                            onClick={goUp}
                            style={{ paddingRight: "5px" }}
                        />
                        {folderChain.map((folder, i) => {
                            return (
                                <BreadcrumbItem
                                    active={folderChain.length === i + 1}
                                    tag="a"
                                    href="#"
                                    onClick={(e) => {
                                        goToFolder(e, folder);
                                    }}
                                    key={folder.id}
                                >
                                    {folder.name}
                                </BreadcrumbItem>
                            );
                        })}
                    </Breadcrumb>
                    <ListGroup>
                        {!isLoading ? (
                            files.map((file) => {
                                return (
                                    <ListGroupItem
                                        tag={file.isDir ? "a" : "button"}
                                        href="#"
                                        onClick={(e) => fileDown(e, file)}
                                        action={!file.isDir}
                                        active={file.id === fileSelected}
                                        key={file.id}
                                    >
                                        {file.isDir ? (
                                            <img
                                                src={folderIcon}
                                                alt="folder-icon"
                                                style={{
                                                    paddingRight: "5px",
                                                    color: "grey",
                                                }}
                                            />
                                        ) : null}
                                        {file.name}
                                    </ListGroupItem>
                                );
                            })
                        ) : (
                            <Spinner color="primary" />
                        )}
                    </ListGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={fileSelected === ""} onClick={selectFile}>
                        Select File
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default SelectFile;
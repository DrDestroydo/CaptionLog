import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    Container,
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Label,
} from "reactstrap";
import { useSelector } from "react-redux";
import "./scroll.css";
import BackButton from "../BackButton";
const Log = (props) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(false);
    const display = {
        description: "Description:",
        disks: "Disks:",
        length: "Length:",
        genre: "Genre:",
        caption_source: "Caption Source:",
        original_copy_location: "Original Copy Location:",
        video_source: "Video Source:",
        other: "Other: ",
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var config = {
                url: `${process.env.PUBLIC_URL}/api/logs/${props.match.params.id}`,
                method: "get",
            };
            if (loggedIn) {
                config.headers = {
                    "Content-type": "application/json",
                };
                config.headers["x-auth-token"] = token;
            }
            const result = await axios(config);
            console.log(result.data);
            setMovie(Object.keys(result.data.movieInfo).length > 0);
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [props.match.params.id, token, loggedIn]);

    return (
        <div id="scroll">
            <Container className="content">
                {!loading ? (
                    <Fragment>
                        <div className="d-flex align-items-center mb-2">
                            <BackButton className="mr-1" />
                            <h2>
                                {data.title +
                                    (movie ? ` (${data.movieInfo.year})` : "")}
                            </h2>
                        </div>
                        {movie ? (
                            <p>{`Rated ${data.movieInfo.rating}`}</p>
                        ) : (
                            <Fragment />
                        )}
                        <h2>Description</h2>
                        <p>{data.description}</p>
                    </Fragment>
                ) : (
                    <Spinner color="primary" />
                )}
            </Container>
        </div>
    );
};

export default Log;

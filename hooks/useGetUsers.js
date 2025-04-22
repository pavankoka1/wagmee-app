import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";
import React, { useEffect, useState } from "react";

// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

function useGetUsers() {
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = debounce((query) => {
        setLoading(true);
        network
            .get(
                generateQueryParams(API_PATHS.getUsersByParams, {
                    query,
                })
            )
            .then((res) => {
                setUsers(res);
            })
            .catch((err) => {
                // console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, 300);

    useEffect(() => {
        if (searchText) {
            fetchUsers(searchText);
        } else {
            setUsers([]);
        }
    }, [searchText]);

    return {
        searchText,
        setSearchText,
        users,
        loading,
    };
}

export default useGetUsers;

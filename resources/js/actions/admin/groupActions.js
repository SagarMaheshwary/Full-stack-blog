import Axios from "axios";
import { VALIDATION_FAILED } from "../../action-types";
import {
    ADD_GROUP,
    GET_GROUP,
    GET_GROUPS,
    UPDATE_GROUP
} from "../../action-types/admin/groupTypes";

/**
 * @param {number} perPage 
 * @param {string} url 
 */
export const getGroups = (perPage = 10, url = "") => async dispatch => {
    try {
        const response = await Axios.get(url || "/api/admin/groups", {
            params: {
                per_page: perPage
            }
        });

        const {
            prev_page_url,
            next_page_url,
            total,
            data
        } = response.data.groups;

        dispatch({
            type: GET_GROUPS,
            payload: {
                prevPageUrl: prev_page_url || null,
                nextPageUrl: next_page_url || null,
                total: total || 0,
                groups: data || [],
                perPage: perPage
            }
        });
    } catch (err) {
        console.log(err);
    }
};

/**
 * @param {number} id
 * @returns {Promise<boolean>} 
 */
export const getGroup = (id) => async dispatch => {
    try {
        const response = await Axios.get(`/api/admin/groups/${id}`);

        const group = response.data.group;

        dispatch({
            type: GET_GROUP,
            payload: {
                id: group.id || null,
                name: group.name || null,
                description: group.description || null
            }
        })

        return true;
    } catch (err) {
        console.log(err);

        return false;
    }
}

/**
 * @param {string} name 
 * @param {string} description 
 * @returns {Promise<boolean>}
 */
export const addGroup = (name, description) => async dispatch => {
    try {
        const response = await Axios.post("/api/admin/groups", {
            name,
            description
        });

        dispatch({
            type: ADD_GROUP,
            payload: response.data.group || {}
        });

        return true;
    } catch (err) {
        console.log(err);

        const response = err.response;

        if (response && response.status === 422) {
            dispatch({
                type: VALIDATION_FAILED,
                payload: {
                    name: response.data.errors.name || [],
                    description: response.data.errors.description || []
                }
            });
        }

        return false;
    }
};

/**
 * @param {number} id 
 * @param {string} name 
 * @param {string} description
 * @returns {Promise<boolean>} 
 */
export const updateGroup = (id, name, description) => async dispatch => {
    try {
        const response = await Axios.put(`/api/admin/groups/${id}`, {
            name,
            description
        });

        dispatch({
            type: UPDATE_GROUP,
            payload: response.data.group || {}
        })

        return true;
    } catch (err) {
        console.log(err)
        const response = err.response;

        if (response && response.status === 422) {
            dispatch({
                type: VALIDATION_FAILED,
                payload: {
                    name: response.data.errors.name || [],
                    description: response.data.errors.description || []
                }
            })
        }

        return false;
    }
}
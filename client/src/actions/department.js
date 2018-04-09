import axios from 'axios';
import { API_URL } from './urls';

const MANAGEMENT_API = `${API_URL}/management`;
const DEPARMENT_API = `${MANAGEMENT_API}/department`;

export const FETCH_DEPARTMENTS = "Fetch all deparments"

export function fetchDepartments() {
    return  {
        type: FETCH_DEPARTMENTS,
        payload: axios.get(DEPARMENT_API)
    }
}
import axios from 'axios';
import { API_URL } from './urls';

export const FETCH_TEAMS = 'fetch team infos';

const TEAM_API = `${API_URL}/team`;

export function fetchTeam() {
  return {
    type: FETCH_TEAMS,
    payload: axios.get(TEAM_API)
  }
}


import {generateSimpleMutations} from "../../../src/app-store/utils/generators";
import initialState from "./stateLogin";


const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;

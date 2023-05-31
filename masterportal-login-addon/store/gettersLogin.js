import stateMap from "./stateLogin";
import {generateSimpleGetters} from "../../../src/app-store/utils/generators";

const gettersMap = {
    ...generateSimpleGetters(stateMap),

    /**
     * checks if the login is configured by config.js and thereby ready to go
     * @returns {Boolean} true if login buttons should be visible, false if not
     */
    isSet () {
        return typeof Config === "object" && Config !== null && (
            Config.login === true ||
            typeof Config.login === "object" && Config.login !== null
        );
    }
};

export default gettersMap;

import store from "jfs";

const db = new store("data");

export const saveLastActivityDate = (date) => {
    db.saveSync("lastActivity", date);
}

export const getLastActivityDate = () => {
    const date = db.getSync("lastActivity");
    return date;
    //return '2020-11-25 12:12:33.333';   
}
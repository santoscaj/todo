/**
 * Default non-admin users have password 1234
 * Default admin users have password admin
 */

const users = [
    {userData:{
        username: "santoscaj",
        email: "santoscaj@yahoo.com",
        password: "$2b$05$K4gfqQFpfEugiH.vQBOp7uTkyvB4AYZhMh8Ydw2wakB5cspXhi60O",
        is_admin: false,
        firstName: "",
        lastName: "",
        image_link: "https://i1.sndcdn.com/avatars-000105344650-iuxeec-t500x500.jpg"
    },todoList:
        [{
            title: "house", 
            content: "wash the car\ngo shopping\nmake my bed"},   
        {
            title: "fruits", 
            content: "banana\napple\ngrapes\npears\navocado"
        }]
    },{
    userData:{
        username: "cuzox",
        email: "cuzox@yahoo.com",
        password: "$2b$05$K4gfqQFpfEugiH.vQBOp7uTkyvB4AYZhMh8Ydw2wakB5cspXhi60O",
        is_admin: false,
        firstName: "",
        lastName: "",
        image_link: "https://i1.sndcdn.com/avatars-000105344650-iuxeec-t500x500.jpg"
    },todoList:[
        {
            title: "numbers", 
            content: "one\ntwo\nthree\nfour\nfive"
        },{
            title: "family members",
            content:"mom\ndad\nbrother\nsister"
        }
    ]},
    {
    userData:{
        username: "myadmin",
        email: "admin@admin.com",
        password: "admin",
        is_admin: true,
        firstName: "",
        lastName: "",
        image_link:"$2b$05$boJXqB9QXp.QKx.7qrTo0.zQViQbKznUPVkMuLJrQb5NY7f3DWK1G"
    },todoList:[
        {
            title: "fruits", 
            content: "banana\napple\ngrapes\npears\navocado"
        },{
            title: "car brands", 
            content: "tesla\nhonda\ntoyota\nmercedes"
        }]
    },
]

module.exports = { users }
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
        account_is_active: true,
        firstName: "",
        lastName: "",
        image_link: "https://img.buzzfeed.com/buzzfeed-static/static/2018-02/6/16/asset/buzzfeed-prod-fastlane-03/sub-buzz-18967-1517953069-1.png?downsize=700%3A%2A&output-quality=auto&output-format=auto&output-quality=auto&output-format=auto&downsize=360:*",
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
        email: "calevime@gmail.com",
        password: "$2b$05$K4gfqQFpfEugiH.vQBOp7uTkyvB4AYZhMh8Ydw2wakB5cspXhi60O",
        is_admin: false,
        account_is_active: true,
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
        username: "admin",
        email: "santoscaj@gmail.com",
        password: "$2b$05$boJXqB9QXp.QKx.7qrTo0.zQViQbKznUPVkMuLJrQb5NY7f3DWK1G",
        is_admin: true,
        account_is_active: true,
        firstName: "",
        lastName: "",
        image_link:"https://idata.over-blog.com/4/01/90/05/Link-Cartoon/character-link-1-.png"
    },todoList:[
        {
            title: "fruits", 
            content: "banana\napple\ngrapes\npears\navocado"
        },{
            title: "car brands", 
            content: "tesla\nhonda\ntoyota\nmercedes"
        }]
    },
    {
        userData:{
            username: "randomguy",
            email: "ajsc_thebest@hotmail.com",
            password: "$2b$05$K4gfqQFpfEugiH.vQBOp7uTkyvB4AYZhMh8Ydw2wakB5cspXhi60O",
            is_admin: false,
            account_is_active: false,
            firstName: "The Cable",
            lastName: "Guy",
            image_link:""
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
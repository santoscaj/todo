const users = [
    {userData:{
        username: "santoscaj",
        email: "santoscaj@yahoo.com",
        password: "1234",
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
        password: "0123",
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
        username: "admin",
        email: "admin@admin.com",
        password: "admin",
        is_admin: true,
        firstName: "",
        lastName: "",
        image_link:"https://avatars3.githubusercontent.com/u/45974053?s=460&v=4"
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
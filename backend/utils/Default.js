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
    },todoLists:
        [{
            name: "house", 
            todoItems:[
                {content: 'wash the car', completion: false},
                {content: 'go shopping', completion: false},
                {content: 'make my bed', completion: true},
            ]
        },   
        {
            name: "fruits to buy", 
            todoItems:[
                {content: 'banana', completion: true},
                {content: 'apple', completion: false},
                {content: 'grapes', completion: true},
                {content: 'pears', completion: true},
                {content: 'avocado', completion: true},
            ]
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
    },todoLists:[
        {
            name: "numbers", 
            todoItems:[
                {content: 'one', completion: false},
                {content: 'two', completion: false},
                {content: 'three', completion: true},
                {content: 'four', completion: true},
                {content: 'five', completion: true},
            ]
            // content: "one\ntwo\nthree\nfour\nfive"
        },{
            name: "family members",
            todoItems:[
                {content: 'mom', completion: false},
                {content: 'dad', completion: false},
                {content: 'brother', completion: false},
                {content: 'sister', completion: false},
            ]
            // content:"mom\ndad\nbrother\nsister"
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
    },todoLists:[
        {
            name: "fruits", 
            todoItems:[
                {content: 'watermelon', completion: false},
                {content: 'orange', completion: false},
                {content: 'strawberry', completion: false},
                {content: 'blueberries', completion: false},
                {content: 'grape', completion: false},
                {content: 'lemon', completion: false},
                {content: 'kiwi', completion: false},
                {content: 'raspberry', completion: false},
                {content: 'passion fruit', completion: false},
                {content: 'grapefruit', completion: false},
                {content: 'peach', completion: false},
                {content: 'lime', completion: false},
                {content: 'cherry', completion: false},
                {content: 'banana', completion: false},
                {content: 'pineapple', completion: false},
                {content: 'apple', completion: false},
                {content: 'avocado', completion: false},
                {content: 'pomegranate', completion: false},
                {content: 'mango', completion: false},
                {content: 'pear', completion: false},
                {content: 'caramola', completion: false},
            ]
            // content: "banana\napple\ngrapes\npears\navocado"
        },{
            name: "car brands", 
            todoItems:[
                {content: 'Tesla', completion: false},
                {content: 'Toyota', completion: false},
                {content: 'Honda', completion: false},
                {content: 'Chevrolet', completion: false},
                {content: 'Ford', completion: false},
                {content: 'Mercedes-Benz', completion: false},
                {content: 'Jeep', completion: false},
                {content: 'BMW', completion: false},
                {content: 'Porsche', completion: false},
                {content: 'Subaru', completion: false},
                {content: 'Nissan', completion: false},
                {content: 'Cadillac', completion: false},
                {content: 'Volkswagen', completion: false},
                {content: 'Lexus', completion: false},
                {content: 'Audi', completion: false},
                {content: 'Ferrari', completion: false},
                {content: 'Volvo', completion: false},
                {content: 'Jaguar', completion: false},
                {content: 'GMC', completion: false},
                {content: 'Buick', completion: false},
                {content: 'Acura', completion: false},
                {content: 'Bentley', completion: false},
                {content: 'Dodge', completion: false},
                {content: 'Hyundai', completion: false},
                {content: 'Lincoln', completion: false},
                {content: 'Mazda', completion: false},
                {content: 'Land Rover', completion: false},
                {content: 'Kia', completion: false},
                {content: 'Chrysler', completion: false},
                {content: 'Pontiac', completion: false},
                {content: 'Infiniti', completion: false},
                {content: 'Mitsubishi', completion: false},
                {content: 'Maserati', completion: false},
                {content: 'Aston Martin', completion: false},
                {content: 'Bugatti', completion: false},
                {content: 'Fiat', completion: false},
                {content: 'Mini', completion: false},
                {content: 'Alfa Romeo', completion: false},
                {content: 'Suzuki', completion: false},
                {content: 'Renault', completion: false},
                {content: 'Peugeot', completion: false},
            ]
            // content: "tesla\nhonda\ntoyota\nmercedes"
        }]
    },
    {
        userData:{
            username: "james",
            email: "santosc.aj@gmail.com",
            password: "$2b$05$K4gfqQFpfEugiH.vQBOp7uTkyvB4AYZhMh8Ydw2wakB5cspXhi60O",
            is_admin: false,
            account_is_active: false,
            firstName: "The Cable",
            lastName: "Guy",
            image_link:""
        },todoLists:[
            {
                name: "fruits", 
                todoItems:[
                    {content: 'banana', completion: false},
                    {content: 'apple', completion: false},
                    {content: 'grapes', completion: true},
                    {content: 'pears', completion: true},
                    {content: 'avocado', completion: true},
                ]
                // content: "banana\napple\ngrapes\npears\navocado"
            },{
                name: "car brands", 
                todoItems:[
                    {content: 'banana', completion: false},
                    {content: 'apple', completion: false},
                    {content: 'grapes', completion: true},
                    {content: 'pears', completion: true},
                    {content: 'avocado', completion: true},
                ]
                // content: "tesla\nhonda\ntoyota\nmercedes"
            }]
        },
]

module.exports = { users }
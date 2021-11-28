/**
 * Default non-admin users have password 1234
 * Default admin users have password admin
 */

const users = [
    {userData:{
        username: "alberto",
        email: "guest@santoscaj.com",
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
                {content: 'wash the car', completed: false},
                {content: 'go shopping', completed: false},
                {content: 'make my bed', completed: true},
            ]
        },   
        {
            name: "fruits to buy", 
            todoItems:[
                {content: 'banana', completed: true},
                {content: 'apple', completed: false},
                {content: 'grapes', completed: true},
                {content: 'pears', completed: true},
                {content: 'avocado', completed: true},
            ]
        }]
    },{
    userData:{
        username: "user1",
        email: "user1@santosaj.com",
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
                {content: 'one', completed: false},
                {content: 'two', completed: false},
                {content: 'three', completed: true},
                {content: 'four', completed: true},
                {content: 'five', completed: true},
            ]
            // content: "one\ntwo\nthree\nfour\nfive"
        },{
            name: "family members",
            todoItems:[
                {content: 'mom', completed: false},
                {content: 'dad', completed: false},
                {content: 'brother', completed: false},
                {content: 'sister', completed: false},
            ]
            // content:"mom\ndad\nbrother\nsister"
        }
    ]},
    {
    userData:{
        username: "admin",
        email: "admin@santosaj.com",
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
                {content: 'watermelon', completed: false},
                {content: 'orange', completed: false},
                {content: 'strawberry', completed: false},
                {content: 'blueberries', completed: false},
                {content: 'grape', completed: false},
                {content: 'lemon', completed: false},
                {content: 'kiwi', completed: false},
                {content: 'raspberry', completed: false},
                {content: 'passion fruit', completed: false},
                {content: 'grapefruit', completed: false},
                {content: 'peach', completed: false},
                {content: 'lime', completed: false},
                {content: 'cherry', completed: false},
                {content: 'banana', completed: false},
                {content: 'pineapple', completed: false},
                {content: 'apple', completed: false},
                {content: 'avocado', completed: false},
                {content: 'pomegranate', completed: false},
                {content: 'mango', completed: false},
                {content: 'pear', completed: false},
                {content: 'carambola', completed: false},
            ]
            // content: "banana\napple\ngrapes\npears\navocado"
        },{
            name: "car brands", 
            todoItems:[
                {content: 'Tesla', completed: false},
                {content: 'Toyota', completed: false},
                {content: 'Honda', completed: false},
                {content: 'Chevrolet', completed: false},
                {content: 'Ford', completed: false},
                {content: 'Mercedes-Benz', completed: false},
                {content: 'Jeep', completed: false},
                {content: 'BMW', completed: false},
                {content: 'Porsche', completed: false},
                {content: 'Subaru', completed: false},
                {content: 'Nissan', completed: false},
                {content: 'Cadillac', completed: false},
                {content: 'Volkswagen', completed: false},
                {content: 'Lexus', completed: false},
                {content: 'Audi', completed: false},
                {content: 'Ferrari', completed: false},
                {content: 'Volvo', completed: false},
                {content: 'Jaguar', completed: false},
                {content: 'GMC', completed: false},
                {content: 'Buick', completed: false},
                {content: 'Acura', completed: false},
                {content: 'Bentley', completed: false},
                {content: 'Dodge', completed: false},
                {content: 'Hyundai', completed: false},
                {content: 'Lincoln', completed: false},
                {content: 'Mazda', completed: false},
                {content: 'Land Rover', completed: false},
                {content: 'Kia', completed: false},
                {content: 'Chrysler', completed: false},
                {content: 'Pontiac', completed: false},
                {content: 'Infiniti', completed: false},
                {content: 'Mitsubishi', completed: false},
                {content: 'Maserati', completed: false},
                {content: 'Aston Martin', completed: false},
                {content: 'Bugatti', completed: false},
                {content: 'Fiat', completed: false},
                {content: 'Mini', completed: false},
                {content: 'Alfa Romeo', completed: false},
                {content: 'Suzuki', completed: false},
                {content: 'Renault', completed: false},
                {content: 'Peugeot', completed: false},
            ]
            // content: "tesla\nhonda\ntoyota\nmercedes"
        }]
    },
    {
        userData:{
            username: "user2",
            email: "user2@santosaj.com",
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
                    {content: 'banana', completed: false},
                    {content: 'apple', completed: false},
                    {content: 'grapes', completed: true},
                    {content: 'pears', completed: true},
                    {content: 'avocado', completed: true},
                ]
                // content: "banana\napple\ngrapes\npears\navocado"
            },{
                name: "car brands", 
                todoItems:[
                    {content: 'banana', completed: false},
                    {content: 'apple', completed: false},
                    {content: 'grapes', completed: true},
                    {content: 'pears', completed: true},
                    {content: 'avocado', completed: true},
                ]
                // content: "tesla\nhonda\ntoyota\nmercedes"
            }]
        },
]

module.exports = { users }
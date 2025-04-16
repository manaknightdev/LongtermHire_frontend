export const config =
{
    options: {
        use_google_login: true,
        use_facebook_login: true,
        nav: "horizontal", //horizontal|vertical
        use_2fa: true,
        use_ssr: true,
        use_captcha: true,
    },
    pages: [
        {
            type: "add", // list|view|edit|add|custom
            role: "admin",
            model: "user",
            route: "admin/add-user",
            columns: [
                { "name": "email", type: "string", "mapping": {}, "rules": {} },
                { "name": "f_name", type: "string", "mapping": {}, "rules": {} },
                { "name": "l_name", type: "string", "mapping": {}, "rules": {} },
                { "name": "password", type: "string", "mapping": {}, "rules": {} }
            ],

        },
        {
            type: "edit", // list|view|edit|add|custom
            role: "admin",
            model: "user",
            route: "admin/edit-user/:id",
            columns: [
                { "name": "email", type: "string", "mapping": {}, "rules": {} },
                { "name": "f_name", type: "select", "mapping": {}, "rules": {}, populate: "user" },
                { "name": "l_name", type: "string", "mapping": {}, "rules": {} },
                { "name": "password", type: "string", "mapping": {}, "rules": {} }
            ],

        },
        {
            type: "view", // list|view|edit|add|custom
            role: "admin",
            model: "user",
            route: "admin/view-user/:id",
            columns: [
                { "name": "email", type: "string", "mapping": {} },
                { "name": "user_id", type: "select", "mapping": {}, join: {model: "", column: ""} },
                { "name": "l_name", type: "string", "mapping": {} },
                { "name": "password", type: "string", "mapping": {}, "rules": {} }

            ],

        },
        {
            type: "list", // list|view|edit|add|custom
            role: "admin",
            model: "user",
            route: "admin/user",
            columns: [
                { "name": "email", type: "string", "mapping": {}, is_filter: true },
                { "name": "user_id", type: "select", "mapping": {}, join: "user|name" },
                { "name": "l_name", type: "string", "mapping": {} },
                { "name": "password", type: "string", "mapping": {}, "rules": {} }
            ],

        },
        {
            type: "custom", // list|view|edit|add|custom
            role: "public", //admin|nanny|customer|public
            model: "user",
            title: "About",
            route: "/about",
            components: [
                {
                    id: 9890, //Add button,
                    name: "AddButton",
                    props: {
                        model: "",
                        role: ""
                    }
                },
                {
                    id: 98098,
                }
            ]


        },

    ]
}





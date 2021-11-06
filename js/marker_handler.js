var table_number = null
AFRAME.registerComponent('marker_handler', {
    init: async function () {
        if (table_number === null) {
            console.error("Why the frick did you now give your table number. ENTER IT NOW or we will sself desrtruct in 5 4 3 2 1 KABOOM!")
            this.ask_tabel_number();
            console.log("Thank you for your cooperation. next time I hope i do not have to threaten you.");
        }

        var dishes = await this.get_dishes();

        this.el.addEventListener("markerFound", () => {
            console.info("Marker is found")
            if (table_number !== null) {
                console.log("YAY U entered the tabel number good job now we can give you food and u can give us money. WIN WIN WOOO HOO. But your wallet and bank account lose very badly");
                var marker_id = this.el.id;
                this.handle_marker_found(dishes, marker_id);
            }

        });

        this.el.addEventListener("markerLost", () => {
            console.error("Marker is lost")
            this.handle_marker_lost()
        });
    },
    ask_tabel_number: function () {
        var icon_url = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
            title: "Biryani City",
            icon: icon_url,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Table Number",
                    type: "number",
                    min: 1
                }
            },
            closeOnClickOutside: false,
        }).then(input_value => {
            table_number = input_value;
        })
    },
    handle_marker_found: function (dishes, marker_id) {
        // get todays date
        var date = new Date();
        var day = date.getDay();
        var days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];

        var dish = dishes.filter(dish => dish.id === marker_id);

        if (dish.unavailable_days.includes(days[day])) {
            swal({
                icon: "warning",
                title: dish.dish_name.toUpperCase(),
                text: "This dish is not available today",
                timer: 2500,
                buttons: false
            });
        } else {
            var model = document.querySelector(`#model-${dish.id}`)
            model.setAttribute("position", dish.model_geometry.position)
            model.setAttribute("rotation", dish.model_geometry.rotation)
            model.setAttribute("scale", dish.model_geometry.scale)
            model.setAttribute("visible", true);

            var ingredients_container = document.querySelector(`#main-plane-${dish.id}`);
            ingredients_container.setAttribute("visible", true);

            var price_plane = document.querySelector(`#price-plane-${dish.id}`);
            price_plane.setAttribute("visible", true);

            var button_div = document.getElementById("button-div");
            button_div.style.display = "flex";

            var rating_button = document.getElementById("rating-button");
            var order_button = document.getElementById("order-button");

            if (table_number !== null) {
                rating_button.addEventListener("click", () => {
                    swal({
                        icon: "warning",
                        title: "Rate Dish",
                        text: "Work in Progress"
                    });
                });

                order_button.addEventListener("click", () => {
                    var t_number;
                    table_number <= 9 ? (t_number = `T0${table_number}`) : `T${table_number}`;
                    this.handle_order(t_number, dish)

                    swal({
                        icon: "../assets/thumb-up.png",
                        title: "Thanks for Order!",
                        text: "Your order will be delivered soon"
                    });
                });
            }
        }
    },
    get_dishes: async function () {
        return await firebase.firestore()
            .collection("dishes")
            .get()
            .then(snap => {
                return snap.docs.map(doc => doc.data());
            });
    },
    handle_marker_lost: function () {
        var button_div = document.getElementById("button-div");
        button_div.style.display = "none";
    }
});

AFRAME.registerComponent('create_markers', {
    init: async function () {
        var main_scene = document.querySelector("#main-scene")

        var dishes = await this.get_dishes()
        dishes.map(dish => {
            // marker element
            var marker = document.createElement("a-marker");
            marker.setAttribute("id", dish.id);
            marker.setAttribute("type", "pattern")
            marker.setAttribute("url", dish.marker_pattern_url)
            marker.setAttribute("cursor", {
                rayOrigin: "mouse"
            });
            marker.setAttribute("marker_handler", {});
            main_scene.appendChild(marker);

            // get todays date
            var todays_date = new Date();
            var todays_day = todays_date.getDay();
            var days = [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ];

            if (!dish.unavailable_days.includes(days[todays_day])) {
                // adding 3d models to scene
                var model = document.createElement("a-entity");
                model.setAttribute("id", `model-${dish.id}`);
                model.setAttribute("position", dish.model_geometry.position);
                model.setAttribute("rotation", dish.model_geometry.rotation);
                model.setAttribute("scale", dish.model_geometry.scale);
                model.setAttribute("glft-model", `url(${dish.model_url})`);
                model.setAttribute("gesture_handler", {});
                marker.appendChild(model);

                // Ingredients Container
                var main_plane = document.createElement("a-plane");
                main_plane.setAttribute("id", `main-plane-${dish.id}`);
                main_plane.setAttribute("position", { x: 0, y: 0, z: 0 });
                main_plane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
                main_plane.setAttribute("width", 1.7);
                main_plane.setAttribute("height", 1.5);
                marker.appendChild(main_plane);

                // Dish title background plane
                var title_plane = document.createElement("a-plane");
                title_plane.setAttribute("id", `title-plane-${dish.id}`);
                title_plane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
                title_plane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                title_plane.setAttribute("width", 1.69);
                title_plane.setAttribute("height", 0.3);
                title_plane.setAttribute("material", { color: "#F0C30F" });
                main_plane.appendChild(title_plane);

                // Dish title
                var dish_title = document.createElement("a-entity");
                dish_title.setAttribute("id", `dish-title-${dish.id}`);
                dish_title.setAttribute("position", { x: 0, y: 0, z: 0.1 });
                dish_title.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                dish_title.setAttribute("text", {
                    font: "monoid",
                    color: "black",
                    width: 1.8,
                    height: 1,
                    align: "center",
                    value: dish.dish_name.toUpperCase()
                });
                title_plane.appendChild(dish_title);

                // Ingredients List
                var ingredients = document.createElement("a-entity");
                ingredients.setAttribute("id", `ingredients-${dish.id}`);
                ingredients.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
                ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                ingredients.setAttribute("text", {
                    font: "monoid",
                    color: "black",
                    width: 2,
                    align: "left",
                    value: `${dish.ingredients.join("\n\n")}`
                });
                main_plane.appendChild(ingredients);

                var price_plane = document.createElement("a-image");
                price_plane.setAttribute("id", `price-plane-${dish.id}`);
                price_plane.setAttribute("src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png")
                price_plane.setAttribute("width", 0.8);
                price_plane.setAttribute("height", 0.8);
                price_plane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
                price_plane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
                price_plane.setAttribute("visible", true);

                var price = document.createElement("a-entity");
                price.setAttribute("id", `price-${dish.id}`);
                price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
                price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                price.setAttribute("text", {
                    font: "mozillavr",
                    color: "white",
                    width: 3,
                    align: "center",
                    value: `Only\n $${dish.price}`
                });
                price_plane.appendChild(price);

                marker.appendChild(price_plane);
            }
        });

    },
    get_dishes: async function () {
        return await firebase.firestore()
            .collection("dishes")
            .get()
            .then(snap => {
                return snap.docs.map(doc => doc.data());
            });
    }
});

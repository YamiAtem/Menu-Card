AFRAME.registerComponent('marker_handler', {
    init: async function () {
        this.el.addEventListener("markerFound", () => {
            console.info("Marker is found")
            this.handle_marker_found()
        });

        this.el.addEventListener("markerLost", () => {
            console.error("Marker is lost")
            this.handle_marker_lost()
        });
    },
    handle_marker_found: function () {
        var button_div = document.getElementById("button-div");
        button_div.style.display = "flex";

        var rating_button = document.getElementById("rating-button");
        var order_button = document.getElementById("order-button");

        rating_button.addEventListener("click", () => {
            swal({
                icon: "warning",
                title: "Rate Dish",
                text: "Work in Progress"
            });
        });

        order_button.addEventListener("click", () => {
            swal({
                icon: "../assets/thumb-up.png",
                title: "Thanks for Order!",
                text: "Your order will be delivered soon"
            });
        });
    },
    handle_marker_lost: function () {
        var button_div = document.getElementById("button-div");
        button_div.style.display = "none";
    }
});

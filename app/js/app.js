$(document).ready(function () {
        document.getElementById("burger").onclick = function () {
            open()
        };

        function open() {
            document.getElementById("menu").classList.toggle("show");
            document.getElementById("burger").classList.toggle("show_burger");
        }
})


import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  iconfont: "fa",
  theme: {
    primary: "#5e72e4",
    secondary: "#f6f7f8",
    warning: "#fc7c5f",
    success: "#4fd69c",
    info: "#37d5f2",
    error: "#f75676",
  },
});

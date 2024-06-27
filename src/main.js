import { createRouter, createWebHashHistory } from "vue-router";
import { createApp } from 'vue'
import App from './App.vue'
import AuthView from "./views/AuthView.vue";
import HomeView from "./views/HomeView.vue";
import StudentView from "./views/StudentView.vue";
import './assets/style.css';


const routes = [
    {
        path: "/auth",
        component: AuthView
    },

    {
        path: "/",
        component: HomeView
    },

    {
        path: "/students",
        component: StudentView
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from) => {
    if(to.path === "/auth" || to.path === "/"){
            return true;
    }else if(to.path === "/students" && from.path === "/auth"){
        const hasPermission = sessionStorage.getItem("hasPermission");
        if (hasPermission){
            return true
        }else{
            return false
        }
    }else{return false;}
});



createApp(App).use(router).mount("#app");


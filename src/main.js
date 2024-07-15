import { createRouter, createWebHashHistory } from "vue-router";
import { createApp } from 'vue'
import App from './App.vue'
import AuthView from "./views/AuthView.vue";
import HomeView from "./views/HomeView.vue";
import StudentView from "./views/StudentView.vue";
import AdminView from "./views/AdminView.vue";
import './assets/style.css';


const routes = [
    {
        path: "/",
        component: HomeView
    },
    
    {
        path: "/auth",
        component: AuthView
    },

    {
        path: "/admin",
        component: AdminView
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
    const studentPermission = sessionStorage.getItem("studentPermission");
    const adminPermission = sessionStorage.getItem("adminPermission");

    if(to.path === "/auth" || to.path === "/"){
            return true;
    }else if(studentPermission && to.path === "/students" || adminPermission && to.path === "/admin"){ 
        return true;

    }else{
        return false;
    }
});



createApp(App).use(router).mount("#app");


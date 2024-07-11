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

// router.beforeEach((to, from) => {
//     if(to.path === "/auth" || to.path === "/" || to.path === "/admin"){
//             return true;
//     }else if(to.path === "/students"){ 
//         const hasPermission = sessionStorage.getItem("hasPermission");
//         alert("has permission?" + hasPermission)
//         if (hasPermission){
//             return true
//         }else{
//             return false
//         }
//     }else{return false;}
// });



createApp(App).use(router).mount("#app");


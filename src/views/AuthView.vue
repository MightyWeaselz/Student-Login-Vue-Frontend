<template>
      <header class="header">
        <div class="banner">
            Student Web App
        </div>
    </header>

    <div class ="auth-form">
        <div class = "tabs">
            <ul>
                <li :class="{'is-active': register}"> <button @click.prevent= "registerTrue" >Register</button></li>
                <li :class="{'is-active': !register}"> <button @click.prevent= "registerFalse" >Login</button></li>
            </ul>
        </div>
    </div>

    <div class="flex justify-center items-center my-8">
      <label class="text-2xl font-bold" v-if="!warn">{{ loading }}</label>
      <label class="text-2xl font-bold text-red-500" v-if="warn">{{ warn }}</label>
    </div>

    <form @submit.prevent="onSubmit">
        <div class="card-auth-form">
            <div class="card-content">
                <div class="title">{{ formTitle }}</div>

                <div class="field" v-if="register">
                    <label class="label">First Name</label>
                    <div class="control">
                        <input class="input" type="name" placeholder="FirstName" v-model="credentials.firstName">
                    </div>
                </div>

                <div class="field" v-if="register">
                    <label class="label">Last Name</label>
                    <div class="control">
                        <input class="input" type="name" placeholder="LastName" v-model="credentials.lastName">
                    </div>
                </div>

                <div class="field" v-if="register">
                    <label class="label">Birth Date</label>
                    <div class="control">
                        <input class="tinyInput" type="year" placeholder="year" v-model="credentials.year">
                        <input class="tinyInput" type="month" placeholder="month" v-model="credentials.month">
                        <input class="tinyInput" type="day" placeholder="day" v-model="credentials.day">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="email" placeholder="Email Adress" v-model="credentials.email">
                    </div>
                </div>


                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input" type="password" placeholder="Enter Password" v-model="credentials.passwort">
                    </div>
                </div>
                

                <div class="field" v-if="register">
                    <label class="label">Reapeat Password</label>
                    <div class="control">
                        <input class="input" type="password" placeholder="Repeat Password" v-model="credentials.rep_passwort">
                    </div>
                </div>

                <div class="control">
                    <button class="button">{{formTitle}}</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
    import {ref, reactive, computed, watch, inject} from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';

    const warn = ref(null);
    const register = ref(false);
    const router = useRouter()
    const loading = ref(null);

  
    const baseUrl = inject('baseUrl');
    const token = inject('token')
    const headerConfig = inject('headerConfig')

    const credentials = reactive({
        firstName: "",
        lastName: "",
        email: "",
        month:"",
        day:"",
        year:"",
        passwort: "",
        rep_passwort: ""
    });

    const formTitle = computed(() =>{
      return register.value ? 'Register' : 'Login';
    });

    const registerTrue = () =>{
      loading.value = null;
      register.value = true;
      warn.value = null;
    }

    const registerFalse= () =>{
      loading.value = null;
      register.value = false;
      warn.value = null;
    }

    // watch(() => token.value ,(value) => {
    //   headerConfig.headers.Authorization = `Bearer ${value}`
    // });

    const fetchStudent = async () => {
      await axios.get(`${baseUrl}/student`, headerConfig)
        .then(function (response){  
          console.log('Erfolgreich Daten abgerufen', JSON.stringify(response.data));
          localStorage.setItem('studentsJSON', JSON.stringify(response.data));
        }).catch(function (error){
          if(error.response){
              if(error.response.status === 400){
                warn.value = "Fehler beim Senden der Anfrage bitte gebe die daten richtig ein";
              }else if(error.response.status === 401 && warn.value == null){
                warn.value = "Session ausgelaufen, bitte melde dich erneut an, oder registriere dich erst!"
                console.log(error);
              }else{
                console.log(error);
              }
          }
        })
    }

    const registerRequest = async () =>{

      await axios.post(`${baseUrl}/auth/register`, {
        firstname: credentials.firstName,
        lastname: credentials.lastName,
        email: credentials.email,
        password: credentials.passwort,
        dob: credentials.year + '-' + credentials.month + '-' + credentials.day

      }).then(function (response){
        console.log('Erfolgreich gesendet:', response.data);
        register.value = !register;
        loading.value = "Erfolgreich registriert! Jetzt melde dich bitte mit deinen Daten an";

      }).catch(function (error) {
          if(error.response){
              
            if(error.response.status === 400){
              warn.value = "Fehler beim Senden der Anfrage bitte gebe die daten richtig ein";
            }else{
              warn.value = "Genereller Server fehler"
            }
          }else if(error.request){
            warn.value = "Server nicht erreichbar"
            console.error('Server nicht erreichbar', error);
          }
      });
    }

    const loginRequest = async () => {
      // alert(baseUrl);
      await axios.post(`${baseUrl}/auth/authenticate`, {
        email: credentials.email,
        password: credentials.passwort
      })
        .then(function (response){
          alert(JSON.stringify(response.data));
          token.value = response.data.token;
          sessionStorage.setItem("JWT-Token", response.data.token);
          sessionStorage.setItem("user", response.data.firstname);
          sessionStorage.setItem("email", response.data.email);
          sessionStorage.setItem("role", response.data.role);
          console.log('Erfolgreich angemeldet!', response.data);

        }).catch(error => {
          if(error.response){
              if(error.response.status === 400){
                warn.value = "Fehler beim Senden der Anfrage bitte gebe die daten richtig ein";
              }else if (error.response.status === 401){
                warn.value = "Du bist nicht authorisiert, gebe die richtigen Anmeldedaten ein oder Registriere dich"
              }else{
                warn.value = "Es ist ein Fehler unterlaufen (Server könnte probleme haben)"
              }
            }else if(error.request){
              warn.value = "Server nicht erreichbar"
              console.error('Server nicht erreichbar', error);
            }
        })
    }

  const onSubmit = async () => {
        warn.value = null;

        if (credentials.day.length == 1){
          credentials.day = "0" + credentials.day
        }

        if (credentials.month.length == 1){
          credentials.month = "0" + credentials.month
        }

        if(!register.value && (!credentials.email || !credentials.passwort)){
            alert('Please enter email or password')
            return;
        }

        if(register.value && (!credentials.firstName || 
                              !credentials.lastName ||
                              !credentials.rep_passwort || 
                              !credentials.email || 
                              !credentials.passwort || 
                              !credentials.year ||
                              !credentials.month||
                              !credentials.day)){
            loading.value = "Please enter full credentials!"
            return;
        }
        
        if(register.value && credentials.passwort != credentials.rep_passwort){
            loading.value = "Passwords do not Match!"
            return;
        }
        if(register.value){
          loading.value = "Loading..."
          await registerRequest();
        }else{
          loading.value = "Loading..."
          await loginRequest();
          await fetchStudent();
          if(sessionStorage.getItem("role") == "PROFESSOR"){
            sessionStorage.setItem("adminPermission", true);
            router.push("/admin")
          }else if(sessionStorage.getItem("role") == "STUDENT"){
            sessionStorage.setItem("studentPermission", true);
            router.push("/students")
          }
    };
  }
</script>


<style>

.tabs {
  display: flex;
  justify-content: center;
  margin-top: 40px; /* Abstand nach oben anpassen */
}

.tabs ul{
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.tabs li {
  margin-right: 10px; /* Abstand zwischen den Tabs anpassen */
}

.tabs button {
  text-decoration: none;
  color: black; /* Tab-Farbe anpassen */
  padding: 10px 15px; /* Padding für die Tabs anpassen */
  border: 3px solid #ccc; /* Randfarbe anpassen */
  border-radius: 100px; /* Randradius anpassen */
}

.tabs button:hover {
  border-color: #f0f0f0; /* Hintergrundfarbe bei Hover anpassen */
}

.is-active button{
  background-color: #007bff; /* Aktive Tab-Hintergrundfarbe anpassen */
}

.card-auth-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.card-content {
  width: 350px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.field {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tinyInput {
  width: 31%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
</style>
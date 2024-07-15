<template>
    <header class="header">
      <div class="flex justify-between banner">
        <div class = "text-lg antialiased font-sans font-semibold ml-4">
          <label class="block" >Welcome  {{ signedUserName }}!</label>
        </div>
          <label class="">Student Web App</label>
          <button class="router-button2" @click="onSignOut"> Abmelden</button>
      </div>
    </header>

    <Popup v-if="popupTriggers" :TogglePopup="() => TogglePopup()">
            <h2 class="h2">Information:</h2>
            <p :class="errorMessageClass">{{ currentLabel }}</p>
    </Popup>

    <div class="container mx-auto w-2/4 mt-8">
      <h2 class="text-4xl font-sans text-center mb-20">Bearbeite Studenten</h2> 
      <div class="flex justify-center overflow-x-auto">
        <table class="table-auto rounded-lg overflow-hidden shadow-lg">
          <thead class="bg-gray-200">
            <tr>
              <th :class="tableHeadClass">Vorname</th>
              <th :class="tableHeadClass">Nachname</th>
              <th :class="tableHeadClass">E-Mail</th>
              <th :class="tableHeadClass">Rolle</th>
              <th :class="tableHeadClass">Optionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in studentData" :key="student.id" class="bg-white">
              <td :class= tupelClass(student)>{{ student.firstname }}</td>
              <td :class= tupelClass(student)>{{ student.lastname }}</td>
              <td :class= tupelClass(student)>{{ student.email }}</td>
              <td :class= tupelClass(student)>{{ student.role }}</td>
              <td><button class="del-button" @click="deleteUserAction(student.id)">Delete</button>
                <button class="del-button" @click="changeRoleAction(student.id)">Make Professor</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
    
  <script setup>
    import { ref, onMounted, inject, computed} from 'vue';
    import { useRouter } from 'vue-router';
    import  axios  from 'axios';
    import Popup from "./Popup.vue";
  
    const studentData = ref([]);
    const signedUser = ref("");
    const signedUserName = ref("");

    const router = useRouter();
    const isError = ref(true);


    const tableHeadClass = ref("px-6 py-3 border-b border-gray-300");

    const tupelClass = (student) => {
        if (isSignedUser(student)){
          return "px-6 py-4 whitespace-nowrap border-b border-gray-300 bg-blue-100"
        }else{
          return "px-6 py-4 whitespace-nowrap border-b border-gray-300";
        }
    };


    // Alle Labels zu Button aktionen die man macht

    const actionLabels = ref([
      "",
      "Rolle erfolgreich geändert",
      "Rolle eines Admins kann nicht geändert werden",
      "Du kannst Admins nicht löschen",
      "Student erfolgreich gelöscht",
      "Bitte melde dich erneut an, deine Session ist abgelaufen!",
      "Server antwortet nicht mehr, bitte versuche es später nochmal"
    ]);
    const currentLabelsIndex = ref(0);

    const currentLabel = computed(() => {
      return actionLabels.value[currentLabelsIndex.value];
    });

    const errorMessageClass = computed(() => {
      return isError.value ? 'pr': 'pg';
    });




    // Basic information geteilt über mehrere sichten aus der "App klasse heraus synchronisiert"
    const baseUrl = inject('baseUrl')
    const headerConfig= inject('headerConfig')
    const token = inject('token')



    const deleteUserAction = (id) => {
      deleteUserRequest(id);
      TogglePopup();
    }

    const deleteUserRequest = async (id) =>{

      await axios.delete(`${baseUrl}/student-control/${id}`, headerConfig)
      .then(function (response){
        console.log(`Erfolgreich den Studenten gelöscht${response}`);
        studentData.value = studentData.value.filter(student => student.id !== id);
        localStorage.setItem('studentsJSON', JSON.stringify(studentData.value));
        currentLabelsIndex.value = 4;
        isError.value = false;

      }).catch(function (error){
        console.log(`Es ist ein Fehler passiert:${JSON.stringify(error.response)}`);
        isError.value = true;
        if(error.response){
          if(error.response.status == 401){
            currentLabelsIndex.value = 5;
          }else{
            currentLabelsIndex.value = 3;
          }
        }else if(error.request){
            currentLabelsIndex.value = 6;
        }
      })};



    const changeRoleAction = (id) => {
      changeRoleRequest(id);
      TogglePopup();
    }

    const changeRoleRequest = async (id) =>{

      await axios.patch(`${baseUrl}/student-control/${id}`, {}, headerConfig)
      .then(function (response){
        currentLabelsIndex.value = 1;
        isError.value = false;
        alert("wir gehen in changeRoleLabel rein")
        changeRoleLabel(id)
        console.log(`Erfolgreich die Rolle des Studenten ${getUserFromId(id)} zu Professor geändert: ${JSON.stringify(response)}`)

      }).catch(function (error){
        console.log(`Leider ist ein fehler beim ändern der Rolle vorgefallen: ${JSON.stringify(error.response)}`)
        isError.value = true;
        if(error.response){
          if(error.response.status == 401){
            currentLabelsIndex.value = 5;
          }else{
            currentLabelsIndex.value = 2;
          }
        }else if(error.request){
            currentLabelsIndex.value = 6;
        }
      })
    };

    const changeRoleLabel = (id) =>{
      for (let i = 0; i < studentData.value.length; i++){
        if(studentData.value[i].id == id){
          studentData.value[i].role = "PROFESSOR";
        }
      }
      localStorage.setItem("studentsJSON", JSON.stringify(studentData.value))
      alert("changeRoleLabel ganz ausgeführt!")
    };

    const getUserFromId = (id) => {
        for(const student of studentData.value){
            if (student.id == id){
              return student.firstname
            }}};

    const isSignedUser = (student) => {
          if (student.email == signedUser.value){
            return true
          }else{false}};


    const popupTriggers = ref(false);

    const TogglePopup = () => {
      popupTriggers.value = !popupTriggers.value
    }

    const checkToken = async() =>{
      axios.get(`${baseUrl}/student-control`, headerConfig)
      .then(function (response){
        console.log(`Token noch up to Date: ${JSON.stringify(response)}`)
      }).catch(function(error){

        console.log(`Session abgelaufen, muss erneut angemeldet werdenn: ${JSON.stringify(error.response)}`);
        alert("Neu Anmelden bitte");
        onSignOut();
      })
    }


    onMounted(() => {
        token.value = sessionStorage.getItem("JWT-Token")
        headerConfig.headers.Authorization = `Bearer ${token.value}`
        checkToken();
        studentData.value = JSON.parse(localStorage.getItem('studentsJSON'));
        signedUser.value = sessionStorage.getItem("email");
        signedUserName.value = sessionStorage.getItem("user");
    });

  
    const onSignOut = (() => {
      localStorage.clear();
      sessionStorage.clear();
      token.value = null
      headerConfig.headers.Authorization = null
      router.push("/auth");
    });
  </script>


  
  <style>


      .h3 {
          font-size: 18px; /* Wähle die Schriftgröße */
          font-family: Arial, sans-serif; /* Wähle eine Schriftart */
      }

      .h2 {
          font-size: 22px; /* Wähle die Schriftgröße */
          font-family: Arial, sans-serif; /* Wähle eine Schriftart */
          font: bold
      }

      .pg {
        font-size: 16px; /* Wähle die Schriftgröße */
          font-family: sans-serif; /* Wähle eine Schriftart */
          font: bold;
          color: #34d399; /* Tailwind color 'text-green-500' */
      }

      .pr{
          font-size: 16px; /* Wähle die Schriftgröße */
          font-family: sans-serif; /* Wähle eine Schriftart */
          font: bold;
          color: #db5840; /* Tailwind color 'text-green-500' */
      }

      .router-button2 {
        border: 3px solid #ccc; /* Randfarbe anpassen */
        font-size: 12px;
        width: 10%;
        height: 45px;
        background-color: #007bff;
        color: #fff;
        border-radius: 10px;
        cursor: pointer;
      }

      .router-button2:hover {
        border-color: #071e24; /* Hintergrundfarbe bei Hover anpassen */
      }

      .del-button {
        width: 100%;
        padding: 3px;
        background-color: #4992e0;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        border: 3px solid #ffffff; /* Randfarbe anpassen */
      }

      .del-button:hover {
        border-color: #071e24; /* Hintergrundfarbe bei Hover anpassen */
      }

  </style>
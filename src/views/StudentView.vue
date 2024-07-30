<template>
  <header class="header">
    <div class="flex justify-between banner">
        <label class="text-lg antialiased font-sans font-semibold ml-4" >Welcome  {{ signedUserName }}!</label>
        <label class="">Student Web App</label>
        <button class="router-button2" @click="onSignOut"> Abmelden</button>
    </div>
  </header>
  <div class="container mx-auto w-2/4 mt-8">
    <h2 class="text-4xl font-sans text-center mb-8">Studentenliste</h2>
    <div class="flex justify-center overflow-x-auto">
      <table class="table-auto rounded-lg overflow-hidden shadow-lg">
        <thead class="bg-gray-200">
          <tr>
            <th :class="tableHeadClass">Vorname</th>
            <th :class="tableHeadClass">Nachname</th>
            <th :class="tableHeadClass">E-Mail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in studentData" :key="student.id" class="bg-white">
            <td :class="tupelClass(student)">{{ student.firstname }}</td>
            <td :class="tupelClass(student)">{{ student.lastname }}</td>
            <td :class="tupelClass(student)">{{ student.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

  
<script setup>
  import { ref, onMounted, inject} from 'vue';
  import { useRouter } from 'vue-router';
  import  axios  from 'axios';

  const studentData = ref([]);
  const signedUser = ref("");
  const signedUserName = ref("");

  const router = useRouter();
  
  const token = inject('token')
  const headerConfig = inject('headerConfig')
  const baseUrl = inject('baseUrl')


  const tableHeadClass = ref("px-6 py-3 border-b border-gray-300");

  const tupelClass = (student) => {
    if (isSignedUser(student)){
      return "px-6 py-4 whitespace-nowrap border-b border-gray-300 bg-blue-100"
    }else{
      return "px-6 py-4 whitespace-nowrap border-b border-gray-300";
    }
  };

  const isSignedUser = (student) => {
    if (student.email == signedUser.value){
      return true
    }else{false}};

  onMounted( () => {
      token.value = sessionStorage.getItem("JWT-Token")
      headerConfig.headers.Authorization = `Bearer ${token.value}`
      checkToken();
      studentData.value = JSON.parse(localStorage.getItem('studentsJSON'));
      signedUser.value = sessionStorage.getItem('email');
      signedUserName.value = sessionStorage.getItem('user');
  });

  const checkToken = async() =>{
      axios.get(`${baseUrl}/student`, headerConfig)
      .then(function (response){
        console.log(`Token noch up to Date: ${JSON.stringify(response)}`)
      }).catch(function(error){

        console.log(`Session abgelaufen, muss erneut angemeldet werdenn: ${JSON.stringify(error.response)}`);
        alert("Neu Anmelden bitte");
        onSignOut();
      })
    }

  const onSignOut = (() => {
    localStorage.clear();
    sessionStorage.clear();
    token.value = null
    headerConfig.headers.Authorization = null
    router.push("/auth");
  })
</script>

<style>
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
</style>
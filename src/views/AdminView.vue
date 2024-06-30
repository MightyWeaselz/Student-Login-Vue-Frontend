<template>
    <header class="header">
      <div class="flex justify-between banner">
          <label class="text-lg antialiased font-sans font-semibold ml-4" >Welcome  {{ signedUser }}!</label>
          <label class="">Student Web App</label>
          <button class="router-button2" @click="onSignOut"> Abmelden</button>
      </div>
    </header>
    <div class="container mx-auto w-2/4 mt-8">
      <h2 class="text-4xl font-sans text-center mb-8">Bearbeite Studenten</h2>
      <div class="flex justify-center overflow-x-auto">
        <table class="table-auto rounded-lg overflow-hidden shadow-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 border-b border-gray-300">E-Mail</th>
              <th class="px-6 py-3 border-b border-gray-300">Optionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in studentData" :key="student.id" class="bg-white">
              <td class="px-6 py-4 whitespace-nowrap border-b border-gray-300">{{ student.email }}</td>
              <td><button class="del-button" @click="deleteEmail(student.id)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
    
  <script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
  
    const studentData = ref([]);
    const signedUser = ref("");
    const router = useRouter();

    const deleteRequest = async ()=>{
      await axios.post(`${baseUrl}/auth/authenticate`, {
        email: credentials.email,
        password: credentials.passwort
      })
      .then(function (response){
          


      }).catch(error =>{



      })
    }
    

    const deleteEmail = (id) => {
      studentData.value = studentData.value.filter(student => student.id !== id);
    };
  
    onMounted( () => {
        studentData.value = JSON.parse(localStorage.getItem('studentsJSON'));
        signedUser.value = sessionStorage.getItem('user');
    });
  
    const onSignOut = (() => {
      localStorage.clear();
      sessionStorage.clear();
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

      .del-button {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
  </style>
<template>
    
    <header class="header">
        <div class="banner">
            Student Web App
        </div>
    </header>

    <div class="introduction">
        <h3>
            Willkommen zu meiner kleinen WebApp, <br>
            wo ich Studenten Registrieren, Anmelden und mit einer Datenbank verwalten kann, <br>
            bitte klicke auf Weiter, um dich Anzumelden oder zu Registrieren!
        </h3>
    </div>

    <div class="redirect-auth">
        <RouterLink to="/auth">
            <button class="router-button">
                Zur Authentifizierung
            </button>
        </RouterLink>
    </div>
</template>


<style>
    /* Definiere die Schriftart und Größe für den Header */
    .header {
        font-family: Arial, sans-serif; /* Wähle eine Schriftart */
        font-size: 30px; /* Wähle die Schriftgröße */
        font-weight: bold; /* Mache den Text fett */
        text-align: center;
    }

    h3 {
        font-size: 18px; /* Wähle die Schriftgröße */
        font-family: Arial, sans-serif; /* Wähle eine Schriftart */
    }

    .introduction {
        text-align: center;
        margin-top: 50px; /* Füge etwas Abstand zum oberen Rand hinzu */
    }

    .redirect-auth {
        text-align: center;
    }

    .banner {
        background-color: #f2f2f2; /* Wähle eine leicht graue Hintergrundfarbe */
        padding: 10px 0; /* Füge oben und unten etwas Platz hinzu */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Füge einen Schatten am unteren Rand hinzu */
    }

    .router-button {
        border: 3px solid #ccc; /* Randfarbe anpassen */
        font-size: large;
        width: 20%;
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 50px;
    }

    .router-button:hover {
        border-color: #f0f0f0; /* Hintergrundfarbe bei Hover anpassen */
    }



</style>

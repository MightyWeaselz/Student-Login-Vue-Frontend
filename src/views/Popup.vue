<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <button @click="TogglePopup" class="popup-close">
                Close
            </button>
        </div>
    </div>
</template>


<script setup>
    const { TogglePopup } = defineProps(['TogglePopup']);
</script>


<style>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    .popup-inner{
        background: #FFF;
        padding: 32px;
    }
}


.popup-close {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-close:hover {
  background-color: #0056b3;
}


</style>



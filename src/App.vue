<script setup>
import BaseInput from "./components/BaseInput.vue"

import {useStore} from "./stores/store"
import {reactive, computed, watch, onBeforeMount, onMounted,} from "vue";
import useVuelidate from "@vuelidate/core";
import {required,helpers,email,} from "@vuelidate/validators"

const store = useStore();

const fullNameValidation = (value) => {
 return /^[a-zA-Z]+ [a-zA-Z]+$/.test(value)
}

const belarusNumberValidation = (value) => {
  return /^\+375 \(([0-9]{2})\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value)
}

const formData = reactive({
  fullName: "",
  email: "",
  phone: ""
});

const rules = computed(() => {
  return {
    fullName: {fullNameValidation:helpers.withMessage("Type in your full name separated by space", fullNameValidation)},
    email: {required,email: helpers.withMessage("Type in valid email address", email)},
    phone: { belarusNumberValidation: helpers.withMessage("Phone number is not valid", belarusNumberValidation)}
  }
});

const v$ = useVuelidate(rules,formData);

const submitUser = async () => {
  const validation = await v$.value.$validate();
  if(validation){
    store.addUser(formData.fullName,formData.email,formData.phone)
  }
}

watch(()=>formData.phone,(newValue,oldValue) => {
  if(newValue.length === 20){
    formData.phone = newValue.slice(0,19)
  }
})

onBeforeMount(async ()=>{
  await store.fetchData();
})

onMounted(()=>{
  const element = document.getElementById('phone');
  const maskOptions = {
    mask: '+{375} (00) 000-00-00'
  };
  const mask = IMask(element, maskOptions);
})


</script>

<template>

  <main class="grid place-items-center content-center min-h-screen">

    <div class="bg-black p-[20px] rounded-[15px] shadow-2xl">
      <form
          @submit.prevent="submitUser"
          class="flex gap-[10px] items-center border-b-2 border-solid border-b-white pb-2 mb-2">
        <div class="relative pb-[43px]">
          <BaseInput v-model="formData.fullName" placeholder="Full Name" type="text"  />
          <div  v-for="(error,index) in v$.fullName.$errors" :key="index" class="absolute text-red-500 font-bold">{{error.$message}}</div>
        </div>
        <div class="relative pb-[43px]">
          <BaseInput v-model="formData.email" placeholder="Email" type="text"  />
          <div v-for="(error,index) in v$.email.$errors" :key="index" class="absolute text-red-500 font-bold">{{error.$message}}</div>
        </div>
        <div class="relative pb-[43px]">
          <BaseInput id="phone"  v-model="formData.phone" placeholder="Phone" type="text" />
          <div v-for="(error,index) in v$.phone.$errors" :key="index" class="absolute text-red-500 font-bold">{{error.$message}}</div>
        </div>
        <button type="submit" class="self-start active:translate-y-[2px] hover:text-black hover:bg-white text-white border-[2px] border-solid border-white px-[6px] py-[7px] rounded-[30px]" >Add</button>
      </form>
      <div>
        <ul >
          <li
              v-for="item in  store.filterSearch().value"
              :key="item.id"
              class="flex gap-10 mb-2 text-white">
            <input type="checkbox" :value="item" v-model="store.checkedItems">
            <div class="w-2/6">{{item.name}}</div>
            <div class="w-2/6">{{item.email}}</div>
            <div class="w-2/6">{{item.phone}}</div>
          </li>
        </ul>
        <div class="flex items-center justify-between border-t-2 border-solid border-t-white pt-[5px] text-white">
          <button @click="store.deleteUser().value" class="active:translate-y-[2px] hover:bg-red-500 hover:bg-white text-white border-[2px] border-solid border-white px-[6px] py-[3px] rounded-[30px]">Delete</button>
          <div class="flex gap-2">
            <div class="cursor-pointer hover:text-amber-700" @click="store.asc().value">asc</div><span>/</span><div class="cursor-pointer hover:text-amber-700" @click="store.desc().value">desc</div>
          </div>
          <div class="flex gap-[10px]">
            <BaseInput class="outline-0 p-1 text-black rounded-[10px]" type="text" placeholder="Search" v-model="store.search"/>
            <div>users count : {{store.filterSearch().value?.length}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center">
    </div>
  </main>
</template>

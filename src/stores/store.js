import { ref , computed, watch} from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export const useStore = defineStore('store', () => {


  const notyf = new Notyf();
  const usersData = ref(null);
  const checkedItems = ref([]);
  const search = ref('');

  async function fetchData(){
    if(JSON.parse(localStorage.getItem("usersData"))?.length === 0 || !JSON.parse(localStorage.getItem("usersData"))){
      usersData.value =  (await axios.get("https://jsonplaceholder.typicode.com/users\n")).data;
    }else{
      usersData.value = JSON.parse(localStorage.getItem("usersData"));
    }
  }

  function addUser(fullName, email, phone){
    if(usersData.value.some(item => item.name === fullName)){
      notyf.error('Name already exists');
    }else if(usersData.value.some(item =>  item.email === email )){
      notyf.error('Email address already exists');
    }else if(usersData.value.some(item => item.phone === phone)) {
      notyf.error('Phone number already exists');
    } else{
      usersData.value.unshift({name: fullName, email, phone,id: uuidv4()});
      localStorage.setItem("usersData",JSON.stringify(usersData.value))
    }
  }

  const deleteUser = () => computed( () => {
    usersData.value = usersData.value.filter(user => !checkedItems.value.includes(user));
    localStorage.setItem("usersData",JSON.stringify(usersData.value));
  })

  const asc = () => computed(() => {
    usersData.value = usersData.value.sort((a,b) => a.name.localeCompare(b.name));
    localStorage.setItem("usersData",JSON.stringify(usersData.value));
  })

  const desc = () => computed(()=>{
    usersData.value = usersData.value.sort((a,b) => a.name.localeCompare(b.name)).reverse();
    localStorage.setItem("usersData",JSON.stringify(usersData.value));
  })

  const filterSearch = () => computed(() => {
    return usersData?.value?.filter(user =>
        user.name.toLowerCase().replaceAll(" ", '').includes(search.value.toLowerCase().trim().replaceAll(" ", ''))
        || user.email.toLowerCase().replaceAll(" ", '').includes(search.value.toLowerCase().trim().replaceAll(" ", ''))
        || user.phone.toLowerCase().replaceAll(" ", '').includes(search.value.toLowerCase().trim().replaceAll(" ", ''))
    )
  })

  return { usersData, checkedItems, search, fetchData , addUser, deleteUser,asc,desc, filterSearch}
})

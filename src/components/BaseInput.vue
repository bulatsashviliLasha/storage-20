<template>
    <input
           class="outline-0 p-1 w-[250px] rounded-[10px]"
           :value="modelValue"
           @input="$emit('update:modelValue', $event.target.value)"
           :placeholder="placeholder"
           v-bind="$attrs"
    >
</template>

<script setup>
defineProps({
  placeholder: {
    type: [Boolean, String]
  },
  modelValue: {
    type: String,
    default: ""
  }
})
</script>


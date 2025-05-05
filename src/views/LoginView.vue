<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Button, InputText, Message, Toast } from 'primevue'
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { RouterLink } from 'vue-router'
const toast = useToast()

const initialValues = reactive({
  email: '',
})

const resolver = yupResolver(
  yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
  }),
)

const onFormSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
  if (valid) {
    toast.add({
      severity: 'success',
      summary: 'Form is submitted.',
      life: 3000,
    })
  }
}
</script>

<template>
  <div class="flex flex-col gap-3.5 justify-center items-center min-h-[100vh]">
    <Toast />
    <h1 class="text-black font-bold dark:text-white">Log in</h1>
    <Form
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-56"
    >
      <div class="flex flex-col gap-1">
        <InputText name="email" type="text" placeholder="Email" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>

      <RouterLink to="/register" class="text-center"> Don't have an account?</RouterLink>
      <Button type="submit" severity="secondary" label="Sign in" />
    </Form>
  </div>
</template>

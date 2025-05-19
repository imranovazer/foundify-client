<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Button, InputText, Message } from 'primevue'
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { createUser } from '@/api'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import type { User } from '@/types'

const toast = useToast()
const router = useRouter()
const store = useUserStore()

const initialValues = reactive({
  name: '',
  surname: '',
  username: '',
  email: '',
  phone: '',
  password: '',
})

const resolver = yupResolver(
  yup.object().shape({
    name: yup.string().required('Name is required.'),
    surname: yup.string().required('Surname is required.'),
    username: yup.string().required('Username is required.'),
    password: yup.string().required('Password us required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(/^\d+(\.\d+)?$/, 'Must be a valid number'),
  }),
)

const onFormSubmit = async (event: { valid: boolean; values: Record<string, any> }) => {
  const { valid, values } = event
  if (valid) {
    try {
      const res = await createUser(values as Omit<User, 'id'>)

      router.push('/login')
      toast.add({
        severity: 'success',
        summary: 'User registered login please.',
        life: 3000,
      })
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Something went wrong.',
        life: 3000,
      })
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-3.5 justify-center items-center min-h-[100vh]">
    <h1 class="text-black font-bold dark:text-white">Register</h1>
    <Form
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-56"
    >
      <div class="flex flex-col gap-1">
        <InputText name="name" type="text" placeholder="Name" fluid />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
          $form.name.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="surname" type="text" placeholder="Surname" fluid />
        <Message v-if="$form.surname?.invalid" severity="error" size="small" variant="simple">{{
          $form.surname.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="username" type="text" placeholder="Username" fluid />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
          $form.username.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="email" type="text" placeholder="Email" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="phone" type="text" placeholder="Phone number" fluid />
        <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">{{
          $form.phone.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="password" type="password" placeholder="Password" fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message
        }}</Message>
      </div>
      <RouterLink to="/login" class="text-center"> Already member?</RouterLink>

      <Button type="submit" severity="secondary" label="Register" />
    </Form>
  </div>
</template>

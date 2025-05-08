<script setup lang="ts">
import { deleteUser, updateUser } from '@/api'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { Button, Card, InputText, Message, Toast, useToast } from 'primevue'
import { computed, ref, watch } from 'vue'

import * as yup from 'yup'

const user = useUserStore()
const toast = useToast()
const initialValues = ref({
  name: '',
  surname: '',
  username: '',
  email: '',
  phone: '',
})

watch(
  () => user.user,
  (val) => {
    if (val) {
      initialValues.value = {
        name: val.name,
        surname: val.surname,
        username: val.username,
        email: val.email,
        phone: val.phone,
      }
    }
  },
  { immediate: true },
)

const handleDeleteUser = async () => {
  try {
    await deleteUser(user.user?.id as string)
    user.logOut()
    toast.add({
      severity: 'success',
      summary: 'Profile deleted',
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

// const resolver = yupResolver(
//   yup.object().shape({
//     name: yup.string().required('Name is required.'),
//     surname: yup.string().required('Surname is required.'),
//     username: yup.string().required('Username is required.'),
//     email: yup.string().email('Invalid email format').required('Email is required'),
//     phone: yup
//       .string()
//       .required('Phone number is required')
//       .matches(/^\d+(\.\d+)?$/, 'Must be a valid number'),
//   }),
// )

const onFormSubmit = async (event: { valid: boolean; values: Record<string, any> }) => {
  const { valid, values } = event
  if (valid) {
    try {
      const res = await updateUser(user.user?.id as string, values as Omit<User, 'id'>)

      user.authUser(res.data)

      toast.add({
        severity: 'success',
        summary: 'User updated.',
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
  <div class="w-full flex justify-center items-center mt-[100px]">
    <Card>
      <template #content>
        <Form
          v-slot="$form"
          :initial-values="initialValues"
          @submit="onFormSubmit"
          class="flex flex-col gap-4 w-full sm:w-80"
        >
          <div class="flex flex-col gap-1">
            <label for="name">Name</label>
            <InputText id="name" name="name" type="text" placeholder="Name" fluid />
            <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
              $form.name.error?.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="surname">Surname</label>
            <InputText id="surname" name="surname" type="text" placeholder="Surname" fluid />
            <Message v-if="$form.surname?.invalid" severity="error" size="small" variant="simple">{{
              $form.surname.error?.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="username">Username</label>
            <InputText id="username" name="username" type="text" placeholder="Username" fluid />
            <Message
              v-if="$form.username?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.username.error?.message }}</Message
            >
          </div>
          <div class="flex flex-col gap-1">
            <label for="email">Email</label>
            <InputText id="email" name="email" type="text" placeholder="Email" fluid />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
              $form.email.error?.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <label for="phone">Phone</label>
            <InputText id="phone" name="phone" type="text" placeholder="Phone number" fluid />
            <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">{{
              $form.phone.error?.message
            }}</Message>
          </div>

          <Button type="submit" severity="secondary" label="Update" />
        </Form>
        <Button
          class="w-full mt-3"
          severity="danger"
          label="Delete profile"
          @click="handleDeleteUser"
        />
      </template>
    </Card>
  </div>
  <Toast />
</template>

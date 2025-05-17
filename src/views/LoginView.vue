<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Button, InputText, Message, Toast } from 'primevue'
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { RouterLink, useRouter } from 'vue-router'
import { loginUser } from '@/api'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user'
import type { AuthDto, User } from '@/types'
import { saveToken } from '@/utils/localStorageUtils'
const toast = useToast()

const user = useUserStore()
const router = useRouter()
const initialValues = reactive({
  email: '',
  password : ''
})


const resolver = yupResolver(
  yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),

  }),
)

const onFormSubmit = async (event: { valid: boolean; values: Record<string, any> }) => {
  const { valid, values } = event
  console.log('LOGGG', values)

  if (valid) {
    type Token = { token: string }
    try {
      const res: AxiosResponse<Token> = await loginUser(values as AuthDto)

      saveToken(res.data.token)
      router.push('/');
      toast.add({
        severity: 'success',
        summary: 'Login is successfull.',
        life: 3000,
      })
    
    } catch (
      err
    ) {
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

      <div class="flex flex-col gap-1">
        <InputText name="password" type="text" placeholder="Password" fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message
        }}</Message>
      </div>

      <RouterLink to="/register" class="text-center"> Don't have an account?</RouterLink>
      <Button type="submit" severity="secondary" label="Sign in" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { createFoundItem, createLostItem, getFoundItems, getLostItems } from '@/api'
import FoundItemCard from '@/components/FoundItemCard.vue'
import LostItemCard from '@/components/LostItemCard.vue'
import { useUserStore } from '@/stores/user'
import { Category, Color, modalType, type FoundItem, type LostItem } from '@/types'
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import {
  Button,
  DatePicker,
  Dialog,
  Divider,
  FileUpload,
  InputText,
  Message,
  Select,
  Textarea,
  Toast,
  ToggleSwitch,
  useToast,
} from 'primevue'
import { onMounted, reactive, ref } from 'vue'
import * as yup from 'yup'

const foundItems = ref<FoundItem[]>([])
const lostItems = ref<LostItem[]>([])
const user = useUserStore()
const toast = useToast()
const checked = ref(false)
const modal = ref({ visibility: false, type: modalType.FOUND })
const fileUpload = ref()
const initialValues = reactive({
  title: '',
  description: '',
  location: '',
  date: '',
  category: Category.OTHER,
  color: Color.BLACK,
})

const colorOptions = ref(Object.values(Color).map((item) => ({ name: item })))

const categoryOptions = ref(Object.values(Category).map((item) => ({ name: item })))

const handleModalOpen = () => {
  modal.value = { visibility: true, type: modalType.FOUND }
}
const fetchFoundLoatItems = async () => {
  try {
    const [foundResponse, lostResponse] = await Promise.all([getFoundItems(), getLostItems()])
    const myFoundItems = foundResponse.data.filter(
      (item: FoundItem) => item.userId === user.user?.id,
    )
    const mylostItems = lostResponse.data.filter((item: LostItem) => item.userId === user.user?.id)
    foundItems.value = myFoundItems
    lostItems.value = mylostItems
  } catch (error) {}
}

onMounted(() => {
  fetchFoundLoatItems()
})
const resolver = yupResolver(
  yup.object().shape({
    title: yup.string().required('Title is required.'),
    description: yup.string().required('Description is required.'),
    location: yup.string().required('Location is required.'),
    category: yup.object().required('Category is required.'),
    color: yup.object().required('Color is required.'),
    date: yup.string().required('Date is required.'),
  }),
)

const onFormSubmit = async (event: { valid: boolean; values: Record<string, any> }) => {
  const { valid, values } = event
  if (valid) {
    const formatedJson = {
      ...values,
      [modal.value.type === modalType.FOUND ? 'dateFound' : 'dateLost']: new Date(values.date)
        .toISOString()
        .split('T')[0],
      userId: user.user?.id,
      category: values.category.name.name,
      color: values.color.name.name,
    }
    const formData = new FormData()
    formData.append('request', JSON.stringify(formatedJson))

    for (let i = 0; i < fileUpload.value.files.length; i++) {
      formData.append('images', fileUpload.value.files[i])
    }

    try {
      if (modal.value.type === modalType.FOUND) {
        await createFoundItem(formData)
      } else {
        await createLostItem(formData)
      }

      modal.value = { visibility: false, type: modalType.FOUND }
      fetchFoundLoatItems()

      toast.add({
        severity: 'success',
        summary: 'Item reported successfully.',
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

const toggleModal = (event: any) => {
  if (event.target.checked) {
    modal.value = { ...modal.value, type: modalType.LOST }
  } else {
    modal.value = { ...modal.value, type: modalType.FOUND }
  }
}
</script>

<template>
  <div class="w-full">
    <div class="container mx-auto flex flex-col justify-center items-center mt-[100px] gap-[30px]">
      <h1 class="font-bold text-4xl">Report items</h1>
      <Button class="w-full max-w-[200px]" label="Report " @click="handleModalOpen" />
      <div class="flex justify-between w-full">
        <div class="flex items-center flex-col gap-[20px] w-full">
          <h2 class="font-bold">Your found items</h2>

          <div
            v-if="foundItems.length === 0"
            class="flex justify-center items-center flex-col gap-[20px]"
          >
            <img src="/found-empty.svg" alt="found-empty" class="w-[200px]" />
            <span>No found items</span>
          </div>
          <div v-else class="flex flex-col gap-2 w-full p-5">
            <FoundItemCard v-for="foundItem in foundItems" type="FOUND" :item="foundItem" />
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex items-center flex-col gap-[20px] w-full">
          <h2 class="font-bold">Your lost items</h2>
          <div
            v-if="lostItems.length === 0"
            class="flex justify-center items-center flex-col gap-[20px]"
          >
            <img src="/lost-empty.svg" alt="found-empty" class="w-[200px]" />
            <span>No lost items</span>
          </div>
          <div v-else class="flex flex-col gap-2 w-full p-5">
            <LostItemCard v-for="lostItem in lostItems" :item="lostItem" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="modal.visibility"
    modal
    :header="modal.type === modalType.FOUND ? 'Report found item' : 'Report lost item'"
    :style="{ width: '100%', maxWidth: '35rem' }"
  >
    <div class="w-full flex gap-5 items-center my-4 justify-center">
      <span>Found</span>
      <ToggleSwitch v-model="checked" @change="(event) => toggleModal(event)" />
      <span>Lost</span>
    </div>
    <Form
      v-slot="$form"
      :initialValues
      @submit="onFormSubmit"
      :resolver="resolver"
      class="flex flex-col gap-4 mx-auto"
    >
      <div class="flex flex-col gap-1">
        <InputText name="title" type="text" placeholder="Title" fluid />
        <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">{{
          $form.title.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <Textarea name="description" type="text" placeholder="Description" fluid />
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{
          $form.description.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="location" type="text" placeholder="Location" fluid />
        <Message v-if="$form.location?.invalid" severity="error" size="small" variant="simple">{{
          $form.location.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <DatePicker name="date" type="text" placeholder="Report date" dateFormat="yy-mm-dd" />
        <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">{{
          $form.date.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <Select
          name="category.name"
          :options="categoryOptions"
          optionLabel="name"
          placeholder="Select a Category"
          fluid
        />
        <Message v-if="$form.category?.invalid" severity="error" size="small" variant="simple">{{
          $form.category.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <Select
          name="color.name"
          :options="colorOptions"
          optionLabel="name"
          placeholder="Select a Color"
          fluid
        />
        <Message v-if="$form.color?.invalid" severity="error" size="small" variant="simple">{{
          $form.color.error?.message
        }}</Message>
      </div>
      <div class="card">
        <FileUpload
          ref="fileUpload"
          name="files[]"
          :showUploadButton="false"
          :showCancelButton="false"
          :multiple="true"
          accept="image/*"
        >
          <template #empty>
            <span>Drag and drop images to here to upload.</span>
          </template>
        </FileUpload>
      </div>

      <Button type="submit" severity="info" label="Report" />
    </Form>
  </Dialog>
  <Toast />
</template>

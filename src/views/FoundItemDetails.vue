<script setup lang="ts">
import { deleteFoundItem, editFoundItem, getFoundItem, getFoundItemImage } from '@/api'
import { useUserStore } from '@/stores/user'
import { Category, Color, Status, type FoundItem } from '@/types'
import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import type { AxiosResponse } from 'axios'
import {
  Button,
  DatePicker,
  Dialog,
  Divider,
  FileUpload,
  Galleria,
  InputText,
  Message,
  Select,
  Tag,
  Textarea,
  useConfirm,
  useToast,
} from 'primevue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'

const confirm = useConfirm()
const router = useRouter()
const user = useUserStore()
const foundItem = ref<FoundItem>()

const confirmPosition = () => {
  confirm.require({
    group: 'positioned',
    message: 'Are you sure you want to delete found item?',
    header: 'Confirmation',
    icon: 'pi pi-info-circle',
    position: 'bottom',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      text: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
      text: true,
    },
    accept: async () => {
      try {
        await deleteFoundItem(foundItem.value?.id as string, user?.user?.id as string)
        toast.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Found item deleted',
          life: 3000,
        })
        router.push('/report-item')
      } catch (error) {}
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Rejected',
        detail: 'Process incomplete',
        life: 3000,
      })
    },
  })
}

const modal = ref(false)
const openModal = () => (modal.value = true)
const toast = useToast()
const route = useRoute()
const images = ref<string[]>([])

const colorOptions = ref(Object.values(Color).map((item) => ({ name: item })))
const categoryOptions = ref(Object.values(Category).map((item) => ({ name: item })))
const initialValues = ref({
  title: '',
  description: '',
  location: '',
  date: '',
  category: { name: Category.OTHER },
  color: { name: Color.BLACK },
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

const fetchFoundItem = async () => {
  try {
    const res: AxiosResponse<FoundItem> = await getFoundItem(route.params.id as string)
    foundItem.value = res.data
    initialValues.value = {
      title: res.data.title,
      description: res.data.description,
      location: res.data.location,
      date: res.data.dateFound,
      category: { name: res.data.category },
      color: { name: res.data.color },
    }
    const imagePromises = res.data.imageUrls.map((url: string) =>
      getFoundItemImage(url).then((res) => URL.createObjectURL(res.data)),
    )

    images.value = await Promise.all(imagePromises)
  } catch (error) {
    console.error('Error fetching found item or images:', error)
  }
}

onMounted(() => {
  fetchFoundItem()
})

const onFormSubmit = async (event: { valid: boolean; values: Record<string, any> }) => {
  const { valid, values } = event
  if (valid) {
    const formatedJson = {
      ...values,
      dateFound: new Date(values.date).toISOString().split('T')[0],
      userId: user.user?.id,
      category: values.category.name,
      color: values.color.name,
    }

    try {
      await editFoundItem(foundItem.value?.id as string, formatedJson as FoundItem)
      modal.value = false
      fetchFoundItem()

      toast.add({
        severity: 'success',
        summary: 'Item updated successfully.',
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
  <div class="container mx-auto px-3 mt-[100px] flex gap-2 justify-between">
    <div class="w-full flex flex-col gap-3 items-center">
      <div
        class="w-full max-w-[500px] bg-slate-100 dark:bg-gray-800 shadow-lg border-gray-300 font-bold text-2xl rounded-4xl px-4 py-2"
      >
        Found item details
      </div>
      <Galleria
        :showItemNavigatorsOnHover="true"
        :value="images"
        :numVisible="5"
        :circular="true"
        :showItemNavigators="true"
        containerStyle="max-width: 500px; width:100%; border-radius: 25px"
        :showThumbnails="false"
      >
        <template #item="slotProps">
          <img :src="slotProps.item" class="w-full h-[400px] object-cover object-center" />
        </template>
      </Galleria>
    </div>
    <div class="w-full flex flex-col gap-3 items-stretch">
      <h2 class="font-bold text-xl py-2">{{ foundItem?.title }}</h2>
      <div class="w-full flex gap-2">
        <div class="flex flex-col gap-2">
          <span>Date: </span>
          <span>{{ foundItem?.dateFound }}</span>
        </div>
        <Divider layout="vertical" />
        <div class="flex flex-col gap-2">
          <span>Address: </span>
          <span>{{ foundItem?.location }}</span>
        </div>
      </div>
      <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3 max-w-[400px]">
        {{ foundItem?.description }}
      </div>
      <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3 max-w-[400px]">
        <p class="flex item-center gap-2">
          <span class="font-bold"> Category: </span>
          <span>
            {{ foundItem?.category }}
          </span>
        </p>
        <Divider />
        <p class="flex item-center gap-2">
          <span class="font-bold"> Color: </span>
          <span>
            {{ foundItem?.color }}
          </span>
        </p>
        <Divider />
        <p class="flex item-center gap-2">
          <span class="font-bold"> Status: </span>
          <Tag :severity="foundItem?.status === Status.PENDING ? 'info' : 'danger'">{{
            foundItem?.status
          }}</Tag>
        </p>
      </div>
      <div class="flex justify-between max-w-[400px] mt-auto items-center gap-2">
        <Button rounded label="Edit" severity="info" class="w-full" @click="openModal" />
        <Button rounded label="Delete" severity="danger" class="w-full" @click="confirmPosition" />
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="modal"
    modal
    header="Edit found item"
    :style="{ width: '100%', maxWidth: '35rem' }"
  >
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
          name="category"
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
          name="color"
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

      <Button type="submit" severity="info" label="Edit" />
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import {
  deleteLostItemImage,
  addLostItemImages,
  deleteLostItem,
  editLostdItem,
  getLostItem,
  getLostItemImage,
} from '@/api'
import { useUserStore } from '@/stores/user'
import { Category, Color, Status, type LostItem } from '@/types'
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
const lostItem = ref<LostItem>()
const fileUpload = ref()

const confirmPosition = () => {
  confirm.require({
    group: 'positioned',
    message: 'Are you sure you want to delete lost item?',
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
        await deleteLostItem(lostItem.value?.id as string, user?.user?.id as string)
        toast.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Lost item deleted',
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
const images = ref<{ id: string; url: string }[]>([])

const imagesToDelete = ref<string[]>([])

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

const fetchLostItem = async () => {
  try {
    const res: AxiosResponse<LostItem> = await getLostItem(route.params.id as string)
    lostItem.value = res.data
    initialValues.value = {
      title: res.data.title,
      description: res.data.description,
      location: res.data.location,
      date: res.data.dateLost,
      category: { name: res.data.category },
      color: { name: res.data.color },
    }
    const imagePromises = res.data.imageUrls.map((url: string) =>
      getLostItemImage(url).then((res) => ({ id: url, url: URL.createObjectURL(res.data) })),
    )

    images.value = await Promise.all(imagePromises)
  } catch (error) {
    console.error('Error fetching lost item or images:', error)
  }
}

onMounted(() => {
  fetchLostItem()
})

const deleteSelectedImages = async () => {
  if (!lostItem.value?.id || !user.user?.id || imagesToDelete.value.length === 0) return

  const deletePromises = imagesToDelete.value.map((imageId) =>
    deleteLostItemImage(lostItem.value!.id, user.user!.id, imageId),
  )

  try {
    await Promise.all(deletePromises)
    console.log('All selected images deleted')
  } catch (err) {
    console.error('Error deleting images:', err)
  }
}
const addNewImage = async () => {
  const request = {
    foundItemId: lostItem.value?.id,
    userId: user?.user?.id,
  }
  const formData = new FormData()
  formData.append('request', JSON.stringify(request))
  for (let i = 0; i < fileUpload.value.files.length; i++) {
    formData.append('images', fileUpload.value.files[i])
  }

  await addLostItemImages(formData)

  try {
  } catch (err) {}
}

const onFormSubmit = async (event: { valid: boolean; values: Record<string, any> }) => {
  const { valid, values } = event
  if (valid) {
    const formatedJson = {
      ...values,
      dateLost: new Date(values.date).toISOString().split('T')[0],
      userId: user.user?.id,
      category: values.category.name,
      color: values.color.name,
    }

    try {
      await editLostdItem(lostItem.value?.id as string, formatedJson as LostItem)

      await deleteSelectedImages()
      if (fileUpload.value.files.length > 0) {
        await addNewImage()
      }
      modal.value = false
      fetchLostItem()

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

const toggleDelte = (id: string) => {
  const index = imagesToDelete.value?.indexOf(id)
  if (index === -1) {
    imagesToDelete.value?.push(id)
  } else {
    imagesToDelete.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="container mx-auto px-3 mt-[100px] flex gap-2 justify-between">
    <div class="w-full flex flex-col gap-3 items-center">
      <div
        class="w-full max-w-[500px] bg-slate-100 dark:bg-gray-800 shadow-lg border-gray-300 font-bold text-2xl rounded-4xl px-4 py-2"
      >
        Lost item details
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
          <img :src="slotProps.item.url" class="w-full h-[400px] object-cover object-center" />
        </template>
      </Galleria>
    </div>
    <div class="w-full flex flex-col gap-3 items-stretch">
      <h2 class="font-bold text-xl py-2">{{ lostItem?.title }}</h2>
      <div class="w-full flex gap-2">
        <div class="flex flex-col gap-2">
          <span>Date: </span>
          <span>{{ lostItem?.dateLost }}</span>
        </div>
        <Divider layout="vertical" />
        <div class="flex flex-col gap-2">
          <span>Address: </span>
          <span>{{ lostItem?.location }}</span>
        </div>
      </div>
      <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3 max-w-[400px]">
        {{ lostItem?.description }}
      </div>
      <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3 max-w-[400px]">
        <p class="flex item-center gap-2">
          <span class="font-bold"> Category: </span>
          <span>
            {{ lostItem?.category }}
          </span>
        </p>
        <Divider />
        <p class="flex item-center gap-2">
          <span class="font-bold"> Color: </span>
          <span>
            {{ lostItem?.color }}
          </span>
        </p>
        <Divider />
        <p class="flex item-center gap-2">
          <span class="font-bold"> Status: </span>
          <Tag :severity="lostItem?.status === Status.PENDING ? 'info' : 'danger'">{{
            lostItem?.status
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
    header="Edit lost item"
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
      <span class="font-bold">Choose images to delete : </span>
      <div v-if="images.length > 1" class="flex items-center gap-3 w-full">
        <div
          v-for="image in images"
          class="relative rounded-lg overflow-hidden cursor-pointer"
          @click="toggleDelte(image.id)"
        >
          <img
            :src="image.url"
            alt="to delete"
            class="w-[100px] h-[100px] object-cover object-center rounded-lg"
          />
          <div
            v-if="imagesToDelete?.includes(image.id)"
            class="absolute left-0 top-0 bg-red-500/50 w-full h-[100px]"
          ></div>
        </div>
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

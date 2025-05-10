<script setup lang="ts">
import { Approval } from '@/types' // This must be an enum, not just a type
import { Tag } from 'primevue'

const { status } = defineProps<{ status: Approval | undefined }>()
</script>

<template>
  <Tag v-if="status === Approval.NOT_REVIEWED" severity="info">Not reviewed</Tag>
  <Tag v-else-if="status === Approval.APPROVED" severity="success">Approved</Tag>
  <Tag v-else-if="status === Approval.REJECTED" severity="danger">Rejected</Tag>
</template>

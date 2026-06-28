<script setup lang="ts">
import { ref, watch } from 'vue'
import { message, Modal, Textarea } from 'ant-design-vue'
import { importSchema } from '@/utils/schema'
import type { FormSchema } from '@/types/schema'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ import: [schema: FormSchema] }>()

const text = ref('')

watch(open, (val) => {
  if (val) text.value = ''
})

function handleOk(): void {
  try {
    const schema = importSchema(text.value)
    emit('import', schema)
    message.success('导入成功')
    open.value = false
  } catch (e) {
    message.error((e as Error).message)
  }
}
</script>

<template>
  <Modal v-model:open="open" title="导入 JSON Schema" :width="640" @ok="handleOk">
    <Textarea
      v-model:value="text"
      :rows="16"
      placeholder='粘贴 JSON，如 {"version":"1.0","title":"...","fields":[...]}'
      style="font-family: monospace; font-size: 12px"
    />
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, Space, Typography } from 'ant-design-vue'
import { useDesignerStore } from '@/stores/designer'
import FormRenderer from '@/components/renderer/FormRenderer.vue'

const store = useDesignerStore()
const renderer = ref<InstanceType<typeof FormRenderer>>()
const result = ref<Record<string, unknown> | null>(null)

async function handleSubmit(): Promise<void> {
  try {
    const values = await renderer.value?.validate()
    result.value = values ?? {}
  } catch {
    result.value = null
  }
}

function handleReset(): void {
  renderer.value?.resetFields()
  result.value = null
}
</script>

<template>
  <div class="preview-pane">
    <Card :title="store.schema.title" class="preview-card">
      <FormRenderer ref="renderer" :schema="store.schema" />

      <template #actions>
        <Space>
          <Button type="primary" @click="handleSubmit">提交并校验</Button>
          <Button @click="handleReset">重置</Button>
        </Space>
      </template>
    </Card>

    <Card v-if="result" title="提交结果 (formData)" class="result-card">
      <Typography.Paragraph>
        <pre class="result-json">{{ JSON.stringify(result, null, 2) }}</pre>
      </Typography.Paragraph>
    </Card>
  </div>
</template>

<style scoped lang="less">
.preview-pane {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}
.preview-card {
  margin-bottom: 20px;
}
.result-json {
  margin: 0;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 6px;
  font-size: 12px;
  overflow: auto;
}
</style>

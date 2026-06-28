<script setup lang="ts">
import { computed } from 'vue'
import {
  Divider,
  Empty,
  Form,
  FormItem,
  Input as AInput,
  InputNumber,
  RadioButton,
  RadioGroup,
  Select,
  Switch,
} from 'ant-design-vue'
import type { FormFieldSchema } from '@/types/schema'
import { useDesignerStore } from '@/stores/designer'
import OptionsEditor from './OptionsEditor.vue'

const store = useDesignerStore()

const field = computed(() => store.activeField)
const hasOptions = computed(
  () => field.value && ['select', 'radio', 'checkbox'].includes(field.value.type),
)

function patch(partial: Partial<FormFieldSchema>): void {
  if (field.value) store.updateField(field.value.id, partial)
}

function patchProps(key: string, val: unknown): void {
  if (!field.value) return
  store.updateField(field.value.id, { props: { ...field.value.props, [key]: val } })
}
</script>

<template>
  <div class="property-panel">
    <div class="panel-title">{{ field ? '字段属性' : '表单设置' }}</div>

    <!-- 表单级设置 -->
    <Form v-if="!field" layout="vertical" class="prop-form">
      <FormItem label="表单标题">
        <AInput
          :value="store.schema.title"
          @update:value="(v: string) => (store.schema.title = v)"
        />
      </FormItem>
      <FormItem label="表单描述">
        <AInput
          :value="store.schema.description"
          @update:value="(v: string) => (store.schema.description = v)"
        />
      </FormItem>
      <FormItem label="布局">
        <RadioGroup
          :value="store.schema.layout"
          button-style="solid"
          @update:value="(v) => (store.schema.layout = v as 'horizontal' | 'vertical' | 'inline')"
        >
          <RadioButton value="horizontal">水平</RadioButton>
          <RadioButton value="vertical">垂直</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label="标签宽度(px)">
        <InputNumber
          :value="store.schema.labelWidth"
          :min="60"
          :max="200"
          style="width: 100%"
          @update:value="(v) => (store.schema.labelWidth = (v as number) ?? 100)"
        />
      </FormItem>
      <Empty description="点击画布中的字段以编辑其属性" style="margin-top: 24px" />
    </Form>

    <!-- 字段级设置 -->
    <Form v-else layout="vertical" class="prop-form">
      <FormItem v-if="field.type !== 'divider'" label="字段名 (field)">
        <AInput :value="field.field" @update:value="(v: string) => patch({ field: v })" />
      </FormItem>

      <FormItem label="标签 (label)">
        <AInput :value="field.label" @update:value="(v: string) => patch({ label: v })" />
      </FormItem>

      <template v-if="field.type !== 'divider'">
        <FormItem
          v-if="['input', 'textarea', 'number', 'select', 'date'].includes(field.type)"
          label="占位提示"
        >
          <AInput
            :value="field.placeholder"
            @update:value="(v: string) => patch({ placeholder: v })"
          />
        </FormItem>

        <FormItem label="栅格宽度 (1-24)">
          <InputNumber
            :value="field.span"
            :min="1"
            :max="24"
            style="width: 100%"
            @update:value="(v) => patch({ span: (v as number) ?? 24 })"
          />
        </FormItem>

        <div class="switch-row">
          <span>必填</span>
          <Switch
            :checked="field.required"
            @update:checked="(v) => patch({ required: v as boolean })"
          />
        </div>
      </template>

      <!-- number 专属 -->
      <template v-if="field.type === 'number'">
        <Divider>数字设置</Divider>
        <FormItem label="最小值">
          <InputNumber
            :value="field.props?.min as number"
            style="width: 100%"
            @update:value="(v) => patchProps('min', v)"
          />
        </FormItem>
        <FormItem label="最大值">
          <InputNumber
            :value="field.props?.max as number"
            style="width: 100%"
            @update:value="(v) => patchProps('max', v)"
          />
        </FormItem>
      </template>

      <!-- date 专属 -->
      <template v-if="field.type === 'date'">
        <Divider>日期设置</Divider>
        <FormItem label="格式">
          <Select
            :value="(field.props?.format as string) ?? 'YYYY-MM-DD'"
            style="width: 100%"
            :options="[
              { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
              { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
            ]"
            @update:value="(v) => patchProps('format', v)"
          />
        </FormItem>
        <div class="switch-row">
          <span>显示时间</span>
          <Switch
            :checked="(field.props?.showTime as boolean) ?? false"
            @update:checked="(v) => patchProps('showTime', v as boolean)"
          />
        </div>
      </template>

      <!-- 选项编辑 -->
      <template v-if="hasOptions">
        <Divider>选项配置</Divider>
        <OptionsEditor
          :model-value="field.options ?? []"
          @update:model-value="(v) => patch({ options: v })"
        />
      </template>
    </Form>
  </div>
</template>

<style scoped lang="less">
.property-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}
.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 16px;
}
.prop-form :deep(.ant-form-item) {
  margin-bottom: 14px;
}
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 14px;
  color: #4e5969;
}
</style>

---
title: 'Vue.js 3とComposition APIで作るモダンWebアプリ'
description: 'Vue.js 3の新機能Composition APIを使った効率的なWebアプリケーション開発手法'
pubDate: '2024/06/19'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

Vue.js 3は、パフォーマンスの向上と開発体験の改善を目的とした大幅なアップデートです。特にComposition APIの導入により、より柔軟で再利用可能なコンポーネント開発が可能になりました。

## Composition APIとは

Composition APIは、従来のOptions APIに代わる新しいAPI設計です。関数ベースのアプローチにより、ロジックの再利用性と型推論が大幅に向上しています。

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>カウント: {{ count }}</p>
    <button @click="increment">増加</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const title = ref('Vue.js 3 Demo')
const count = ref(0)

const increment = () => {
  count.value++
}

const doubleCount = computed(() => count.value * 2)
</script>
```

## リアクティビティシステムの改善

Vue.js 3では、Proxy-based リアクティビティシステムが採用され、より効率的な変更検知が可能になりました。

### ref と reactive の使い分け

```javascript
import { ref, reactive } from 'vue'

// プリミティブ値には ref を使用
const count = ref(0)
const message = ref('Hello Vue 3')

// オブジェクトには reactive を使用
const state = reactive({
  user: {
    name: 'Taro',
    email: 'taro@example.com'
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
})
```

### Composables による機能の分離

再利用可能なロジックをComposablesとして分離することで、コンポーネントの可読性と保守性が向上します。

```javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

## パフォーマンス最適化のポイント

### Tree-shaking の活用

Vue.js 3では、必要な機能のみをインポートすることで、バンドルサイズを大幅に削減できます。

```javascript
// 必要な機能のみインポート
import { createApp, ref, computed, watch } from 'vue'
import MyComponent from './MyComponent.vue'

const app = createApp({
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    watch(count, (newVal) => {
      console.log(`カウントが${newVal}に変更されました`)
    })
    
    return { count, doubleCount }
  }
})

app.mount('#app')
```

### Suspense コンポーネント

非同期コンポーネントの読み込み状態を管理するSuspenseコンポーネントが新たに追加されました。

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>読み込み中...</div>
    </template>
  </Suspense>
</template>
```

## 移行のベストプラクティス

Vue.js 2からVue.js 3への移行時に注意すべきポイント：

### 1. 段階的な移行

- Migration Build を使用した段階的移行
- 既存のOptions APIコードはそのまま動作
- 新機能からComposition APIを導入

### 2. TypeScript との親和性

Composition APIはTypeScriptとの親和性が高く、型推論が大幅に改善されています。

```typescript
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const user: Ref<User | null> = ref(null)
const userName = computed(() => user.value?.name ?? 'Unknown')
```

### 3. パフォーマンス監視

Vue DevtoolsでComposition APIの状態を監視し、パフォーマンスを最適化できます。

## まとめ

Vue.js 3とComposition APIにより、より保守性が高く、型安全で高性能なWebアプリケーションの開発が可能になりました。段階的な移行により、既存プロジェクトでも安全に新機能を活用できます。

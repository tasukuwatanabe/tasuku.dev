---
title: 'React 18の新機能と実装のポイント'
description: 'React 18で追加された新機能について詳しく解説します'
pubDate: '2022/07/08'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

React 18がリリースされ、多くの新機能と改善が追加されました。この記事では、特に注目すべき新機能について詳しく解説していきます。

## Concurrent Features

React 18の最大の特徴は、Concurrent Featuresの導入です。これにより、ユーザーインターフェースの応答性が大幅に向上しました。

### Automatic Batching

以前のReactでは、イベントハンドラー内でのstate更新のみがバッチ処理されていました。React 18では、Promise、setTimeout、ネイティブイベントハンドラー内での更新も自動的にバッチ処理されます。

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // React 18では自動的にバッチ処理される
    setCount(c => c + 1);
    setFlag(f => !f);
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

### Suspense の改善

Server-side renderingでのSuspenseサポートが追加され、コンポーネントの遅延読み込みがより効率的になりました。

## 新しいHooks

### useId

`useId`は、アクセシビリティ属性のためのユニークIDを生成するHookです。サーバーサイドレンダリングとクライアントサイドで一貫したIDを生成できます。

```javascript
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
}
```

### useDeferredValue

緊急性の低い更新を延期することで、より重要な更新を優先できます。

```javascript
function App() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </div>
  );
}
```

## まとめ

React 18は、パフォーマンスの向上とDeveloper Experienceの改善に重点を置いたメジャーアップデートです。段階的に移行していくことで、既存のアプリケーションも恩恵を受けることができます。

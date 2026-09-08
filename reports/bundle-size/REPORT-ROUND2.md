# Báo cáo tối ưu bundle — đợt 2

Ngày: 08/09/2026. Các thay đổi tiếp tục trên đợt tối ưu trước, cùng dependency đã cài, không bỏ tính năng khỏi cấu hình demo.

## Kết quả

- JS tải ban đầu của playground: **666.49 → 555.74 KB gzip**, giảm **16.62%** trong đợt này.
- So với baseline trước cả hai đợt: **1,035.61 → 555.74 KB gzip**, giảm **46.34%**.
- Fixture editor có provider và chỉ dùng bubble văn bản: **321.88 → 220.19 KB gzip**, giảm **31.59%**. KaTeX và Yjs không còn trong graph tải ban đầu của fixture này.

Đơn vị thập phân: 1 KB = 1.000 bytes. Các bước cộng dồn; không cộng các mức giảm của fixture khác nhau. Baseline đợt 2 được build lại nên chênh lệch nhỏ với file `final.json` của đợt 1.

| Bước / JSON gốc | JS playground ban đầu, KB gzip | Fixture bubble văn bản, KB gzip |
|---|---:|---:|
| [Trước đợt 2](round2-baseline.json) | 666.49 | 321.88 |
| [Tách bubble và helper chung](round2-bubbles.json) | 667.06 | 220.19 |
| [KaTeX tải khi cần](round2-katex.json) | 579.96 | 220.19 |
| [Emoji picker và gợi ý tải khi cần](round2-emoji.json) | 555.74 | 220.19 |
| [Cuối đợt 2, gồm sửa CJS interop](round2-final.json) | 555.74 | 220.19 |

| Chỉ số | Trước đợt 2, KB | Sau đợt 2, KB |
|---|---:|---:|
| JS ban đầu playground, raw | 2,440.42 | 2,078.26 |
| JS ban đầu playground, gzip | 666.49 | 555.74 |
| Tổng JS playground, raw | 11,105.56 | 11,103.42 |
| Tổng gzip các file JS playground | 3,487.02 | 3,486.57 |
| CSS playground, gzip | 54.11 | 54.11 |
| Toàn bộ ESM thư viện, raw | 792.70 | 804.13 |
| Toàn bộ CJS thư viện, raw | 587.88 | 598.43 |

Tổng JS của demo gần như giữ nguyên vì demo vẫn dùng đủ tính năng. Dung lượng phát hành thư viện tăng nhẹ do thêm entry/chunk và loader. Đây là giảm lượng tải ban đầu, đồng thời loại dependency thừa cho consumer ít tính năng; không phải mọi chỉ số đều giảm.

## Đã thay đổi

### 1. Bubble và các helper dùng chung

- Thêm 15 entry riêng cho các nhóm bubble, mỗi entry có ESM/CJS và declaration. Entry `/bubble` cũ giữ nguyên các named export.
- `useAttributes` và helper JSON nằm trong chunk dùng chung riêng, tránh nằm chung với renderer KaTeX.
- Regression test build qua **cả `/bubble` và `/bubble/text`** xác nhận bubble văn bản không giữ `katex`, `yjs`, `@tiptap/y-tiptap`, `@tiptap/extension-drag-handle` trong graph ban đầu.
- Sửa `output.interop: 'auto'` để CJS đọc đúng default export của dependency ESM-interop như Tiptap Italic. Smoke test cả 15 entry đã qua. Test ESM/CJS chạy ở process tách biệt để không trộn hai instance Yjs.

Có thể tiếp tục import như cũ hoặc dùng entry cụ thể:

```tsx
import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble/text';
import { RichTextBubbleImage, RichTextBubbleVideo } from 'reactjs-tiptap-editor/bubble/media';
import { RichTextBubbleMenuDragHandle } from 'reactjs-tiptap-editor/bubble/drag-handle';
```

Các subpath: `text`, `callout`, `columns`, `drawer`, `excalidraw`, `iframe`, `katex`, `link`, `media`, `mermaid`, `table`, `twitter`, `drag-handle`, `codeblock`, `ai`.

### 2. KaTeX

- Thay ba import renderer tĩnh ở toolbar, bubble và node view bằng `KatexPreview` và loader dùng chung.
- Renderer chỉ tải khi preview được mount: mở dialog hoặc có node công thức trong tài liệu. Không có công thức và không mở dialog thì không tải parser.
- Các preview dùng cùng loader chia sẻ promise/renderer; lỗi tải không bị cache vĩnh viễn; có nút Retry. Placeholder và công thức không hợp lệ được render như text, không chèn HTML thô. Node view chịu được chuỗi percent-encoding bị lỗi.
- Thêm option `loadKatex` để consumer đăng ký plugin trước khi render. Playground tải `mhchem` cùng KaTeX qua option này, thay cho import tĩnh; vẫn hỗ trợ công thức hóa học.
- Đây là render bất đồng bộ: lần đầu có thể thấy text placeholder trước khi renderer sẵn sàng. Nếu server render component preview, công thức chỉ hoàn thiện sau khi client tải renderer.

Ví dụ giữ hỗ trợ hóa học và tải khi cần:

```tsx
import { Katex } from 'reactjs-tiptap-editor/katex';
import 'katex/dist/katex.min.css';

const math = Katex.configure({
  loadKatex: async () => {
    const [{ default: katex }] = await Promise.all([
      import('katex'),
      import('katex/contrib/mhchem'),
    ]);
    return katex;
  },
});
```

KaTeX hiện chưa cung cấp declaration cho subpath `mhchem`; playground có khai báo `declare module 'katex/contrib/mhchem';`. Không cấu hình loader thì extension mặc định tải renderer KaTeX cơ bản.

### 3. Emoji

- Popup/picker Frimousse được tải khi người dùng mở popover; có Loading/Retry như các tính năng tải động khác.
- Danh sách gợi ý `playground/src/emojis.ts` được tải khi callback gợi ý chạy, không import sẵn ở đầu app.
- Giữ extension Emoji và dictionary mặc định của Tiptap. Lệnh shortcode, node `emoji`, HTML round-trip và dữ liệu tài liệu cũ giữ nguyên. Không đạt toàn bộ mức ~96 KB của phép thử bỏ hẳn Emoji ở lượt review, vì lần này không bỏ tính năng đó.

## Xác minh

- Production build thư viện và playground: pass sau mỗi bước.
- `pnpm type-check`, `pnpm test:types`, `pnpm --dir playground exec tsc --noEmit`: pass. Bổ sung typing cho Header/debug editor và module mhchem trong playground.
- Node suite: **13 test pass** (KaTeX cache/retry, Word, locale, AI, highlighting).
- Bundle/API suite: **3 test pass**, bao phủ 15 entry ESM/CJS/declaration và hai cách import bubble văn bản.
- Browser production: **11 kiểm tra KaTeX/Emoji pass**, cộng **15 kiểm tra Word/upload/Drawer pass**.
- Browser dev cũng qua 11 kiểm tra mới; thao tác chọn Emoji thực tế chèn đúng vào editor và đóng popup.
- Lint các phần logic mới/sửa và kiểm tra format: pass; `git diff --check`: pass.

Test mới bao phủ không tải KaTeX lúc mount, chemistry preview, chia sẻ renderer giữa dialog/node view, encoding lỗi, fallback text an toàn, retry, shortcode/schema/HTML round-trip của Emoji, mở và mở lại picker. Chưa tự động kiểm thử mọi macro, công thức phức tạp hoặc mọi đường tương tác drag/drop collaboration.

## Chạy lại

```sh
pnpm measure:bundle review-round2
pnpm type-check
pnpm test:types
pnpm --dir playground exec tsc --noEmit
node --test tests/bundle-isolation.test.mjs
pnpm exec esno --test tests/katex-loader.test.ts tests/word-export.test.ts tests/locale-loading.test.ts tests/rangi-performance.test.ts tests/ai-client.test.ts
pnpm exec vite --config tests/vite.config.ts
```

Mở `http://127.0.0.1:5199/tests/bundle-features.html` và `http://127.0.0.1:5199/tests/bundle-loading.html`. Reload trang để chạy lại; không sửa source trong lúc các kiểm tra tự động đang chạy.

Để tự thử demo: `pnpm build:playground`, sau đó `pnpm preview`. Trong DevTools Network, bật Disable cache rồi reload: parser KaTeX và picker Frimousse không còn trong graph ban đầu. Mở công thức/Emoji để thấy các request tải động. Khi tài liệu có công thức ngay từ đầu, renderer vẫn sẽ được tải sau mount.

## Những phần chủ động giữ lại

- Yjs vẫn có trong demo đầy đủ vì demo vẫn bật DragHandle; consumer chỉ dùng bubble văn bản đã loại được dependency này.
- Dictionary Emoji Tiptap vẫn tải cùng extension để giữ schema và shortcode.
- CSS KaTeX/EasyDrawer/Excalidraw vẫn import như trước. Tách CSS cần một đợt riêng để kiểm tra portal/font/first-open.
- Giữ API icon theo chuỗi. Chưa thay renderer hay xóa tính năng chỉ để giảm số đo.

Gzip được cộng theo từng file; graph ban đầu chỉ theo import tĩnh. Không suy ra thời gian LCP/parse từ số bytes. Trường `initialPackagesBeforeMinification` dùng để chẩn đoán dependency, không phải kích thước truyền mạng. [Báo cáo đợt 1](REPORT.md) và [review dẫn tới đợt 2](REVIEW-NEXT.md) được giữ lại để đối chiếu.

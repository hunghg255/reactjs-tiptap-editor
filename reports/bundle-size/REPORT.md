# Báo cáo tối ưu bundle — reactjs-tiptap-editor

> **Cập nhật đợt 2:** JS ban đầu hiện còn **555.74 KB gzip**, giảm **46.34%** so với baseline gốc. Xem [báo cáo mới nhất](REPORT-ROUND2.md). Các số dưới đây lưu lại kết quả đợt 1.

Ngày thực hiện: 08/09/2026. Phiên bản package: 1.0.38.
Baseline dựa trên commit `1b646d3dd94fe2de7dcfce5e09673d0db850529d`, trước các thay đổi trong lần tối ưu này.
Môi trường đo: Node v24.15.0, Vite 6.4.3, cùng dependency đã cài và cùng playground bật đầy đủ tính năng.

## Kết quả chính

**JS tải ban đầu của playground giảm từ 1,035.61 xuống 666.70 KB gzip: giảm 368.90 KB, tương đương 35.62%.**

Consumer tối thiểu có `RichTextProvider` giảm từ 206.00 xuống 134.25 KB gzip. Tổng JS của playground gần như giữ nguyên: phần Word và Drawer được chuyển sang tải khi dùng.

**Dung lượng toàn bộ ESM của thư viện tăng nhẹ**, do thêm entry locale, chunk tải động và xử lý loading/retry. Đây là tối ưu lượng tải ban đầu của ứng dụng; không phải giảm mọi chỉ số hoặc giảm dung lượng cài dependency.

## So sánh tổng hợp

Đơn vị thập phân: 1 KB = 1.000 bytes. Chênh lệch âm là giảm.

| Chỉ số | Trước | Sau | Chênh lệch |
|---|---:|---:|---:|
| Playground: JS tải ban đầu, raw | 3,770.85 KB | 2,440.41 KB | -1,330.44 KB |
| Playground: JS tải ban đầu, gzip | 1,035.61 KB | 666.70 KB | -368.90 KB |
| Playground: toàn bộ JS, raw | 11,116.56 KB | 11,105.55 KB | -11.01 KB |
| Playground: toàn bộ JS, tổng gzip từng file | 3,487.73 KB | 3,487.44 KB | -0.29 KB |
| Playground: CSS, gzip | 54.09 KB | 54.11 KB | 0.02 KB |
| Consumer tối thiểu có provider: JS ban đầu, gzip | 206.00 KB | 134.25 KB | -71.75 KB |
| Thư viện: toàn bộ ESM, raw | 778.93 KB | 792.74 KB | 13.81 KB |
| Thư viện: toàn bộ ESM, tổng gzip từng file | 222.71 KB | 240.37 KB | 17.66 KB |
| Thư viện: toàn bộ CJS, raw | 570.45 KB | 587.88 KB | 17.43 KB |

## Kết quả sau từng bước

Các bước **cộng dồn** trên cùng codebase. Mỗi JSON lưu kích thước chính xác theo byte, danh sách chunk và package trong graph import tĩnh.

| Bước / dữ liệu gốc | JS playground ban đầu, KB raw | JS playground ban đầu, KB gzip | Consumer có provider, KB gzip |
|---|---:|---:|---:|
| [Baseline](baseline.json) | 3,770.85 | 1,035.61 | 206.00 |
| [1. Word tải khi dùng](step-1-word.json) | 2,880.79 | 794.55 | 194.71 |
| [2. Dialog upload tải khi mở](step-2-provider.json) | 2,877.12 | 795.27 | 135.87 |
| [3. Drawer canvas tải khi mở](step-3-drawer.json) | 2,440.31 | 667.27 | 135.87 |
| [4. Tách locale, giữ entry cũ](step-4-locales.json) | 2,440.40 | 666.68 | 134.27 |
| [Final: hoàn thiện listener và kiểm tra](final.json) | 2,440.41 | 666.70 | 134.25 |

### 1. Import/Export Word

- `src/extensions/ImportWord/components/RichTextImportWord.tsx`: tải `mammoth` khi chọn DOCX; nhánh `convert` tùy chỉnh không tải Mammoth. Đọc file và tải module song song; chờ hoàn tất xử lý nội dung trước khi tắt loading; có xử lý lỗi.
- `src/extensions/ExportWord/createWordBlob.ts`: chuyển serializer cùng `docx`/`prosemirror-docx` sang module tải động.
- `src/extensions/ExportWord/ExportWord.ts`: lệnh Tiptap vẫn trả boolean. `true` nghĩa là đã nhận yêu cầu; lỗi serialize/download được xử lý bất đồng bộ. `editor.can().exportToWord(...)` không tải serializer hoặc tạo download.
- JS ban đầu giảm khoảng **241.06 KB gzip** ở bước này.

### 2. Provider và dialog upload

- Provider import trực tiếp `TooltipProvider`.
- `SlashDialogTrigger` giữ listener nhẹ và chỉ tải dialog ảnh/video sau yêu cầu mở đầu tiên. Trạng thái mở được truyền xuống, tránh mất sự kiện trong lúc tải module. Sau lần đầu, component được giữ lại để bảo toàn trạng thái form.
- Truyền ID ổn định từ provider vào listener, tránh đăng ký bằng ID chưa được gán khi mới mount; đã kiểm tra hai editor cùng trang.
- `LazyContent` cung cấp loading, error boundary và nút Retry tạo lại lazy component khi import thất bại.
- Consumer tối thiểu giảm **58.84 KB gzip** so với bước Word.
- Playground đủ tính năng tăng khoảng 0.72 KB gzip ở bước này: toolbar vẫn dùng các UI đó trực tiếp, còn wrapper tải động có một ít overhead. Không tính đây là mức giảm cho mọi app.

### 3. Drawer

- `RichTextDrawer` và `EditDrawerBlock` chỉ tải `DrawerCanvas` khi dialog mở.
- `DrawerCanvas` dùng chung logic tạo/sửa; `easydrawer` và `ControlDrawer` nằm sau ranh giới tải động.
- Dùng ref tới DOM thay cho ID toàn cục và timer 200 ms; dọn toolbar/editor khi đóng; chỉ cho lưu sau khi khởi tạo xong. Trạng thái clear/undo thuộc từng canvas.
- Giảm thêm **128.00 KB gzip** tải ban đầu.

### 4. Locale

- Core chỉ chứa tiếng Anh; API mới `/locale` và `/locales/*` hỗ trợ chọn dictionary.
- `/locale-bundle` cũ vẫn đăng ký đủ 7 ngôn ngữ khi được import. Playground giữ entry này, không bỏ ngôn ngữ để làm đẹp số đo.
- Đánh dấu side effects cho entry đăng ký locale và CSS trong `package.json` để bundler giữ đăng ký dictionary và stylesheet.
- Dictionary thiếu key sẽ fallback về tiếng Anh.
- Fixture chỉ giữ API locale: Anh + Việt **9.53 KB gzip**; đủ ngôn ngữ **19.98 KB gzip**. Đây là so sánh riêng trên code cuối cùng, không phải số giảm của toàn editor.

Cách dùng entry nhẹ:

```tsx
import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale';
import vi from 'reactjs-tiptap-editor/locales/vi';

localeActions.setMessage('vi', vi);
localeActions.setLang('vi');
```

Giữ `reactjs-tiptap-editor/locale-bundle` nếu muốn hành vi tự nạp đủ ngôn ngữ như trước.

### 5. Icon — đã đánh giá, giữ tương thích

Không đổi API `icon: string` và registry toàn cục trong lần này. Thay hoàn toàn bằng component đòi hỏi cập nhật nhiều extension và cách cấu hình icon của consumer.

Sau khi tách provider, `lucide-react` và registry không còn trong graph JS ban đầu của fixture provider tối thiểu. Playground dùng đủ toolbar vẫn giữ icon. Đây là kết quả của bước provider, không tính thêm một mức giảm riêng cho icon.

## Kiểm tra đã thực hiện

- Build production thư viện và playground thành công ở từng bước; có cả ESM và CJS.
- `pnpm type-check`: pass.
- `pnpm test:types`: pass, gồm kiểm tra entry locale mới.
- Smoke test các entry locale qua cả ESM import và CJS require: pass.
- `pnpm lint`: exit 0; repository vẫn có warning ở các phần khác. Lint riêng phần thay đổi: không có warning/error.
- Node regression suite: **11 test pass**, gồm Word round-trip, locale, AI client và highlighting.
- Browser regression trên Chrome: **15 check pass ở dev và 15 check pass ở production đã minify**:
  - Không tự mở dialog khi mount.
  - Sự kiện mở ảnh đầu tiên không bị mất; chỉ mở đúng một editor; mở lại được.
  - Video mở trong editor thứ hai.
  - Word `can()` không tạo download; export tạo DOCX; import khôi phục văn bản.
  - Drawer khởi tạo controls, lưu node, mở lại và tải SVG để sửa/lưu.
- `git diff --check`: pass.

Test Word tự động bao phủ văn bản, Unicode, xuống dòng và đoạn văn. Chưa tự động kiểm tra mọi kiểu bảng/list, tài liệu Word phức tạp, dịch vụ upload thật hoặc toàn bộ công cụ vẽ.

## Cách tự đo và kiểm tra lại

Từ thư mục gốc repository:

```sh
pnpm measure:bundle review
```

Lệnh rebuild thư viện, build playground trong bộ nhớ và đo các consumer fixture. Kết quả được lưu tại `reports/bundle-size/review.json`; không ghi đè `playground/dist`. Chọn tên mới để giữ dữ liệu trước đó; dùng lại một tên sẽ ghi đè JSON mang tên đó.

Các trường nên so sánh với `baseline.json` và `final.json`:

- `playground.initialJS`: chỉ các chunk đi từ entry theo import tĩnh.
- `playground.totalJS`: mọi chunk, gồm cả tải động.
- `minimal.withProvider.initialJS`: fixture giữ `EditorContent`, `useEditor`, `RichTextProvider`; không cấu hình extension hoặc import CSS.
- `localeFixtures`: so sánh locale chọn lọc với entry đầy đủ.
- `initialPackagesBeforeMinification`: đóng góp module trước minify, dùng để tìm nguyên nhân; **không phải kích thước truyền qua mạng**. Ở bản cuối, `docx`, `mammoth`, `easydrawer` không có trong graph import tĩnh của playground.

Chạy regression:

```sh
pnpm type-check
pnpm test:types
pnpm exec esno --test tests/word-export.test.ts tests/locale-loading.test.ts tests/rangi-performance.test.ts tests/ai-client.test.ts
pnpm exec vite --config tests/vite.config.ts
```

Mở `http://127.0.0.1:5199/tests/bundle-loading.html`. Trang tự chạy và hiển thị `ALL 15 CHECKS PASSED`. Reload trang để chạy lại từ đầu; tránh sửa source trong lúc test đang chạy.

Để thử đầy đủ demo production:

```sh
pnpm build:playground
pnpm preview
```

### Checklist thủ công

- [ ] DevTools Network: bật Disable cache, reload; xác nhận chunk Word/Drawer chưa tải ở lần đầu.
- [ ] Import DOCX thực tế có bảng, list, hình ảnh; thử nhánh `convert` tùy chỉnh và lỗi chuyển đổi.
- [ ] Export nội dung hiện có rồi mở DOCX bằng Word/LibreOffice.
- [ ] Mở upload ảnh/video bằng slash command; thử URL, file, crop, upload lỗi và hai editor cùng trang.
- [ ] Mở Drawer, vẽ nét/hình/chữ, Undo/Redo/Clear, lưu, mở sửa và lưu lại; thử callback upload thật.
- [ ] Đổi ngôn ngữ qua entry cũ; thử `/locale` + `/locales/vi` ở app chỉ dùng Anh/Việt.
- [ ] Throttle mạng hoặc tạm chặn chunk để kiểm tra Loading/Retry và thao tác đóng/mở nhanh.

## Giới hạn số đo và phần có thể tối ưu tiếp

Gzip là kết quả nén từng file tại máy đo, chưa gồm HTTP headers; tổng gzip không phải gzip của một file ghép. Kích thước thư viện chưa gồm dependency external và không bao gồm declaration trong bảng JS. Không cộng ESM và CJS để suy ra lượng trình duyệt tải.

`initialJS` dựa trên graph import tĩnh, không phải đo Lighthouse, LCP, thời gian parse hoặc toàn bộ request runtime. Những chunk được kích hoạt bởi nội dung tài liệu sau mount có thể vẫn tải sớm. CSS/font cũng có cơ chế tải riêng. Các thay đổi dependency, minifier hoặc nội dung playground có thể làm kết quả khác đi.

KaTeX, dữ liệu Emoji, React/Tiptap và Yjs vẫn đóng góp đáng kể cho demo đủ tính năng. Mermaid/Excalidraw đã có tải động. Có thể tối ưu thêm các nhóm này trong một đợt riêng theo nhu cầu tính năng thực tế. Chưa thay đổi API icon hoặc loại bỏ extension khỏi demo.

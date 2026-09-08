# Review bổ sung: hướng giảm bundle tiếp theo

Ngày: 08/09/2026. Review source và build các biến thể trong bản sao tạm; không sửa source sản phẩm. [Dữ liệu đo](review-next.json).

## Phép đo loại bỏ từng tính năng

Baseline của cùng lượt đo là 666.21 KB gzip. Các biến thể độc lập, không cộng dồn mức giảm. Bỏ tính năng là phép đo chẩn đoán; không có nghĩa lazy-load riêng UI sẽ đạt cùng mức giảm. Số baseline có sai lệch nhỏ so với report trước do artifact build lại.

| Biến thể | JS ban đầu, KB gzip | Giảm so với baseline, KB gzip |
|---|---:|---:|
| Đầy đủ tính năng | 666.21 | 0.00 |
| Bỏ Katex + toolbar/bubble + CSS/mhchem | 655.93 | 10.28 |
| Bỏ Emoji + picker + danh sách gợi ý | 570.28 | 95.93 |
| Bỏ bubble DragHandle | 664.43 | 1.78 |
| Chỉ bỏ mhchem | 657.58 | 8.63 |

## 1. Ưu tiên cao: cô lập dependency của bubble và hook dùng chung

`src/bubble.ts` phát hành tất cả bubble qua một entry. `lib/bubble.js` hiện import trực tiếp `@tiptap/extension-drag-handle-react`. Package DragHandle import `@tiptap/extension-collaboration` và `@tiptap/y-tiptap` ngay ở module scope.

Do đó, comment cấu hình collaboration trong playground không loại được Yjs. Trong phép đo bỏ DragHandle, Yjs vẫn còn nguyên đóng góp 260.467 bytes trước minify. Không nên coi đây là dependency chỉ được tải khi bật collaboration.

Một chunk KaTeX được build hiện chứa cả `useAttributes` và `safeJSONParse`, được bubble khác sử dụng. Chunk này import trực tiếp `katex`. Khi bỏ Katex khỏi cấu hình và UI, parser vẫn còn 599.483 bytes trước minify.

**Hướng sửa:** cung cấp entry riêng cho từng bubble; tách các hook/utility dùng chung khỏi chunk tính năng nặng, rồi đo consumer chỉ có bubble văn bản. Có thể thử `preserveModules` hoặc điều chỉnh grouping có kiểm soát, nhưng phải kiểm tra lại exports ESM/CJS, CSS và declaration. Không đặt `moduleSideEffects: false` cho toàn bộ dependency một cách mù quáng.

Tiêu chí đạt: consumer không dùng Katex/DragHandle không còn `katex`, `yjs`, `@tiptap/y-tiptap` trong graph tải ban đầu.

## 2. Emoji: ứng viên giảm code thực sự lớn nhất đã đo

`src/extensions/Emoji/Emoji.ts` import extension Emoji của Tiptap. Bản đang cài giữ một dictionary mặc định lớn ngay trong `addOptions()`. Playground còn dùng `EMOJI_LIST` riêng cho gợi ý. Picker Frimousse có cơ chế lấy dữ liệu riêng khi được dùng.

Bỏ cả tính năng Emoji giảm khoảng 95,93 KB gzip. Đây là mức đóng góp của nhóm tính năng trong demo, không phải mức giảm đã thực hiện.

**Hướng sửa:** thống nhất dữ liệu gợi ý/picker khi phù hợp; cung cấp lựa chọn emoji Unicode nhẹ cho app không cần toàn bộ shortcode/fallback metadata. Nếu vẫn dùng extension Tiptap hiện tại, chỉ truyền `emojis: []` hoặc lazy-load popup chưa bảo đảm loại được dictionary mặc định khỏi bundle. Cần kiểm tra node `emoji`, paste/input rules, shortcode, skin tone và tài liệu đã lưu trước khi thay implementation.

## 3. KaTeX: tải renderer lúc cần, xử lý cả đường import hóa học

Ba UI/renderer đang import `katex` tĩnh:

- `src/extensions/Katex/components/RichTextKatex.tsx`
- `src/extensions/Katex/components/KatexWrapper.tsx`
- `src/components/Bubble/RichTextBubbleKatex.tsx`

Nên dùng một loader chung cho renderer và chỉ tải khi mở dialog hoặc tài liệu có node công thức. Editor không có công thức được hưởng lợi; tài liệu đã có công thức vẫn cần renderer sớm.

Playground cũng import `katex/contrib/mhchem` ngay từ đầu. Chỉ bỏ phần hỗ trợ hóa học này giảm 8,63 KB gzip trong phép đo, nhưng làm mất lệnh hóa học; nên tách thành lựa chọn hoặc tải cùng renderer khi có nhu cầu. Nếu giữ import mhchem tĩnh, việc lazy-load các component KaTeX sẽ không đủ.

## 4. CSS và icon: ưu tiên sau

Playground đang tải tĩnh CSS của KaTeX, EasyDrawer và Excalidraw, dù phần JavaScript vẽ đã tải động. Có thể tách CSS theo tính năng ở app; cần kiểm tra first-open, flash of unstyled content, portal và font. Library hiện gom CSS nên không chỉ di chuyển một import trong source là đủ.

Registry icon theo chuỗi vẫn giữ toàn bộ icon được đăng ký. Cho phép component icon trực tiếp ở API mới và chuyển dần built-in sẽ giúp consumer ít extension; giữ đường tương thích cho icon chuỗi. Demo bật đủ toolbar khó giảm đáng kể ở phần này.

## Những thay đổi chưa nên làm để “giảm size”

- Tăng `chunkSizeWarningLimit` chỉ ẩn cảnh báo.
- `manualChunks` chỉ chia file nếu vẫn tải tất cả ngay ban đầu.
- External thêm dependency làm `lib` nhỏ hơn nhưng app consumer vẫn phải bundle dependency đó.
- Không suy ra React bị bundle hai lần chỉ từ việc có hai version trong node_modules: graph ban đầu đã kiểm tra chỉ giữ một version React.

Thứ tự đề xuất: **cô lập bubble/common chunks → Emoji nhẹ → loader KaTeX/mhchem → CSS/icon**. Chưa cam kết mức giảm tổng cho tới khi triển khai và đo lại với đầy đủ tính năng cần giữ.

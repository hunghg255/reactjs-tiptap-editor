export const RESET_CSS = `
.reactjs-tiptap-editor, .richtext-dialog-content {
  button,
  input:where([type=button]),
  input:where([type=reset]),
  input:where([type=submit]) {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none
  }

  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
  }

  button {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
  }
}

.reactjs-tiptap-editor,
.richtext-dialog-content,
div[data-radix-popper-content-wrapper],
div[data-tippy-root] {
*,
:before,
:after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: hsl(var(--richtext-border));
}

background-color: hsl(var(--richtext-background));
color: hsl(var(--richtext-foreground));


html,
:host {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
  font-feature-settings: normal;
  font-variation-settings: normal;
  -webkit-tap-highlight-color: transparent
}

hr {
  height: 0;
  color: inherit;
  border-top-width: 1px
}

a {
  color: inherit;
  text-decoration: inherit
}

b,
strong {
  font-weight: bolder
}

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  font-feature-settings: normal;
  font-variation-settings: normal;
  font-size: 1em
}

table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse
}

input, textarea {
  border-width: 1px;
}

textarea {
  resize: vertical
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  color: #9ca3af
}

button, input, textarea {
  cursor: pointer;
  color: inherit;
}

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  vertical-align: middle
}

img,
video {
  max-width: 100%;
  height: auto
}
}
`
